
-- =========================================================
-- CMS tables + storage bucket
-- =========================================================

-- updated_at trigger function (shared)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- ---------- site_settings (single row, id=1) ----------
CREATE TABLE public.site_settings (
  id INT PRIMARY KEY DEFAULT 1,
  logo_url TEXT DEFAULT '',
  company_name TEXT DEFAULT '东莞市景鸿科技有限公司',
  company_name_en TEXT DEFAULT 'Jinghong Technology',
  nav_home TEXT DEFAULT '首页',
  nav_products TEXT DEFAULT '产品中心',
  nav_news TEXT DEFAULT '新闻资讯',
  nav_about TEXT DEFAULT '关于我们',
  nav_contact TEXT DEFAULT '联系我们',
  nav_cta TEXT DEFAULT '获取报价',
  footer_intro TEXT DEFAULT '专注于精密线圈和微型直线电机制造，融合精益生产理念与自动化技术，为全球知名手机厂家提供优质线圈制造服务。',
  footer_copyright TEXT DEFAULT '© {year} 东莞市景鸿科技有限公司 版权所有',
  footer_slogan TEXT DEFAULT '精密制造 · 智造未来',
  address TEXT DEFAULT '广东省东莞市凤岗镇',
  phone TEXT DEFAULT '请联系我们获取',
  email TEXT DEFAULT '请联系我们获取',
  business_hours TEXT DEFAULT '周一至周六 09:00 - 18:00',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT site_settings_single CHECK (id = 1)
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE TRIGGER trg_site_settings_updated BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
INSERT INTO public.site_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ---------- home_content (single row) ----------
CREATE TABLE public.home_content (
  id INT PRIMARY KEY DEFAULT 1,
  hero_image TEXT DEFAULT '',
  hero_eyebrow TEXT DEFAULT 'Precision Coil Manufacturing',
  hero_title_line1 TEXT DEFAULT '精密制造',
  hero_title_line2 TEXT DEFAULT '智造未来',
  hero_title_italic TEXT DEFAULT '制造',
  hero_intro TEXT DEFAULT '东莞市景鸿科技有限公司 — 专注精密线圈与微型直线电机制造，以日特绕线机为核心的智能化产线，月产能 2000 万个，服务三星、华为、小米、传音等全球知名手机品牌。',
  btn_explore TEXT DEFAULT '探索产品',
  btn_contact TEXT DEFAULT '联系我们',

  stats_eyebrow TEXT DEFAULT 'By the numbers',
  stats_title TEXT DEFAULT '十余年精耕细作\n积淀制造硬实力',
  stat1_value INT DEFAULT 1800, stat1_suffix TEXT DEFAULT '㎡',    stat1_label TEXT DEFAULT '现代化车间',
  stat2_value INT DEFAULT 90,   stat2_suffix TEXT DEFAULT '+',     stat2_label TEXT DEFAULT '专业团队',
  stat3_value INT DEFAULT 80,   stat3_suffix TEXT DEFAULT '+',     stat3_label TEXT DEFAULT '台精密设备',
  stat4_value INT DEFAULT 2000, stat4_suffix TEXT DEFAULT '万/月', stat4_label TEXT DEFAULT '线圈产能',

  capabilities_eyebrow TEXT DEFAULT 'Core Capabilities',
  capabilities_title TEXT DEFAULT '四大核心制造能力',
  capabilities_desc TEXT DEFAULT '从绕线、焊锡到自动组装与品质检测，覆盖精密线圈制造全流程，为客户交付始终如一的高品质产品。',

  clients_eyebrow TEXT DEFAULT 'Trusted Partners',
  clients_title TEXT DEFAULT '服务全球知名手机品牌',
  brands JSONB DEFAULT '["SAMSUNG","HUAWEI","XIAOMI","TRANSSION","OPPO","VIVO"]'::jsonb,

  advantage_eyebrow TEXT DEFAULT 'Our Advantage',
  advantage_title TEXT DEFAULT '精益生产 × 自动化技术\n深度融合',
  adv1_image TEXT DEFAULT '', adv1_tag TEXT DEFAULT '智能产线', adv1_title TEXT DEFAULT '日特绕线机集群',
  adv1_desc TEXT DEFAULT '以日本日特 (Nittoku) 高精度绕线机为核心，配套50余台绕线设备，构建国内领先的精密线圈智能产线，从微米级线径到复杂结构线圈全覆盖。',
  adv2_image TEXT DEFAULT '', adv2_tag TEXT DEFAULT '品质把关', adv2_title TEXT DEFAULT '全流程品质检测',
  adv2_desc TEXT DEFAULT '30余台焊锡、摆盘、外观检查、自动组装与品质检测设备，结合精益生产理念，杜绝瑕疵流出，让每一颗线圈都经得起严苛考验。',

  cta_eyebrow TEXT DEFAULT 'Let''s Build Together',
  cta_title TEXT DEFAULT '为您的下一个项目\n提供精密制造方案',
  cta_desc TEXT DEFAULT '无论是新品研发打样还是规模化量产，景鸿科技以专业的精密制造能力和稳定的产能保障，助力客户产品成功。',
  cta_button TEXT DEFAULT '联系商务团队',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT home_content_single CHECK (id = 1)
);
GRANT SELECT ON public.home_content TO anon, authenticated;
GRANT ALL ON public.home_content TO service_role;
ALTER TABLE public.home_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read home_content" ON public.home_content FOR SELECT USING (true);
CREATE TRIGGER trg_home_content_updated BEFORE UPDATE ON public.home_content
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
INSERT INTO public.home_content (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ---------- home_capabilities ----------
CREATE TABLE public.home_capabilities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon TEXT NOT NULL DEFAULT 'Cpu',
  image TEXT DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.home_capabilities TO anon, authenticated;
GRANT ALL ON public.home_capabilities TO service_role;
ALTER TABLE public.home_capabilities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read capabilities" ON public.home_capabilities FOR SELECT USING (visible = true);
INSERT INTO public.home_capabilities (title, description, icon, sort_order) VALUES
('精密线圈制造','以日特绕线机为主的 50 余台绕线设备，覆盖各类精密线圈生产，满足消费电子高精度要求。','Cpu',1),
('微型直线电机','微型直线电机精密制造，应用于摄像头对焦、震动反馈等手机核心模组。','Zap',2),
('自动化组装','焊锡、摆盘、自动组装一体化产线，融合精益生产理念，确保稳定交付。','Factory',3),
('品质检测','30 余台外观检查与品质检测设备，全流程把关，零缺陷出厂。','ShieldCheck',4);

-- ---------- products ----------
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  name_en TEXT DEFAULT '',
  cover_url TEXT DEFAULT '',
  intro TEXT NOT NULL DEFAULT '',
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  applications TEXT DEFAULT '',
  process TEXT DEFAULT '',
  featured BOOLEAN NOT NULL DEFAULT false,
  sort_order INT NOT NULL DEFAULT 0,
  published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read published products" ON public.products FOR SELECT USING (published = true);
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
INSERT INTO public.products (name, name_en, intro, features, applications, sort_order, featured) VALUES
('精密线圈','Precision Coils','依托50余台日特绕线机，提供多规格高精度线圈解决方案，月产能达2000万个，广泛应用于消费电子、智能手机模组等核心场景。',
 '["线径范围：超细微米级线材","结构类型：空心线圈、骨架线圈、自粘线圈等","应用领域：摄像头VCM、震动马达、无线充电等","月产能：2000万个"]'::jsonb,
 '消费电子、智能手机模组',1,true),
('无线充线圈','Wireless Charging Coils','针对智能手机及可穿戴设备的无线充电模组，提供高效能、高一致性的无线充线圈产品，支持Qi标准，兼容主流无线充电方案。',
 '["标准兼容：支持 Qi 无线充电标准","应用：智能手机、TWS耳机仓、可穿戴设备","性能：高Q值，低损耗，高传输效率","工艺：精密绕线 + 自动化贴合"]'::jsonb,
 '智能手机、TWS耳机仓、可穿戴设备',2,true),
('微型直线电机','Linear Motors','精密微型直线电机，应用于手机摄像头自动对焦 (VCM)、触觉反馈等核心模组，结合自动化组装产线确保稳定品质。',
 '["尺寸：毫米级微型结构","应用：摄像头AF/OIS、震动反馈","性能：高响应速度、低噪音","工艺：自动化组装+全检"]'::jsonb,
 '手机摄像头、触觉反馈模组',3,true);

-- ---------- process_steps ----------
CREATE TABLE public.process_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  step_no TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  sort_order INT NOT NULL DEFAULT 0,
  visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.process_steps TO anon, authenticated;
GRANT ALL ON public.process_steps TO service_role;
ALTER TABLE public.process_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read process_steps" ON public.process_steps FOR SELECT USING (visible = true);
INSERT INTO public.process_steps (step_no, title, description, sort_order) VALUES
('01','精密绕线','日特绕线机集群',1),
('02','焊锡处理','高精度自动化焊接',2),
('03','摆盘整理','标准化排列输送',3),
('04','外观检查','自动视觉检测',4),
('05','自动组装','全自动产线集成',5),
('06','品质检测','全检+抽检双保险',6);

-- ---------- about_content ----------
CREATE TABLE public.about_content (
  id INT PRIMARY KEY DEFAULT 1,
  page_eyebrow TEXT DEFAULT 'About Us',
  page_title_line1 TEXT DEFAULT '精密制造的',
  page_title_line2 TEXT DEFAULT '坚守者',
  hero_image TEXT DEFAULT '',
  story_eyebrow TEXT DEFAULT 'Our Story',
  story_title TEXT DEFAULT '专注精密线圈制造',
  story_body TEXT DEFAULT '东莞市景鸿科技有限公司位于东莞市凤岗镇，专注于**精密线圈和微型直线电机制造**。公司车间面积 1800 平方米，员工 90 多人，拥有以日特绕线机为主的各种绕线机 50 多台，以及配套的焊锡、摆盘、外观检查、自动组装和品质检测设备 30 多台。\n\n目前各型线圈产能达 **2000 万个/月**。终端客户有三星、华为、小米、传音等知名手机厂家。\n\n公司通过**精益生产理念**和**自动化技术**的融合运用，为客户提供优质的线圈制造服务。',
  stat1_value INT DEFAULT 1800, stat1_suffix TEXT DEFAULT '㎡', stat1_label TEXT DEFAULT '车间面积',
  stat2_value INT DEFAULT 90,   stat2_suffix TEXT DEFAULT '+',  stat2_label TEXT DEFAULT '员工人数',
  stat3_value INT DEFAULT 50,   stat3_suffix TEXT DEFAULT '+',  stat3_label TEXT DEFAULT '绕线机',
  stat4_value INT DEFAULT 30,   stat4_suffix TEXT DEFAULT '+',  stat4_label TEXT DEFAULT '配套设备',
  workshop_image TEXT DEFAULT '',
  workshop_eyebrow TEXT DEFAULT 'Smart Factory',
  workshop_title TEXT DEFAULT '智能化精密制造车间',
  workshop_desc TEXT DEFAULT '车间布局科学、设备先进，以日特绕线机集群为核心，配套焊锡、摆盘、外观检查、自动组装与品质检测设备，构建从原料到成品的完整智能产线。',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT about_content_single CHECK (id = 1)
);
GRANT SELECT ON public.about_content TO anon, authenticated;
GRANT ALL ON public.about_content TO service_role;
ALTER TABLE public.about_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read about_content" ON public.about_content FOR SELECT USING (true);
CREATE TRIGGER trg_about_content_updated BEFORE UPDATE ON public.about_content
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
INSERT INTO public.about_content (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ---------- contact_content ----------
CREATE TABLE public.contact_content (
  id INT PRIMARY KEY DEFAULT 1,
  page_eyebrow TEXT DEFAULT 'Get in Touch',
  page_title TEXT DEFAULT '联系',
  page_title_italic TEXT DEFAULT '景鸿',
  page_intro TEXT DEFAULT '无论是产品咨询、样品申请，还是参观工厂，我们都期待与您建立联系。',
  info_eyebrow TEXT DEFAULT 'Contact Info',
  info_title TEXT DEFAULT '随时联系我们',
  map_title TEXT DEFAULT '广东省东莞市凤岗镇',
  map_subtitle TEXT DEFAULT '东莞市景鸿科技有限公司',
  form_title TEXT DEFAULT '发送询盘',
  form_intro TEXT DEFAULT '填写以下信息，我们会在 1 个工作日内回复您。',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT contact_content_single CHECK (id = 1)
);
GRANT SELECT ON public.contact_content TO anon, authenticated;
GRANT ALL ON public.contact_content TO service_role;
ALTER TABLE public.contact_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read contact_content" ON public.contact_content FOR SELECT USING (true);
CREATE TRIGGER trg_contact_content_updated BEFORE UPDATE ON public.contact_content
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
INSERT INTO public.contact_content (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- ---------- inquiries: add status + admin_note ----------
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS admin_note TEXT DEFAULT '';
UPDATE public.inquiries SET status = CASE WHEN handled THEN 'done' ELSE 'pending' END WHERE status IS NULL OR status = 'pending';

-- ---------- news: add SEO + published_date ----------
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS published_date DATE;
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS seo_title TEXT DEFAULT '';
ALTER TABLE public.news ADD COLUMN IF NOT EXISTS seo_desc TEXT DEFAULT '';
UPDATE public.news SET published_date = created_at::date WHERE published_date IS NULL;

-- ---------- storage bucket: cms-images ----------
INSERT INTO storage.buckets (id, name, public) VALUES ('cms-images','cms-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public read cms-images" ON storage.objects FOR SELECT
  USING (bucket_id = 'cms-images');
