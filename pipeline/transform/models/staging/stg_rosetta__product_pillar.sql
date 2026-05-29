with source as (
    select * from {{ source('rosetta_raw', 'product_pillar') }}
),

renamed as (
    select
        lower(pillar_key)                     as pillar_key,
        lower(product)                        as product,
        cast(seq as integer)                  as pillar_seq,
        title                                 as pillar_title,
        lower(owner)                          as owner,
        cast(synced_at as timestamp)         as synced_at
    from source
)

select * from renamed
