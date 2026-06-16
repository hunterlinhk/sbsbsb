ALTER TABLE public.products ADD COLUMN IF NOT EXISTS slug text;
CREATE UNIQUE INDEX IF NOT EXISTS products_slug_unique ON public.products(slug) WHERE slug IS NOT NULL;