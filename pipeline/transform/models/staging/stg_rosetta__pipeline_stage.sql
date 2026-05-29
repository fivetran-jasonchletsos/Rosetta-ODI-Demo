with source as (
    select * from {{ source('rosetta_raw', 'pipeline_stage') }}
),

renamed as (
    select
        lower(stage_id)                       as stage_id,
        cast(seq as integer)                  as stage_seq,
        title                                 as stage_title,
        lower(owner)                          as owner,
        verb,
        ft_term                               as fivetran_term,
        dbt_term,
        cast(synced_at as timestamp)         as synced_at
    from source
)

select * from renamed
