import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { requireAdminSession } from "@/lib/admin-session.server";

// All admin-only server functions enforce auth via `requireAdminSession()`,
// which validates the encrypted HttpOnly session cookie set by
// POST /api/admin/login. Legacy schemas still accept an optional `password`
// field for backwards-compatibility with older clients, but the value is
// IGNORED — auth is decided entirely server-side from the cookie.
const pw = z.object({ password: z.string().optional() });


// ====================== Public (read) ======================

export const getSiteSettings = createServerFn({ method: "GET" }).handler(
  async () => {
    const { data, error } = await supabaseAdmin
      .from("site_settings").select("*").eq("id", 1).maybeSingle();
    if (error) throw new Error(error.message);
    return { item: data };
  },
);

export const getHomeContent = createServerFn({ method: "GET" }).handler(
  async () => {
    const [{ data: home }, { data: caps }] = await Promise.all([
      supabaseAdmin.from("home_content").select("*").eq("id", 1).maybeSingle(),
      supabaseAdmin.from("home_capabilities").select("*").eq("visible", true).order("sort_order"),
    ]);
    return { home, capabilities: caps ?? [] };
  },
);

export const getProductsPageData = createServerFn({ method: "GET" }).handler(
  async () => {
    const [{ data: products }, { data: steps }] = await Promise.all([
      supabaseAdmin.from("products").select("*").eq("published", true).order("sort_order"),
      supabaseAdmin.from("process_steps").select("*").eq("visible", true).order("sort_order"),
    ]);
    return { products: products ?? [], steps: steps ?? [] };
  },
);

export const getProductBySlug = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) =>
    z.object({ slug: z.string().min(1).max(80) }).parse(data),
  )
  .handler(async ({ data }) => {
    const { data: product } = await supabaseAdmin
      .from("products").select("*").eq("slug", data.slug).eq("published", true).maybeSingle();
    return { product };
  });



export const getAboutContent = createServerFn({ method: "GET" }).handler(
  async () => {
    const { data, error } = await supabaseAdmin
      .from("about_content").select("*").eq("id", 1).maybeSingle();
    if (error) throw new Error(error.message);
    return { item: data };
  },
);

export const getContactContent = createServerFn({ method: "GET" }).handler(
  async () => {
    const { data, error } = await supabaseAdmin
      .from("contact_content").select("*").eq("id", 1).maybeSingle();
    if (error) throw new Error(error.message);
    return { item: data };
  },
);

const InquirySchema = z.object({
  name: z.string().trim().min(1).max(100),
  company: z.string().trim().max(200).optional().nullable(),
  phone: z.string().trim().max(50).optional().nullable(),
  email: z.string().trim().max(200).optional().nullable(),
  message: z.string().trim().min(1).max(2000),
});

export const submitInquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => InquirySchema.parse(input))
  .handler(async ({ data }) => {
    const { error } = await supabaseAdmin.from("inquiries").insert({
      name: data.name,
      company: data.company || null,
      phone: data.phone || null,
      email: data.email || null,
      message: data.message,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const getPublishedNews = createServerFn({ method: "GET" }).handler(
  async () => {
    const { data, error } = await supabaseAdmin
      .from("news")
      .select("id,title,summary,cover_url,created_at,published_date")
      .eq("published", true).order("published_date", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { items: data ?? [] };
  },
);

export const getNewsById = createServerFn({ method: "GET" })
  .inputValidator((input: unknown) =>
    z.object({ id: z.string().uuid() }).parse(input),
  )
  .handler(async ({ data }) => {
    const { data: row, error } = await supabaseAdmin
      .from("news").select("*").eq("id", data.id).eq("published", true).maybeSingle();
    if (error) throw new Error(error.message);
    return { item: row };
  });

// ====================== Admin ======================


// Legacy server fn kept as a thin shim for any caller that still imports it.
// Real login now happens via POST /api/admin/login which sets an HttpOnly
// session cookie. This shim always throws so it cannot be misused.
export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ username: z.string(), password: z.string() }).parse(input),
  )
  .handler(async () => {
    throw new Error("此接口已废弃，请使用 /api/admin/login");
  });



// ----- generic single-row upsert helpers -----

export const updateSiteSettings = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    pw.extend({ values: z.record(z.string(), z.any()) }).parse(input),
  )
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { error } = await supabaseAdmin
      .from("site_settings").update(data.values as never).eq("id", 1);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateHomeContent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    pw.extend({ values: z.record(z.string(), z.any()) }).parse(input),
  )
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { error } = await supabaseAdmin
      .from("home_content").update(data.values as never).eq("id", 1);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const saveHomeLiveEditor = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    pw.extend({
      values: z.object({
        hero_eyebrow: z.string().optional(),
        hero_title_line1: z.string().optional(),
        hero_title_line2: z.string().optional(),
        hero_intro: z.string().optional(),
        hero_image: z.string().optional(),
        btn_explore: z.string().optional(),
        btn_explore_link: z.string().optional(),
        btn_contact: z.string().optional(),
        btn_contact_link: z.string().optional(),
        stats_title: z.string().optional(),
        capabilities_title: z.string().optional(),
        clients_title: z.string().optional(),
        advantage_title: z.string().optional(),
        adv1_title: z.string().optional(),
        adv1_desc: z.string().optional(),
        adv1_image: z.string().optional(),
        adv2_title: z.string().optional(),
        adv2_desc: z.string().optional(),
        adv2_image: z.string().optional(),
        cta_title: z.string().optional(),
        cta_desc: z.string().optional(),
        cta_button: z.string().optional(),
        cta_button_link: z.string().optional(),
        section_order: z.array(z.enum(["hero", "stats", "capabilities", "clients", "advantage", "cta"])).optional(),
        section_visibility: z
          .object({
            hero: z.boolean().optional(),
            stats: z.boolean().optional(),
            capabilities: z.boolean().optional(),
            clients: z.boolean().optional(),
            advantage: z.boolean().optional(),
            cta: z.boolean().optional(),
          })
          .optional(),
        field_styles: z.record(z.string(), z.any()).optional(),
      }),
    }).parse(input),
  )
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { error } = await supabaseAdmin
      .from("home_content")
      .update(data.values as never)
      .eq("id", 1);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateAboutContent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    pw.extend({ values: z.record(z.string(), z.any()) }).parse(input),
  )
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { error } = await supabaseAdmin
      .from("about_content").update(data.values as never).eq("id", 1);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateContactContent = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    pw.extend({ values: z.record(z.string(), z.any()) }).parse(input),
  )
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { error } = await supabaseAdmin
      .from("contact_content").update(data.values as never).eq("id", 1);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ----- capabilities (CRUD) -----

export const adminListCapabilities = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => pw.parse(i))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { data: rows, error } = await supabaseAdmin
      .from("home_capabilities").select("*").order("sort_order");
    if (error) throw new Error(error.message);
    return { items: rows ?? [] };
  });

export const upsertCapability = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) =>
    pw.extend({
      id: z.string().uuid().optional().nullable(),
      values: z.record(z.string(), z.any()),
    }).parse(i),
  )
  .handler(async ({ data }) => {
    await requireAdminSession();
    if (data.id) {
      const { error } = await supabaseAdmin
        .from("home_capabilities").update(data.values as never).eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin
        .from("home_capabilities").insert(data.values as never);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const deleteCapability = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => pw.extend({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { error } = await supabaseAdmin
      .from("home_capabilities").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ----- products (CRUD) -----

export const adminListProducts = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => pw.parse(i))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { data: rows, error } = await supabaseAdmin
      .from("products").select("*").order("sort_order");
    if (error) throw new Error(error.message);
    return { items: rows ?? [] };
  });

export const upsertProduct = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) =>
    pw.extend({
      id: z.string().uuid().optional().nullable(),
      values: z.record(z.string(), z.any()),
    }).parse(i),
  )
  .handler(async ({ data }) => {
    await requireAdminSession();
    if (data.id) {
      const { error } = await supabaseAdmin
        .from("products").update(data.values as never).eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin
        .from("products").insert(({ name: "新产品", ...data.values }) as never);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const deleteProduct = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => pw.extend({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { error } = await supabaseAdmin
      .from("products").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ----- process steps -----

export const adminListSteps = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => pw.parse(i))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { data: rows, error } = await supabaseAdmin
      .from("process_steps").select("*").order("sort_order");
    if (error) throw new Error(error.message);
    return { items: rows ?? [] };
  });

export const upsertStep = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) =>
    pw.extend({
      id: z.string().uuid().optional().nullable(),
      values: z.record(z.string(), z.any()),
    }).parse(i),
  )
  .handler(async ({ data }) => {
    await requireAdminSession();
    if (data.id) {
      const { error } = await supabaseAdmin
        .from("process_steps").update(data.values as never).eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin
        .from("process_steps").insert(({ step_no: "00", title: "新步骤", ...data.values }) as never);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const deleteStep = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => pw.extend({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { error } = await supabaseAdmin
      .from("process_steps").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ----- news -----

export const adminListAllNews = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => pw.parse(i))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { data: rows, error } = await supabaseAdmin
      .from("news").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { items: rows ?? [] };
  });

export const upsertNews = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) =>
    pw.extend({
      id: z.string().uuid().optional().nullable(),
      values: z.record(z.string(), z.any()),
    }).parse(i),
  )
  .handler(async ({ data }) => {
    await requireAdminSession();
    if (data.id) {
      const { error } = await supabaseAdmin
        .from("news").update(data.values as never).eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await supabaseAdmin
        .from("news").insert(({ title: "新文章", content: "", ...data.values }) as never);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

// Keep legacy adminCreateNews for compatibility (used by old admin.tsx code path)
export const adminCreateNews = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) =>
    pw.extend({
      title: z.string().trim().min(1).max(200),
      summary: z.string().trim().max(500).optional().nullable(),
      content: z.string().trim().min(1).max(20000),
      cover_url: z.string().trim().max(500).optional().nullable(),
      published: z.boolean().default(true),
    }).parse(i),
  )
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { error } = await supabaseAdmin.from("news").insert({
      title: data.title,
      summary: data.summary || null,
      content: data.content,
      cover_url: data.cover_url || null,
      published: data.published,
    });
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteNews = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => pw.extend({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { error } = await supabaseAdmin.from("news").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ----- inquiries -----

export const adminListInquiries = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => pw.parse(i))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { data: rows, error } = await supabaseAdmin
      .from("inquiries").select("*").order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { items: rows ?? [] };
  });

export const adminToggleInquiry = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) =>
    pw.extend({ id: z.string().uuid(), handled: z.boolean() }).parse(i),
  )
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { error } = await supabaseAdmin
      .from("inquiries")
      .update({ handled: data.handled, status: data.handled ? "done" : "pending" })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateInquiry = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) =>
    pw.extend({
      id: z.string().uuid(),
      status: z.enum(["pending", "contacted", "done"]).optional(),
      admin_note: z.string().max(2000).optional(),
    }).parse(i),
  )
  .handler(async ({ data }) => {
    await requireAdminSession();
    const upd: Record<string, unknown> = {};
    if (data.status) {
      upd.status = data.status;
      upd.handled = data.status === "done";
    }
    if (data.admin_note !== undefined) upd.admin_note = data.admin_note;
    const { error } = await supabaseAdmin.from("inquiries").update(upd as never).eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteInquiry = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) => pw.extend({ id: z.string().uuid() }).parse(i))
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { error } = await supabaseAdmin.from("inquiries").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ----- image upload (base64 -> storage) -----

export const uploadImage = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) =>
    pw.extend({
      filename: z.string().min(1).max(200),
      contentType: z.string().min(1).max(100),
      base64: z.string().min(1),
    }).parse(i),
  )
  .handler(async ({ data }) => {
    await requireAdminSession();
    const safe = data.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safe}`;
    const buf = Buffer.from(data.base64, "base64");
    const { error } = await supabaseAdmin.storage
      .from("cms-images")
      .upload(path, buf, { contentType: data.contentType, upsert: false });
    if (error) throw new Error(error.message);
    const { data: pub } = supabaseAdmin.storage.from("cms-images").getPublicUrl(path);
    return { url: pub.publicUrl };
  });

// ====================== Puck (drag-and-drop) home data ======================

export const getHomePuckData = createServerFn({ method: "GET" }).handler(
  async () => {
    const { data, error } = await supabaseAdmin
      .from("home_content")
      .select("puck_data")
      .eq("id", 1)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { puck_data: (data as { puck_data?: unknown } | null)?.puck_data ?? null };
  },
);

export const saveHomePuckData = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) =>
    pw.extend({
      puck_data: z.any().nullable(),
    }).parse(i),
  )
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { error } = await supabaseAdmin
      .from("home_content")
      .update({ puck_data: data.puck_data } as never)
      .eq("id", 1);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const updateCustomFonts = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) =>
    pw.extend({
      fonts: z.array(
        z.object({
          name: z.string().min(1).max(100),
          url: z.string().url().max(1000),
        }),
      ).max(20),
    }).parse(i),
  )
  .handler(async ({ data }) => {
    await requireAdminSession();
    const { error } = await supabaseAdmin
      .from("home_content")
      .update({ custom_fonts: data.fonts } as never)
      .eq("id", 1);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ====================== Font upload ======================

const ALLOWED_FONT_EXT = /\.(woff2|woff|ttf|otf)$/i;

export const uploadFont = createServerFn({ method: "POST" })
  .inputValidator((i: unknown) =>
    pw.extend({
      filename: z.string().min(1).max(200),
      contentType: z.string().min(1).max(100),
      base64: z.string().min(1),
    }).parse(i),
  )
  .handler(async ({ data }) => {
    await requireAdminSession();
    if (!ALLOWED_FONT_EXT.test(data.filename)) {
      throw new Error("仅支持 .woff2 / .woff / .ttf / .otf 字体文件");
    }
    const buf = Buffer.from(data.base64, "base64");
    if (buf.byteLength > 10 * 1024 * 1024) {
      throw new Error("字体文件不能超过 10MB");
    }
    const safe = data.filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const path = `fonts/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safe}`;
    const { error } = await supabaseAdmin.storage
      .from("cms-images")
      .upload(path, buf, { contentType: data.contentType, upsert: false });
    if (error) throw new Error(error.message);
    const { data: pub } = supabaseAdmin.storage.from("cms-images").getPublicUrl(path);
    return { url: pub.publicUrl };
  });

