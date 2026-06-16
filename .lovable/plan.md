## 目标
将产品中心重构为 **3 个主类目**，每个类目是一个独立的详情页面，页面内罗列若干"子产品"组件卡片。

## 三个主类目与子产品

### 1. 精密线圈 (`/products/precision-coils`)
- VCM线圈
- 工业类线圈
- 医疗设备类线圈
- 家电类线圈

### 2. 无线充线圈 (`/products/wireless-charging-coils`)
- 超薄无线充电线圈
- 中大功率无线充电线圈
- 手表线圈

### 3. 微型直线电机 (`/products/micro-linear-motors`)
- 保留现有简介内容（暂无新子产品文案，沿用现状）

## 改动详情

### 数据库（products 表）
- 清理上一轮按"子产品"拆出的 4 条独立记录，恢复为 **3 条主类目记录**：
  - `精密线圈` / `precision-coils`
  - `无线充线圈` / `wireless-charging-coils`
  - `微型直线电机` / `micro-linear-motors`
- 每条记录的 `features` (JSONB) 改为存储该类目下的**子产品数组**，每个子产品包含 `title` + `description`（取代单纯字符串数组），例如：
  ```json
  [
    {"title":"VCM线圈","description":"年出货量超过 1亿PCS..."},
    {"title":"工业类线圈","description":"应用于工业自动化设备..."},
    ...
  ]
  ```
- 新增 `slug` 字段（text, unique），用于 URL 友好路由；或继续用 id（见下方"路由方式"选择）。

### 路由
- 删除按 UUID 跳转的 `src/routes/products.$id.tsx`，新建 `src/routes/products.$slug.tsx`（基于 slug，URL 更清晰）。
- 详情页布局：顶部 Hero（类目名 + intro），下方按子产品卡片列表（标题 + 描述），不再有单一"核心特点"勾选列表。
- `products.tsx` 列表页继续展示 3 个主类目卡片，链接到 `/products/$slug`。

### 导航
- `Header.tsx` 下拉菜单显示 3 个主类目，使用 `to="/products/$slug" params={{ slug: p.slug }}`。
- 移动端菜单同步更新。

### 数据获取
- `getProductById` 替换为 `getProductBySlug`（接受 slug）。
- `getProductsPageData` 保持返回 3 条记录。

## 选项请确认

**路由方式：用 slug（推荐，URL 如 `/products/precision-coils`）还是继续用 UUID？** 我默认采用 slug。

确认后我会进入 build 模式：迁移加 slug 字段 → 用 insert 工具重置 3 条记录 → 重写路由文件 → 更新 Header。
