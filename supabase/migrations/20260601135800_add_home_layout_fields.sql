ALTER TABLE public.home_content
ADD COLUMN IF NOT EXISTS section_order JSONB NOT NULL DEFAULT '["hero","stats","capabilities","clients","advantage","cta"]'::jsonb;

ALTER TABLE public.home_content
ADD COLUMN IF NOT EXISTS section_visibility JSONB NOT NULL DEFAULT '{"hero":true,"stats":true,"capabilities":true,"clients":true,"advantage":true,"cta":true}'::jsonb;

UPDATE public.home_content
SET
  section_order = COALESCE(section_order, '["hero","stats","capabilities","clients","advantage","cta"]'::jsonb),
  section_visibility = COALESCE(section_visibility, '{"hero":true,"stats":true,"capabilities":true,"clients":true,"advantage":true,"cta":true}'::jsonb)
WHERE id = 1;
