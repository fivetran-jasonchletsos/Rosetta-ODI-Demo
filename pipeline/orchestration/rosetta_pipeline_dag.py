"""
Rosetta pipeline orchestration (Airflow).

This DAG encodes the literal seam of the merger story:

    Fivetran sync  ->  (sync completes)  ->  dbt build  ->  data-quality gate  ->  docs

The dbt run is triggered ON SYNC COMPLETION, not on an independent clock, so the
gold marts are always built on fresh data. Order matters: stage and mart with
dbt (which runs its own tests in `dbt build`), then run the standalone Great
Expectations checkpoint over the published marts as an independent gate, then
refresh docs / Data Docs. A failure anywhere stops the chain and alerts.

Sensors and operators are illustrative — wire to the Fivetran + dbt Cloud
providers (airflow.providers.fivetran, airflow.providers.dbt.cloud) in a real
deployment. Retries use exponential backoff; SLAs alert if the chain slips.
"""

from __future__ import annotations

from datetime import datetime, timedelta

from airflow import DAG
from airflow.operators.bash import BashOperator
from airflow.operators.empty import EmptyOperator

default_args = {
    "owner": "jason.chletsos",
    "retries": 3,
    "retry_delay": timedelta(minutes=2),
    "retry_exponential_backoff": True,
    "max_retry_delay": timedelta(minutes=20),
    "sla": timedelta(hours=2),
    "email_on_failure": True,
    "email": ["jason.chletsos@fivetran.com"],
}

with DAG(
    dag_id="rosetta_pipeline",
    description="Fivetran sync -> dbt build -> GX gate -> docs for the Rosetta enablement guide",
    schedule="@daily",
    start_date=datetime(2026, 5, 20),
    catchup=False,
    default_args=default_args,
    tags=["rosetta", "fivetran", "dbt", "odi"],
) as dag:

    start = EmptyOperator(task_id="start")

    # 1) Trigger the Fivetran connector sync and wait for it to finish.
    #    In production: FivetranOperator + FivetranSensor (deferrable).
    fivetran_sync = BashOperator(
        task_id="fivetran_sync_rosetta_source",
        bash_command="echo 'trigger + await rosetta_source sync (FivetranSensor)'",
    )

    # 2) The seam: only once the sync has landed do we build the models.
    #    `dbt build` runs models AND their tests, snapshots, and seeds in DAG order.
    dbt_build = BashOperator(
        task_id="dbt_build",
        bash_command="cd /opt/rosetta/transform && dbt build --target prod",
    )

    # 3) Source freshness — confirm the landed data is actually fresh post-sync.
    dbt_freshness = BashOperator(
        task_id="dbt_source_freshness",
        bash_command="cd /opt/rosetta/transform && dbt source freshness --target prod",
    )

    # 4) Independent data-quality gate over the published marts (Great Expectations).
    gx_gate = BashOperator(
        task_id="great_expectations_gate",
        bash_command="cd /opt/rosetta/quality && great_expectations checkpoint run rosetta_marts_checkpoint",
    )

    # 5) Publish dbt docs (lineage + catalog) for the team.
    dbt_docs = BashOperator(
        task_id="dbt_docs_generate",
        bash_command="cd /opt/rosetta/transform && dbt docs generate --target prod",
    )

    end = EmptyOperator(task_id="end")

    start >> fivetran_sync >> dbt_build >> dbt_freshness >> gx_gate >> dbt_docs >> end
