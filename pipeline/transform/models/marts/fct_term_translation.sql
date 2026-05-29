with t as (
    select * from {{ ref('stg_rosetta__term_translation') }}
)

select
    term_id,
    fivetran_term,
    dbt_term,
    boundary_type,
    -- a term "maps cleanly" only when neither side is a no-equivalent marker
    case
        when boundary_type = 'no_clean_mapping' then false
        when fivetran_term ilike '%no equivalent%' then false
        else true
    end as maps_cleanly
from t
