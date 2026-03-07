update public.products
set price = case name
  when 'CloudComfort 3-Seater Sofa' then 68999.00
  when 'Haven Sectional L-Sofa' then 99999.00
  when 'Nordic Linen 2-Seater Loveseat' then 42999.00
  when 'Velvet Accent Armchair' then 24999.00
  when 'Orion Power Recliner' then 59999.00
  when 'Wren Dining Chair Set (×2)' then 18999.00
  when 'Marble-Top Coffee Table' then 27999.00
  when 'Extend Extendable Dining Table' then 74999.00
  when 'Nest Side Table Set (×3)' then 14999.00
  when 'Serene Upholstered King Bed' then 85999.00
  when 'Aurora Platform Bed Frame' then 54999.00
  when 'Cloud9 Memory Foam Mattress' then 44999.00
  else price
end
where name in (
  'CloudComfort 3-Seater Sofa',
  'Haven Sectional L-Sofa',
  'Nordic Linen 2-Seater Loveseat',
  'Velvet Accent Armchair',
  'Orion Power Recliner',
  'Wren Dining Chair Set (×2)',
  'Marble-Top Coffee Table',
  'Extend Extendable Dining Table',
  'Nest Side Table Set (×3)',
  'Serene Upholstered King Bed',
  'Aurora Platform Bed Frame',
  'Cloud9 Memory Foam Mattress'
);