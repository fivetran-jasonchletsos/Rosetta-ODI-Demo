-- Open-lake landing in Apache Iceberg (Snowflake-managed Iceberg tables).
-- The ODI pattern: land in an open table format so Snowflake, Spark, Trino, and
-- the Fivetran Managed Data Lake can all read the same files. Fivetran can land
-- directly into Iceberg; this mirrors the raw schema into the lake for openness.

-- External volume backing the Iceberg files (object storage).
create external volume if not exists rosetta_lake
  storage_locations = (
    (
      name = 'rosetta-s3'
      storage_provider = 'S3'
      storage_base_url = 's3://jason-chletsos-rosetta-lake/'
      storage_aws_role_arn = 'arn:aws:iam::000000000000:role/rosetta-iceberg'
    )
  );

create or replace iceberg table analytics.jason_chletsos_rosetta_marts.fct_term_translation_iceberg (
    term_id        string,
    fivetran_term  string,
    dbt_term       string,
    boundary_type  string,
    maps_cleanly   boolean
)
  catalog = 'SNOWFLAKE'
  external_volume = 'rosetta_lake'
  base_location = 'marts/fct_term_translation/';

-- Maintenance (run on a schedule):
--   alter iceberg table ... refresh;                       -- pick up external writes
--   alter table ... cluster by (boundary_type);            -- sort/cluster for pruning
-- Snapshot expiration and small-file compaction are handled by the catalog's
-- table maintenance; target 512MB-1GB data files, expire snapshots > 7 days.
