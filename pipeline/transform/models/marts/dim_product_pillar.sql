with p as (
    select * from {{ ref('stg_rosetta__product_pillar') }}
)

select
    pillar_key,
    product,
    pillar_seq,
    pillar_title,
    owner
from p
order by product, pillar_seq
