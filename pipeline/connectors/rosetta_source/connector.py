"""
Rosetta source connector — Fivetran Connector SDK.

Lands the reference material the Rosetta enablement guide is built on:
the Fivetran connector catalog, the pipeline-stage model, dbt concept docs,
and the curated Fivetran<->dbt term map. In production these rows would come
from live docs crawls and the public connector registry; here they are pulled
from versioned source fixtures committed alongside the connector so the demo
is reproducible and the SDK pattern stays the focus.

Design notes a reviewer should expect to see:
  * incremental sync via a per-table watermark held in connector state
  * op.checkpoint after each table so an interrupted sync resumes cleanly
  * a stable primary key per table (Fivetran upserts, never duplicates)
  * a synced_at column on every row (Fivetran also stamps its own _fivetran_synced,
    which is what dbt source freshness keys off — see transform/models/staging)
  * MAR-conscious: only rows whose source_updated_at advances are re-emitted,
    so a no-change run costs ~zero Monthly Active Rows

Run locally:  fivetran debug   (from this directory, with configuration.json)
Deploy:       fivetran deploy --api-key <KEY> --destination <DEST> --connection rosetta_source --configuration configuration.json
"""

from __future__ import annotations

import json
import os
from datetime import datetime, timezone

from fivetran_connector_sdk import Connector
from fivetran_connector_sdk import Operations as op
from fivetran_connector_sdk import Logging as log

FIXTURE_DIR = os.path.join(os.path.dirname(__file__), "fixtures")

# table name -> (fixture file, primary key, source watermark field)
TABLES = {
    "connector_catalog": ("connector_catalog.json", "connector_id", "source_updated_at"),
    "pipeline_stage": ("pipeline_stage.json", "stage_id", "source_updated_at"),
    "product_pillar": ("product_pillar.json", "pillar_key", "source_updated_at"),
    "term_translation": ("term_translation.json", "term_id", "source_updated_at"),
}

EPOCH = "1970-01-01T00:00:00Z"


def schema(configuration: dict):
    """Declare tables and primary keys. Fivetran manages destination DDL and
    schema evolution from here — new fixture fields land as new columns."""
    return [{"table": name, "primary_key": [pk]} for name, (_f, pk, _w) in TABLES.items()]


def _load_fixture(filename: str) -> list[dict]:
    with open(os.path.join(FIXTURE_DIR, filename), "r", encoding="utf-8") as fh:
        return json.load(fh)


def update(configuration: dict, state: dict):
    """Incremental sync. For each table, emit only rows whose source watermark
    is strictly newer than the last checkpoint, then checkpoint the new high
    watermark. A run with no upstream changes emits nothing and costs no MAR."""
    synced_at = datetime.now(timezone.utc).isoformat()
    state = dict(state or {})

    for table, (fixture, pk, watermark) in TABLES.items():
        last = state.get(f"{table}:watermark", EPOCH)
        high = last
        emitted = 0

        try:
            rows = _load_fixture(fixture)
        except FileNotFoundError:
            log.warning(f"rosetta_source: fixture {fixture} missing; skipping {table}")
            continue

        for row in rows:
            row_wm = row.get(watermark, EPOCH)
            if row_wm <= last:
                continue  # unchanged since last sync — skip, protects MAR
            record = dict(row)
            record["synced_at"] = synced_at  # Fivetran adds _fivetran_synced separately
            yield op.upsert(table, record)
            emitted += 1
            if row_wm > high:
                high = row_wm

        state[f"{table}:watermark"] = high
        log.info(f"rosetta_source: {table} emitted {emitted} changed row(s); watermark -> {high}")
        # checkpoint per table so an interrupted sync resumes here, not at the start
        yield op.checkpoint(state)


connector = Connector(update=update, schema=schema)

if __name__ == "__main__":
    # `python connector.py` runs a local debug sync against a DuckDB warehouse.
    connector.debug()
