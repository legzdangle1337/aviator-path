import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BASE_URL = "https://aviatorpath.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const now = new Date().toISOString().split("T")[0];

  // Fetch all slugs in parallel
  const [schoolsRes, jobsRes, scholarshipsRes, cadetRes] = await Promise.all([
    supabase.from("schools").select("slug, updated_at").eq("is_active", true),
    supabase.from("jobs").select("slug, updated_at").eq("is_active", true),
    supabase.from("scholarships").select("slug, updated_at"),
    supabase.from("cadet_programs").select("slug, updated_at").eq("is_active", true),
  ]);

  const urls: string[] = [];

  // Static pages
  const staticPages = [
    { loc: "/", changefreq: "daily", priority: "1.0" },
    { loc: "/schools", changefreq: "daily", priority: "0.9" },
    { loc: "/jobs", changefreq: "daily", priority: "0.9" },
    { loc: "/scholarships", changefreq: "weekly", priority: "0.8" },
    { loc: "/cadet-programs", changefreq: "weekly", priority: "0.8" },
    { loc: "/financing", changefreq: "monthly", priority: "0.7" },
    { loc: "/compare", changefreq: "monthly", priority: "0.5" },
  ];

  for (const p of staticPages) {
    urls.push(`  <url>
    <loc>${BASE_URL}${p.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${p.changefreq}</changefreq>
    <priority>${p.priority}</priority>
  </url>`);
  }

  // Dynamic pages
  const addEntries = (data: any[] | null, prefix: string, changefreq: string, priority: string) => {
    if (!data) return;
    for (const item of data) {
      const lastmod = item.updated_at ? new Date(item.updated_at).toISOString().split("T")[0] : now;
      urls.push(`  <url>
    <loc>${BASE_URL}${prefix}/${item.slug}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`);
    }
  };

  addEntries(schoolsRes.data, "/schools", "weekly", "0.8");
  addEntries(jobsRes.data, "/jobs", "daily", "0.7");
  addEntries(scholarshipsRes.data, "/scholarships", "weekly", "0.7");
  addEntries(cadetRes.data, "/cadet-programs", "monthly", "0.6");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return new Response(xml, {
    headers: {
      ...corsHeaders,
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
});
