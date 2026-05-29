# Rosetta pipeline runbook

## Deploy

1. `infra/snowflake_setup.sql` once per account (warehouse, schemas, roles).
2. Deploy the connector: `cd connectors/rosetta_source && fivetran deploy --api-key <KEY> --destination <DEST> --connection rosetta_source --configuration configuration.json`.
3. dbt: `cd transform && dbt deps`. CI runs `dbt build` (Slim CI builds only
   changed models + downstream on a PR).
4. Schedule: enable the `rosetta_pipeline` Airflow DAG (or a dbt Cloud job
   triggered on Fivetran sync completion).

## Rollback

- **Bad mart**: marts are `table`; the prior version stays live until a build
  passes. Revert the offending model commit and re-run `dbt build`; the gate
  must pass before the new marts publish.
- **Bad connector deploy**: redeploy the previous connector revision; the
  watermark state is preserved, so the next sync resumes cleanly.

## Common issues

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| Source freshness error | Connector sync failed / paused | Check Fivetran dashboard; resume the connector; freshness clears next sync |
| dbt contract error on a mart | A column type or name changed | The contract did its job — fix the model or update the contract deliberately |
| GX expectation failed (row count) | Upstream row added/dropped | Confirm intended; update the fixture + the expected count together |
| MAR spike | Someone ran a re-sync | Expected — a re-sync re-reads history. Confirm it was intentional |
| `accepted_values` test fails on `owner` | New owner value introduced | Add it to the test set AND the app's Owner type in lockstep |

## Changing the content

The marts are the canonical model of the structured guide data (stages,
pillars, terms). To change them: edit the connector fixture under
`connectors/rosetta_source/fixtures/`, bump that row's `source_updated_at`, then
re-sync + `dbt build`. Keep the app's `src/lib/content.ts` and the fixtures in
agreement — the static site renders a curated snapshot of these gold tables.

## Disaster recovery

- Raw is reproducible: a full re-sync rebuilds `jason_chletsos_rosetta` from
  source. Marts rebuild from raw via `dbt build`. No state is unique to the
  warehouse except the connector watermark, which Fivetran persists.
- Iceberg snapshots give point-in-time recovery (time travel) for the lake copy.
