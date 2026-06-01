ALTER TABLE public.home_content
ADD COLUMN IF NOT EXISTS btn_explore_link TEXT NOT NULL DEFAULT '/products';

ALTER TABLE public.home_content
ADD COLUMN IF NOT EXISTS btn_contact_link TEXT NOT NULL DEFAULT '/contact';

ALTER TABLE public.home_content
ADD COLUMN IF NOT EXISTS cta_button_link TEXT NOT NULL DEFAULT '/contact';

UPDATE public.home_content
SET
  btn_explore_link = COALESCE(NULLIF(btn_explore_link, ''), '/products'),
  btn_contact_link = COALESCE(NULLIF(btn_contact_link, ''), '/contact'),
  cta_button_link = COALESCE(NULLIF(cta_button_link, ''), '/contact')
WHERE id = 1;
