-- Rosetta warehouse / database / role setup (Snowflake).
-- Run as ACCOUNTADMIN (or a role with CREATE privileges). Least-privilege:
-- the Fivetran connector loads into the raw schema; the transformer role owns
-- the dbt-built schemas; the reader role only selects from marts.

-- Warehouse: small, auto-suspend fast — this workload is tiny and bursty.
create warehouse if not exists rosetta_wh
  warehouse_size = 'xsmall'
  auto_suspend = 60
  auto_resume = true
  initially_suspended = true;

create database if not exists analytics;

-- Schemas — every schema stays prefixed jason_chletsos_ per workspace convention.
create schema if not exists analytics.jason_chletsos_rosetta;          -- raw (Fivetran lands here)
create schema if not exists analytics.jason_chletsos_rosetta_staging;  -- dbt staging (views)
create schema if not exists analytics.jason_chletsos_rosetta_marts;    -- dbt marts (tables)

-- Roles
create role if not exists loader;       -- Fivetran
create role if not exists transformer;  -- dbt
create role if not exists reader;       -- BI / app / GX

-- Loader: write only into the raw schema.
grant usage on warehouse rosetta_wh to role loader;
grant usage on database analytics to role loader;
grant usage, create table on schema analytics.jason_chletsos_rosetta to role loader;

-- Transformer: read raw, build staging + marts.
grant usage on warehouse rosetta_wh to role transformer;
grant usage on database analytics to role transformer;
grant usage on schema analytics.jason_chletsos_rosetta to role transformer;
grant select on all tables in schema analytics.jason_chletsos_rosetta to role transformer;
grant select on future tables in schema analytics.jason_chletsos_rosetta to role transformer;
grant all on schema analytics.jason_chletsos_rosetta_staging to role transformer;
grant all on schema analytics.jason_chletsos_rosetta_marts to role transformer;

-- Reader: select on marts only.
grant usage on warehouse rosetta_wh to role reader;
grant usage on database analytics to role reader;
grant usage on schema analytics.jason_chletsos_rosetta_marts to role reader;
grant select on all tables in schema analytics.jason_chletsos_rosetta_marts to role reader;
grant select on future tables in schema analytics.jason_chletsos_rosetta_marts to role reader;
