# Monitoring & cost

## What we watch

| Signal | Source | Threshold / alert |
| --- | --- | --- |
| Connector sync status | Fivetran dashboard / API | Any failed sync -> page |
| Sync MAR consumption | Fivetran usage API | Daily MAR > 2x trailing-7-day median -> warn (re-sync or churn spike) |
| Source freshness | `dbt source freshness` | warn 36h, error 60h after last `_synced_at` |
| dbt build result | `run_results.json` | Any model error or test failure -> page |
| dbt test pass rate | `run_results.json` | < 100% on marts -> page (target > 99% overall) |
| GX checkpoint | Great Expectations validation result | Any failed expectation -> Slack `#data-quality` |
| Pipeline wall-clock | Airflow SLA | DAG > 2h -> SLA miss email |

Structured logs carry a correlation id (the Airflow `run_id`) across the
Fivetran sync, the dbt build, and the GX run so a single failure is traceable
end to end.

## Cost notes

- **Warehouse**: `xsmall`, `auto_suspend = 60s`. This dataset is tiny; compute
  cost is dominated by idle avoidance, not size.
- **MAR**: the connector skips unchanged rows (watermark compare), so a no-change
  daily sync costs ~zero MAR. A re-sync re-reads history and will spike MAR —
  expected, and called out in the runbook before anyone triggers one.
- **Storage**: Iceberg files target 512MB-1GB; expire snapshots older than 7
  days; lifecycle the object store hot -> IA after 30 days.
- **dbt**: marts are `table` (small, rebuilt cheaply); staging is `view` (no
  storage). If volume grew, staging would move to incremental on `synced_at`.
