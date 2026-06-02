ALTER TABLE public.home_content
  ADD COLUMN IF NOT EXISTS section_order jsonb DEFAULT '["hero","stats","capabilities","clients","advantage","cta"]'::jsonb,
  ADD COLUMN IF NOT EXISTS section_visibility jsonb DEFAULT '{"hero":true,"stats":true,"capabilities":true,"clients":true,"advantage":true,"cta":true}'::jsonb,
  ADD COLUMN IF NOT EXISTS btn_explore_link text DEFAULT '/products',
  ADD COLUMN IF NOT EXISTS btn_contact_link text DEFAULT '/contact',
  ADD COLUMN IF NOT EXISTS cta_button_link text DEFAULT '/contact';