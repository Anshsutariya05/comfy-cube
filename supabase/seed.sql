-- =============================================
-- ComfyCube Seed Data
-- Images are served from Supabase Storage
-- =============================================

-- Storage base URL (update project ref if it changes)
-- https://brpniojfngjsctxkllgp.supabase.co/storage/v1/object/public/product-images/

-- =============================================
-- CATEGORIES
-- =============================================
insert into public.categories (id, name, slug, description, image_url) values
(
  'a1000000-0000-0000-0000-000000000001',
  'Sofas & Couches',
  'sofas-couches',
  'Sink into luxury with our handpicked sofas and couches designed for ultimate relaxation.',
  'https://brpniojfngjsctxkllgp.supabase.co/storage/v1/object/public/product-images/category-sofas.jpg'
),
(
  'a1000000-0000-0000-0000-000000000002',
  'Chairs & Recliners',
  'chairs-recliners',
  'From accent chairs to full recliners, find your perfect seat for any room.',
  'https://brpniojfngjsctxkllgp.supabase.co/storage/v1/object/public/product-images/category-chairs.jpg'
),
(
  'a1000000-0000-0000-0000-000000000003',
  'Tables',
  'tables',
  'Coffee tables, dining tables, and side tables crafted to complement your space.',
  'https://brpniojfngjsctxkllgp.supabase.co/storage/v1/object/public/product-images/category-tables.jpg'
),
(
  'a1000000-0000-0000-0000-000000000004',
  'Beds & Bedroom',
  'beds-bedroom',
  'Transform your bedroom into a sanctuary with our premium beds and bedroom furniture.',
  'https://brpniojfngjsctxkllgp.supabase.co/storage/v1/object/public/product-images/category-beds.jpg'
)
on conflict (id) do nothing;

-- =============================================
-- PRODUCTS — Sofas & Couches
-- =============================================
insert into public.products (name, description, price, quantity, image_url, measurements, category_id) values
(
  'CloudComfort 3-Seater Sofa',
  'Experience cloud-like comfort with our premium CloudComfort sofa. Upholstered in soft grey velvet with solid wood legs, this sofa is the centrepiece your living room deserves. The high-density foam cushions retain their shape wash after wash.',
  68999.00,
  15,
  'https://brpniojfngjsctxkllgp.supabase.co/storage/v1/object/public/product-images/sofa-1.jpg',
  'W: 220cm × D: 90cm × H: 85cm | Seat height: 44cm',
  'a1000000-0000-0000-0000-000000000001'
),
(
  'Haven Sectional L-Sofa',
  'Maximise your lounging space with the Haven sectional. Its modular L-shape design lets you rearrange for any layout. Covered in premium beige microfibre that is stain-resistant and pet-friendly, perfect for families.',
  99999.00,
  8,
  'https://brpniojfngjsctxkllgp.supabase.co/storage/v1/object/public/product-images/sofa-2.jpg',
  'W: 310cm × D: 175cm × H: 88cm | Seat depth: 60cm',
  'a1000000-0000-0000-0000-000000000001'
),
(
  'Nordic Linen 2-Seater Loveseat',
  'Minimalist Scandinavian design meets cosy comfort. The Nordic Loveseat features a natural linen fabric, tapered oak legs, and removable cushion covers. Ideal for apartments and reading nooks.',
  42999.00,
  22,
  'https://brpniojfngjsctxkllgp.supabase.co/storage/v1/object/public/product-images/sofa-3.jpg',
  'W: 155cm × D: 80cm × H: 78cm | Seat height: 42cm',
  'a1000000-0000-0000-0000-000000000001'
),

-- =============================================
-- PRODUCTS — Chairs & Recliners
-- =============================================
(
  'Velvet Accent Armchair',
  'Make a bold statement with our plush velvet accent chair. Available in deep teal, it pairs beautifully with neutral interiors. Features 360° swivel base and hand-stitched button detailing on the backrest.',
  24999.00,
  30,
  'https://brpniojfngjsctxkllgp.supabase.co/storage/v1/object/public/product-images/chair-1.jpg',
  'W: 75cm × D: 78cm × H: 95cm | Seat height: 46cm',
  'a1000000-0000-0000-0000-000000000002'
),
(
  'Orion Power Recliner',
  'The ultimate relaxation chair. The Orion Power Recliner features one-touch electric recline, built-in USB charging ports, and a padded headrest with adjustable lumbar support. Upholstered in top-grain leather.',
  59999.00,
  12,
  'https://brpniojfngjsctxkllgp.supabase.co/storage/v1/object/public/product-images/chair-2.jpg',
  'W: 85cm × D: 95cm (extended: 150cm) × H: 110cm | Seat height: 48cm',
  'a1000000-0000-0000-0000-000000000002'
),
(
  'Wren Dining Chair Set (×2)',
  'Elevate your dining experience with the Wren. Solid beech frame with upholstered seat pad in a water-resistant boucle fabric. Sold as a set of 2 — coordinates perfectly with most dining tables.',
  18999.00,
  40,
  'https://brpniojfngjsctxkllgp.supabase.co/storage/v1/object/public/product-images/chair-3.jpg',
  'W: 48cm × D: 54cm × H: 90cm | Seat height: 46cm | Set of 2',
  'a1000000-0000-0000-0000-000000000002'
),

-- =============================================
-- PRODUCTS — Tables
-- =============================================
(
  'Marble-Top Coffee Table',
  'Italian-inspired elegance for your living room. The marble surface brings natural, unique veining patterns to every piece, paired with a brushed gold steel base. Adds a luxurious focal point to any sofa arrangement.',
  27999.00,
  18,
  'https://brpniojfngjsctxkllgp.supabase.co/storage/v1/object/public/product-images/table-1.jpg',
  'W: 120cm × D: 60cm × H: 45cm | Weight: 28kg',
  'a1000000-0000-0000-0000-000000000003'
),
(
  'Extend Extendable Dining Table',
  'A dining table that grows with your gatherings. The Extend features a solid oak top that expands from 160cm to 240cm with a hidden butterfly leaf mechanism. Seats 6–10 people comfortably.',
  74999.00,
  7,
  'https://brpniojfngjsctxkllgp.supabase.co/storage/v1/object/public/product-images/table-2.jpg',
  'W: 160–240cm × D: 90cm × H: 75cm | Seats 6–10',
  'a1000000-0000-0000-0000-000000000003'
),
(
  'Nest Side Table Set (×3)',
  'Three tables in one. The Nest set features three walnut-veneer tables of varying heights that tuck neatly together or spread around your sofa independently. Perfect for flexible living spaces.',
  14999.00,
  25,
  'https://brpniojfngjsctxkllgp.supabase.co/storage/v1/object/public/product-images/table-3.jpg',
  'Large: W: 55cm × H: 55cm | Medium: W: 45cm × H: 50cm | Small: W: 35cm × H: 45cm',
  'a1000000-0000-0000-0000-000000000003'
),

-- =============================================
-- PRODUCTS — Beds & Bedroom
-- =============================================
(
  'Serene Upholstered King Bed',
  'Sleep in style with the Serene king-size bed. A floor-to-ceiling padded headboard in soft ash grey linen creates a hotel-suite feel. Solid pine slat base included — no box spring needed. Mattress sold separately.',
  85999.00,
  10,
  'https://brpniojfngjsctxkllgp.supabase.co/storage/v1/object/public/product-images/bed-1.jpg',
  'W: 193cm × L: 213cm × H: 140cm (headboard) | Fits king mattress',
  'a1000000-0000-0000-0000-000000000004'
),
(
  'Aurora Platform Bed Frame',
  'A sleek, low-profile platform bed with no-box-spring design. The walnut-finish solid wood frame has clean geometric lines that look stunning in modern and mid-century interiors. Available in Queen and King.',
  54999.00,
  14,
  'https://brpniojfngjsctxkllgp.supabase.co/storage/v1/object/public/product-images/bed-2.jpg',
  'Queen: W: 160cm × L: 200cm × H: 30cm | King: W: 193cm × L: 213cm × H: 30cm',
  'a1000000-0000-0000-0000-000000000004'
),
(
  'Cloud9 Memory Foam Mattress',
  'Zero-gravity sleep every night. The Cloud9 features a 25cm profile with a cooling gel memory foam top layer, a pressure-relief transition layer, and a high-density support base. CertiPUR-US certified foam.',
  44999.00,
  20,
  'https://brpniojfngjsctxkllgp.supabase.co/storage/v1/object/public/product-images/bed-3.jpg',
  'Queen: W: 152cm × L: 203cm × H: 25cm | King: W: 193cm × L: 203cm × H: 25cm',
  'a1000000-0000-0000-0000-000000000004'
)
on conflict do nothing;

-- =============================================
-- REVIEWS
-- =============================================
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
