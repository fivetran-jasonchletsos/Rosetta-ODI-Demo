-- Singular test: each product must expose exactly six pillars.
-- Returns offending rows (a product whose pillar count != 6); empty = pass.
select
    product,
    count(*) as pillar_count
from {{ ref('dim_product_pillar') }}
group by product
having count(*) <> 6
