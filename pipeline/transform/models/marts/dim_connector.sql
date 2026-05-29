with c as (
    select * from {{ ref('stg_fivetran__connector_catalog') }}
)

select
    connector_id,
    connector_name,
    source_category,
    extraction_method
from c
