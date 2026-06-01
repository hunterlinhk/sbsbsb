import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const ADMIN_PASSWORD = "Jhkj888";

function requireAdmin(password: string) {
  if (password !== ADMIN_PASSWORD) {
    throw new Error("未授权，密码错误");
  }
}

// ---------- Public ----------

const InquirySchema = z.object({
  name: z.string().trim().min(1).max(100),
  company: z.string().trim().max(200).optional().nullable(),
  phone: z.string().trim().max(50).optional().nullable(),
  email: z.string().trim().email().max(200).optional().nullable(),
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
      .select("id,title,summary,cover_url,created_at")
      .eq("published", true)
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
      .from("news")
      .select("*")
      .eq("id", data.id)
      .eq("published", true)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return { item: row };
  });

// ---------- Admin ----------

export const adminLogin = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({ username: z.string(), password: z.string() })
      .parse(input),
  )
  .handler(async ({ data }) => {
    if (data.username !== "Jhkj888" || data.password !== ADMIN_PASSWORD) {
      throw new Error("用户名或密码错误");
    }
    return { ok: true, token: ADMIN_PASSWORD };
  });

export const adminListInquiries = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ password: z.string() }).parse(input),
  )
  .handler(async ({ data }) => {
    requireAdmin(data.password);
    const { data: rows, error } = await supabaseAdmin
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { items: rows ?? [] };
  });

export const adminToggleInquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        password: z.string(),
        id: z.string().uuid(),
        handled: z.boolean(),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    requireAdmin(data.password);
    const { error } = await supabaseAdmin
      .from("inquiries")
      .update({ handled: data.handled })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminDeleteInquiry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({ password: z.string(), id: z.string().uuid() })
      .parse(input),
  )
  .handler(async ({ data }) => {
    requireAdmin(data.password);
    const { error } = await supabaseAdmin
      .from("inquiries")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminListAllNews = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ password: z.string() }).parse(input),
  )
  .handler(async ({ data }) => {
    requireAdmin(data.password);
    const { data: rows, error } = await supabaseAdmin
      .from("news")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return { items: rows ?? [] };
  });

export const adminCreateNews = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z
      .object({
        password: z.string(),
        title: z.string().trim().min(1).max(200),
        summary: z.string().trim().max(500).optional().nullable(),
        content: z.string().trim().min(1).max(20000),
        cover_url: z.string().trim().max(500).optional().nullable(),
        published: z.boolean().default(true),
      })
      .parse(input),
  )
  .handler(async ({ data }) => {
    requireAdmin(data.password);
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
  .inputValidator((input: unknown) =>
    z
      .object({ password: z.string(), id: z.string().uuid() })
      .parse(input),
  )
  .handler(async ({ data }) => {
    requireAdmin(data.password);
    const { error } = await supabaseAdmin
      .from("news")
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });