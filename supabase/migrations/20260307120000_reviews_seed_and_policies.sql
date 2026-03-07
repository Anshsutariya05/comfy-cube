-- =============================================
-- Reviews policies and fake seeded reviews
-- =============================================

grant select, insert on public.reviews to anon, authenticated;

alter table public.reviews enable row level security;

drop policy if exists "Anyone can read reviews" on public.reviews;
create policy "Anyone can read reviews"
on public.reviews
for select
using (true);

drop policy if exists "Anyone can create reviews" on public.reviews;
create policy "Anyone can create reviews"
on public.reviews
for insert
with check (
  product_id is not null
  and rating between 1 and 5
  and length(trim(comment)) > 0
);

with seeded_reviews (id, product_name, rating, comment, created_at) as (
  values
    ('b2000000-0000-0000-0000-000000000001', 'CloudComfort 3-Seater Sofa', 5, 'Looks even better in person. The cushions are plush and supportive, and it instantly made the living room feel more premium.', now() - interval '21 days'),
    ('b2000000-0000-0000-0000-000000000002', 'CloudComfort 3-Seater Sofa', 4, 'Very comfortable for movie nights and the fabric feels durable. Delivery was smooth and setup was quick.', now() - interval '12 days'),
    ('b2000000-0000-0000-0000-000000000003', 'Haven Sectional L-Sofa', 5, 'Huge seating space and the modular layout was perfect for our open-plan room. Easy to keep clean too.', now() - interval '16 days'),
    ('b2000000-0000-0000-0000-000000000004', 'Haven Sectional L-Sofa', 4, 'The sectional is spacious and feels sturdy. I only wish the back cushions were a little firmer.', now() - interval '8 days'),
    ('b2000000-0000-0000-0000-000000000005', 'Nordic Linen 2-Seater Loveseat', 5, 'Perfect size for our apartment corner. The linen texture looks beautiful and the seat is surprisingly roomy.', now() - interval '24 days'),
    ('b2000000-0000-0000-0000-000000000006', 'Nordic Linen 2-Seater Loveseat', 4, 'Compact, stylish, and easy to style with throws. Great value for the quality.', now() - interval '10 days'),
    ('b2000000-0000-0000-0000-000000000007', 'Velvet Accent Armchair', 5, 'The teal color is gorgeous and the swivel base is smoother than expected. It is now my favorite reading chair.', now() - interval '18 days'),
    ('b2000000-0000-0000-0000-000000000008', 'Velvet Accent Armchair', 4, 'Beautiful accent piece with soft velvet. It sits slightly upright, which works well for conversation areas.', now() - interval '6 days'),
    ('b2000000-0000-0000-0000-000000000009', 'Orion Power Recliner', 5, 'The recline motor is quiet, the USB port is handy, and the lumbar support made a big difference for me.', now() - interval '15 days'),
    ('b2000000-0000-0000-0000-000000000010', 'Orion Power Recliner', 4, 'Comfortable and easy to use. The leather feels premium and the chair feels very stable.', now() - interval '5 days'),
    ('b2000000-0000-0000-0000-000000000011', 'Wren Dining Chair Set (×2)', 5, 'These chairs are sturdy and surprisingly comfortable for long dinners. The boucle seat pad is a nice touch.', now() - interval '20 days'),
    ('b2000000-0000-0000-0000-000000000012', 'Wren Dining Chair Set (×2)', 4, 'The set matched our oak dining table perfectly. Assembly was straightforward and the finish looks clean.', now() - interval '9 days'),
    ('b2000000-0000-0000-0000-000000000013', 'Marble-Top Coffee Table', 5, 'The marble veining is stunning and the gold base gives the room a designer feel. Very happy with this purchase.', now() - interval '22 days'),
    ('b2000000-0000-0000-0000-000000000014', 'Marble-Top Coffee Table', 4, 'Feels solid and looks luxurious. I use coasters anyway, but the surface has been easy to keep clean.', now() - interval '11 days'),
    ('b2000000-0000-0000-0000-000000000015', 'Extend Extendable Dining Table', 5, 'We hosted eight people comfortably on the first weekend. The extension mechanism is much easier than expected.', now() - interval '17 days'),
    ('b2000000-0000-0000-0000-000000000016', 'Extend Extendable Dining Table', 4, 'Strong build quality and lovely oak finish. The leaf storage is clever and saves space.', now() - interval '7 days'),
    ('b2000000-0000-0000-0000-000000000017', 'Nest Side Table Set (×3)', 5, 'So versatile around the lounge. We separate them when guests come over and stack them the rest of the week.', now() - interval '14 days'),
    ('b2000000-0000-0000-0000-000000000018', 'Nest Side Table Set (×3)', 4, 'Lightweight enough to move around but still feels stable. The walnut finish looks rich.', now() - interval '4 days'),
    ('b2000000-0000-0000-0000-000000000019', 'Serene Upholstered King Bed', 5, 'The headboard is beautiful and makes the bedroom feel like a boutique hotel. Quiet, sturdy, and very comfortable.', now() - interval '25 days'),
    ('b2000000-0000-0000-0000-000000000020', 'Serene Upholstered King Bed', 4, 'Assembly took some time, but the final result is excellent. The upholstery looks high-end.', now() - interval '13 days'),
    ('b2000000-0000-0000-0000-000000000021', 'Aurora Platform Bed Frame', 5, 'Minimalist look, strong slats, and no squeaks so far. Exactly the warm wood tone we wanted.', now() - interval '19 days'),
    ('b2000000-0000-0000-0000-000000000022', 'Aurora Platform Bed Frame', 4, 'Clean lines and solid build. It pairs nicely with both modern and mid-century decor.', now() - interval '6 days'),
    ('b2000000-0000-0000-0000-000000000023', 'Cloud9 Memory Foam Mattress', 5, 'Super comfortable from the first night. The cooling layer helps, and I wake up with much less shoulder pressure.', now() - interval '23 days'),
    ('b2000000-0000-0000-0000-000000000024', 'Cloud9 Memory Foam Mattress', 4, 'Great support and motion isolation. It took a day to fully expand, but sleep quality improved quickly.', now() - interval '9 days')
)
insert into public.reviews (id, product_id, rating, comment, created_at)
select seeded_reviews.id, products.id, seeded_reviews.rating, seeded_reviews.comment, seeded_reviews.created_at
from seeded_reviews
join public.products on products.name = seeded_reviews.product_name
on conflict (id) do nothing;