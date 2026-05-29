with source as (
    select * from {{ source('rosetta_raw', 'connector_catalog') }}
),

renamed as (
    select
        lower(connector_id)                      as connector_id,
        name                                     as connector_name,
        lower(category)                          as source_category,
        extraction_method,
        cast(source_updated_at as timestamp)     as source_updated_at,
        cast(_synced_at as timestamp)            as synced_at
    from source
)

select * from renamed
