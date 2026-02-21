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
  1299.00,
  15,
  'https://brpniojfngjsctxkllgp.supabase.co/storage/v1/object/public/product-images/sofa-1.jpg',
  'W: 220cm × D: 90cm × H: 85cm | Seat height: 44cm',
  'a1000000-0000-0000-0000-000000000001'
),
(
  'Haven Sectional L-Sofa',
  'Maximise your lounging space with the Haven sectional. Its modular L-shape design lets you rearrange for any layout. Covered in premium beige microfibre that is stain-resistant and pet-friendly, perfect for families.',
  2149.00,
  8,
  'https://brpniojfngjsctxkllgp.supabase.co/storage/v1/object/public/product-images/sofa-2.jpg',
  'W: 310cm × D: 175cm × H: 88cm | Seat depth: 60cm',
  'a1000000-0000-0000-0000-000000000001'
),
(
  'Nordic Linen 2-Seater Loveseat',
  'Minimalist Scandinavian design meets cosy comfort. The Nordic Loveseat features a natural linen fabric, tapered oak legs, and removable cushion covers. Ideal for apartments and reading nooks.',
  799.00,
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
  549.00,
  30,
  'https://brpniojfngjsctxkllgp.supabase.co/storage/v1/object/public/product-images/chair-1.jpg',
  'W: 75cm × D: 78cm × H: 95cm | Seat height: 46cm',
  'a1000000-0000-0000-0000-000000000002'
),
(
  'Orion Power Recliner',
  'The ultimate relaxation chair. The Orion Power Recliner features one-touch electric recline, built-in USB charging ports, and a padded headrest with adjustable lumbar support. Upholstered in top-grain leather.',
  1089.00,
  12,
  'https://brpniojfngjsctxkllgp.supabase.co/storage/v1/object/public/product-images/chair-2.jpg',
  'W: 85cm × D: 95cm (extended: 150cm) × H: 110cm | Seat height: 48cm',
  'a1000000-0000-0000-0000-000000000002'
),
(
  'Wren Dining Chair Set (×2)',
  'Elevate your dining experience with the Wren. Solid beech frame with upholstered seat pad in a water-resistant boucle fabric. Sold as a set of 2 — coordinates perfectly with most dining tables.',
  389.00,
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
  649.00,
  18,
  'https://brpniojfngjsctxkllgp.supabase.co/storage/v1/object/public/product-images/table-1.jpg',
  'W: 120cm × D: 60cm × H: 45cm | Weight: 28kg',
  'a1000000-0000-0000-0000-000000000003'
),
(
  'Extend Extendable Dining Table',
  'A dining table that grows with your gatherings. The Extend features a solid oak top that expands from 160cm to 240cm with a hidden butterfly leaf mechanism. Seats 6–10 people comfortably.',
  1450.00,
  7,
  'https://brpniojfngjsctxkllgp.supabase.co/storage/v1/object/public/product-images/table-2.jpg',
  'W: 160–240cm × D: 90cm × H: 75cm | Seats 6–10',
  'a1000000-0000-0000-0000-000000000003'
),
(
  'Nest Side Table Set (×3)',
  'Three tables in one. The Nest set features three walnut-veneer tables of varying heights that tuck neatly together or spread around your sofa independently. Perfect for flexible living spaces.',
  299.00,
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
  1189.00,
  10,
  'https://brpniojfngjsctxkllgp.supabase.co/storage/v1/object/public/product-images/bed-1.jpg',
  'W: 193cm × L: 213cm × H: 140cm (headboard) | Fits king mattress',
  'a1000000-0000-0000-0000-000000000004'
),
(
  'Aurora Platform Bed Frame',
  'A sleek, low-profile platform bed with no-box-spring design. The walnut-finish solid wood frame has clean geometric lines that look stunning in modern and mid-century interiors. Available in Queen and King.',
  879.00,
  14,
  'https://brpniojfngjsctxkllgp.supabase.co/storage/v1/object/public/product-images/bed-2.jpg',
  'Queen: W: 160cm × L: 200cm × H: 30cm | King: W: 193cm × L: 213cm × H: 30cm',
  'a1000000-0000-0000-0000-000000000004'
),
(
  'Cloud9 Memory Foam Mattress',
  'Zero-gravity sleep every night. The Cloud9 features a 25cm profile with a cooling gel memory foam top layer, a pressure-relief transition layer, and a high-density support base. CertiPUR-US certified foam.',
  999.00,
  20,
  'https://brpniojfngjsctxkllgp.supabase.co/storage/v1/object/public/product-images/bed-3.jpg',
  'Queen: W: 152cm × L: 203cm × H: 25cm | King: W: 193cm × L: 203cm × H: 25cm',
  'a1000000-0000-0000-0000-000000000004'
)
on conflict do nothing;
