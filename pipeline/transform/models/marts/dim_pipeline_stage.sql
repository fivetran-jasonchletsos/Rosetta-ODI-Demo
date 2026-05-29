with s as (
    select * from {{ ref('stg_rosetta__pipeline_stage') }}
)

select
    stage_id,
    stage_seq,
    stage_title,
    owner,
    verb,
    fivetran_term,
    dbt_term
from s
order by stage_seq
