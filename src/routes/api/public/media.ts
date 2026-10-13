import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/media")({
  server: { handlers: { GET: async ({ request }) => {
    const path = new URL(request.url).searchParams.get("path");
    if (!path || !/^[a-zA-Z0-9_-]+\.(jpg|png|webp)$/.test(path)) return new Response("Not found", { status: 404 });
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: rows, error } = await supabaseAdmin.from("site_content").select("content");
    const reference = `/api/public/media?path=${path}`;
    const contains = (value: unknown): boolean => typeof value === "string" ? value === reference : Array.isArray(value) ? value.some(contains) : value !== null && typeof value === "object" ? Object.values(value).some(contains) : false;
    if (error || !rows?.some((row) => contains(row.content))) return new Response("Not found", { status: 404 });
    const { data, error: downloadError } = await supabaseAdmin.storage.from("salon-media").download(path);
    if (downloadError || !data) return new Response("Not found", { status: 404 });
    return new Response(data, { headers: { "Content-Type": data.type, "Cache-Control": "public, max-age=300", "X-Content-Type-Options": "nosniff" } });
  } } },
});