# Rosetta data pipeline

The reference ODI pipeline that backs the Rosetta enablement guide. It is the
architecture the guide teaches, built as runnable artifacts: a Fivetran
Connector SDK source, an open Iceberg/Snowflake landing, a dbt project
(sources → staging → marts with contracts + tests + a semantic layer), a
Great Expectations quality gate, and sync-completion → dbt orchestration.

## Flow

```
  rosetta_source (Fivetran Connector SDK)
      catalog · stages · pillars · terms
                 │   incremental, watermark-based, MAR-conscious
                 ▼
  ANALYTICS.jason_chletsos_rosetta            ← raw landed tables  (loader role)
      │  also mirrored to Iceberg on S3 (open lake)
      ▼
  dbt  (transformer role)            ── the seam: dbt source() points at the
      staging/  (views)                 exact tables the connector wrote
        stg_fivetran__connector_catalog
        stg_rosetta__pipeline_stage / __product_pillar / __term_translation
      marts/    (tables, enforced contracts)
        dim_connector · dim_pipeline_stage · dim_product_pillar · fct_term_translation
      semantic/  (MetricFlow)
        metrics: total_terms, clean_mappings, clean_mapping_rate, total_pillars
                 │
                 ▼
  Great Expectations gate  →  dbt docs / Data Docs  →  reader role
      (independent validation)                          BI · the static app · GX
```

## Why these choices

- **ELT, not ETL.** Fivetran lands raw; dbt transforms in-warehouse. The
  warehouse compute is where modeling belongs, and it keeps the raw layer
  replayable.
- **Lakehouse landing (Iceberg).** Open table format so the same files serve
  Snowflake, Spark, and the Fivetran Managed Data Lake — no lock-in, the "open"
  in Open Data Infrastructure.
- **Connector SDK over a bespoke script.** Managed scheduling, incremental
  state, and schema evolution come for free; the connector only describes
  *what* to pull, not *how* to run reliably.
- **Contracts on marts.** The gold tables publish an enforced schema — the app
  and BI consume a stable contract, and a breaking change fails the build, not
  the dashboard.
- **Two layers of data quality.** dbt tests run inside the DAG (fast, co-located
  with the logic); Great Expectations validates the published marts
  independently and produces Data Docs. Fivetran stewards GX, so this is the
  combined move + transform + validate story made concrete.

## Scalability & failure modes

- **Volume.** Reference data is tiny. If it grew, staging moves from `view` to
  `incremental` on `synced_at`; marts stay `table`. Warehouse scales by size,
  not rewrite.
- **Interrupted sync.** The connector checkpoints per table, so a resumed sync
  continues at the last watermark — no full re-pull, no duplicate rows (upsert
  on primary key).
- **Bad upstream data.** dbt tests + the GX gate stop the chain before the marts
  publish; the prior good marts stay live until the rebuild passes.
- **Stale data.** `dbt source freshness` flags a missed sync (warn 36h / error
  60h) independently of whether the build "succeeded."

## Run it

```bash
# 1. Connector (local debug sync into DuckDB)
cd connectors/rosetta_source && pip install -r requirements.txt && python connector.py

# 2. Warehouse + schemas (once)
snowsql -f infra/snowflake_setup.sql

# 3. dbt
cd transform && dbt deps && dbt build && dbt source freshness

# 4. Independent quality gate
cd quality && great_expectations checkpoint run rosetta_marts_checkpoint
```

See `ops/runbook.md` for operational procedures and `infra/monitoring.md` for
what's watched and the cost posture.
