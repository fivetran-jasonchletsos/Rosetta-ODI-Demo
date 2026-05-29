with source as (
    select * from {{ source('rosetta_raw', 'term_translation') }}
),

renamed as (
    select
        lower(term_id)                        as term_id,
        ft_term                               as fivetran_term,
        dbt_term,
        lower(boundary_type)                  as boundary_type,
        cast(synced_at as timestamp)         as synced_at
    from source
)

select * from renamed
