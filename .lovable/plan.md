# 网站改造为后台可管理内容（CMS）方案

将目前前台写死的内容全部迁移到 Lovable Cloud 数据库，后台可视化编辑。保持现有设计风格与排版不变。

## 一、数据库设计

新增以下表（均为单管理员模型，沿用现有 `Jhkj888` 密码登录）：

1. **site_settings**（键值表，单例）— 存储全站基础设置
   - logo_url、company_name、company_name_en、nav_*、footer_intro、footer_copyright、footer_slogan、address、phone、email、business_hours
2. **home_content**（单行表）— 首页所有文案与图片
   - hero_image、hero_eyebrow、hero_title、hero_intro、btn_explore、btn_contact
   - stat_area、stat_team、stat_equip、stat_capacity（数字 + 标签）
   - advantage_title、advantage_desc、advantage_image
   - cta_title、cta_desc、cta_button
   - brands（JSON 数组）
3. **home_capabilities**（四大核心制造能力）— title / desc / icon / image / sort
4. **products** — name、name_en、cover_url、intro、features(JSON)、applications、process、featured(bool)、sort、published
5. **process_steps**（六步制造流程）— step_no、title、desc、sort、visible
6. **news**（已存在，新增字段）— 增加 published_date、seo_title、seo_desc、is_draft
7. **about_content**（单行表）— 关于我们文案 + 4 项数据 + 车间图片 + 智能化车间标题/描述
8. **contact_content**（单行表）— 联系页文案 + 地图区块 + 表单提示
9. **inquiries**（已存在，新增字段）— 增加 status（pending/contacted/done）和 admin_note

所有表：service_role 全权限，authenticated/anon 仅读（已发布内容），写入通过后台密码验证的 server function。

## 二、图片存储

创建 public 的 Supabase Storage bucket `cms-images`，所有后台图片字段支持上传替换，前端直接引用 public URL。

## 三、Server Functions

扩展 `src/lib/site.functions.ts`，按密码验证增加：
- `getSiteSettings` / `updateSiteSettings`
- `getHomeContent` / `updateHomeContent`
- `listHomeCapabilities` / `upsertCapability` / `deleteCapability`
- `listProducts`（公开） / `adminListProducts` / `upsertProduct` / `deleteProduct`
- `listProcessSteps` / `upsertStep` / `deleteStep`
- `getAboutContent` / `updateAboutContent`
- `getContactContent` / `updateContactContent`
- 询盘新增 `updateInquiryStatus`（状态 + 备注）
- 图片上传 `uploadImage`（密码验证后用 supabaseAdmin 上传到 bucket）

## 四、前台改造（保持设计不变）

把以下路由的硬编码内容改为通过 server function 从数据库读取（使用 TanStack Query `ensureQueryData` + `useSuspenseQuery`）：
- `Header` / `Footer` — 读 site_settings
- `routes/index.tsx` — 读 home_content + home_capabilities
- `routes/products.tsx` — 读 products + process_steps
- `routes/about.tsx` — 读 about_content
- `routes/contact.tsx` — 读 contact_content + site_settings
- `routes/news.tsx` / `news.$id.tsx` — 已有数据库支持，补全 SEO 字段

**默认数据**：迁移 SQL 中用 `INSERT ... ON CONFLICT DO NOTHING` 写入与当前网站完全一致的默认内容，确保数据库初始化后网站外观无变化。

## 五、后台管理界面

`/admin` 改成带侧边栏 Tab 的管理面板：

```text
├ 基础设置    （site_settings 表单）
├ 首页内容    （home_content 表单 + 能力卡片列表 CRUD）
├ 产品管理    （products 列表 + 编辑抽屉）
├ 制造流程    （process_steps 列表 CRUD）
├ 新闻资讯    （news 列表 + 富文本编辑）
├ 关于我们    （about_content 表单）
├ 联系我们    （contact_content 表单）
└ 询盘管理    （inquiries 列表 + 状态/备注 + 删除）
```

每个图片字段提供"上传新图片"按钮，调用 `uploadImage` 后回填 URL。

## 六、登录与权限

沿用现有 `/login`（用户名 / 密码 `Jhkj888`）和 localStorage token；`/admin` 未登录自动跳转登录页；所有写入 server function 在 handler 内校验密码。

## 七、实施顺序

1. 创建所有数据库表 + 默认数据 + Storage bucket（一次迁移）
2. 扩展 server functions
3. 改造前台路由读数据库（保持视觉不变）
4. 重构 `/admin` 为完整管理面板

## 工作量提示

这是一个较大改造（约 12-15 个新文件、6-7 个前台路由改造、1 个长 SQL 迁移）。完成后即可永久脱离改代码。

**请确认是否按此方案执行？** 如有调整（例如先只做某几个模块、或调整密码 / 增加多管理员、或后台用中英双语等），请告诉我后再开始。