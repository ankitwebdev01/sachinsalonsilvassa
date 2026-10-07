import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BarChart3, ExternalLink, LogOut, Plus, Save, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { defaults, galleryOccasions, loadContent, saveContent, type ContentMap } from "@/lib/salon";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Admin Dashboard | Sachin Family Saloon" }, { name: "description", content: "Manage Sachin Family Saloon content, prices and sales." }, { name: "robots", content: "noindex" }, { property: "og:title", content: "Salon Admin Dashboard" }, { property: "og:description", content: "Private salon management." }] }),
  beforeLoad: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/auth" });
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
    if (!data) throw redirect({ to: "/auth" });
  },
  component: Dashboard,
});

type Sale = { id: string; sale_date: string; customer_name: string; service_name: string; amount: number; payment_method: string; notes: string | null };
type Field = { key: string; label: string; kind?: "text" | "number" | "textarea" | "lines" | "url" | "select"; options?: string[]; wide?: boolean };
type Row = Record<string, unknown>;

const planFields: Field[] = [{ key: "name", label: "Plan name" }, { key: "price", label: "Price (₹)", kind: "number" }, { key: "duration", label: "Duration" }, { key: "description", label: "Short note", kind: "textarea", wide: true }, { key: "benefits", label: "Benefits (one per line)", kind: "lines", wide: true }];
const lists: Record<string, { label: string; item: string; max?: number; fields: Field[] }> = {
  services: { label: "Services", item: "service", fields: [{ key: "name", label: "Service name" }, { key: "category", label: "Category", kind: "select", options: ["Women", "Men", "Family"] }, { key: "price", label: "Starting price (₹, 0 = Ask)", kind: "number" }, { key: "description", label: "Description", kind: "textarea", wide: true }] },
  products: { label: "Products", item: "product", fields: [{ key: "name", label: "Product name" }, { key: "brand", label: "Brand" }, { key: "price", label: "Price (₹)", kind: "number" }] },
  offers: { label: "Offers", item: "offer", fields: [{ key: "title", label: "Offer title" }, { key: "cta", label: "Button text" }, { key: "text", label: "Offer details", kind: "textarea", wide: true }] },
  membershipPlans: { label: "Membership plans", item: "membership plan", max: 6, fields: planFields },
  academyPlans: { label: "Academy plans", item: "academy course", max: 6, fields: [...planFields, { key: "imageUrl", label: "Image URL (required)", kind: "url", wide: true }] },
  gallery: { label: "Gallery", item: "photo", fields: [{ key: "imageUrl", label: "Photo URL", kind: "url", wide: true }, { key: "occasion", label: "Occasion", kind: "select", options: galleryOccasions }, { key: "caption", label: "Caption" }] },
  reviews: { label: "Reviews", item: "review", fields: [{ key: "author", label: "Name" }, { key: "quote", label: "Review", kind: "textarea", wide: true }] },
  faqs: { label: "FAQs", item: "question", fields: [{ key: "question", label: "Question", wide: true }, { key: "answer", label: "Answer", kind: "textarea", wide: true }] },
};
const objects: Record<string, { label: string; fields: Field[] }> = {
  business: { label: "Business details", fields: [{ key: "name", label: "Business name" }, { key: "hours", label: "Opening hours" }, { key: "address", label: "Address", wide: true }, { key: "phone", label: "WhatsApp number" }, { key: "displayPhone", label: "Displayed phone" }, { key: "email", label: "Contact email" }, { key: "rating", label: "Google rating" }, { key: "reviewCount", label: "Google review count", kind: "number" }] },
  appearance: { label: "Colours & logo", fields: [{ key: "theme", label: "Website colours", kind: "select", options: ["gold", "rose"] }, { key: "logoUrl", label: "Logo / website symbol image URL", kind: "url" }, { key: "instagramUrl", label: "Instagram profile URL", kind: "url" }, { key: "facebookUrl", label: "Facebook page URL", kind: "url" }] },
  pages: { label: "Page text", fields: [{ key: "about", label: "About the salon", kind: "textarea", wide: true }, { key: "summary", label: "Summary", kind: "textarea", wide: true }, { key: "membership", label: "Membership note", kind: "textarea", wide: true }] },
};
const tabs: Array<[string, string]> = [...Object.entries(objects).map(([k, v]) => [k, v.label] as [string, string]), ...Object.entries(lists).map(([k, v]) => [k, v.label] as [string, string]), ["sales", "Sales"]];

function blank(fields: Field[]): Row {
  return Object.fromEntries(fields.map((f) => [f.key, f.kind === "number" ? 0 : f.kind === "lines" ? [""] : f.kind === "select" ? f.options?.[0] ?? "" : ""]));
}

function FieldInput({ field, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  const cls = field.wide ? "sm:col-span-2" : "";
  let input;
  if (field.kind === "textarea") input = <Textarea value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />;
  else if (field.kind === "lines") input = <Textarea value={Array.isArray(value) ? value.join("\n") : ""} onChange={(e) => onChange(e.target.value.split("\n"))} />;
  else if (field.kind === "select") input = <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>{field.options?.map((o) => <option key={o} value={o}>{o === "gold" ? "Black, yellow, gold and white" : o === "rose" ? "Pink, rose, black and white" : o}</option>)}</select>;
  else input = <Input type={field.kind === "number" ? "number" : field.kind === "url" ? "url" : "text"} value={String(value ?? "")} onChange={(e) => onChange(field.kind === "number" ? Number(e.target.value) : e.target.value)} />;
  return <label className={`block min-w-0 ${cls}`}><span className="mb-1 block text-xs font-bold">{field.label}</span>{input}{field.key === "imageUrl" && typeof value === "string" && value && <img src={value} alt="" className="mt-2 h-24 w-24 rounded-md object-cover" />}</label>;
}

function Dashboard() {
  const navigate = useNavigate();
  const [content, setContent] = useState<ContentMap>(defaults);
  const [active, setActive] = useState("business");
  const [draft, setDraft] = useState<unknown>(defaults.business);
  const [status, setStatus] = useState("");
  const [sales, setSales] = useState<Sale[]>([]);
  const [sale, setSale] = useState({ customer_name: "", service_name: "", amount: "", payment_method: "Cash", notes: "" });

  useEffect(() => {
    loadContent().then((c) => { setContent(c); setDraft(c.business); });
    supabase.from("sales").select("*").order("sale_date", { ascending: false }).then(({ data }) => setSales((data as Sale[] | null) ?? []));
  }, []);

  function pick(key: string) { setActive(key); setStatus(""); if (key !== "sales") setDraft(structuredClone(content[key as keyof ContentMap])); }
  async function save() {
    const def = lists[active];
    if (active === "academyPlans" && (draft as Row[]).some((p) => !p["imageUrl"])) { setStatus("Every Academy course needs an image URL."); return; }
    try { await saveContent(active as keyof ContentMap, draft as never); setContent({ ...content, [active]: draft }); setStatus(`${def?.label ?? objects[active]?.label ?? ""} saved.`); }
    catch (e) { setStatus(e instanceof Error ? e.message : "Could not save."); }
  }
  async function addSale(e: React.FormEvent) {
    e.preventDefault();
    const { data, error } = await supabase.from("sales").insert({ customer_name: sale.customer_name, service_name: sale.service_name, amount: Number(sale.amount), payment_method: sale.payment_method, notes: sale.notes || null }).select().single();
    if (error) { setStatus(error.message); return; }
    if (data) setSales([data as Sale, ...sales]);
    setSale({ customer_name: "", service_name: "", amount: "", payment_method: "Cash", notes: "" });
  }
  async function removeSale(id: string) { const { error } = await supabase.from("sales").delete().eq("id", id); if (!error) setSales(sales.filter((s) => s.id !== id)); }
  async function signOut() { await supabase.auth.signOut(); navigate({ to: "/auth", replace: true }); }

  const listDef = lists[active];
  const objDef = objects[active];
  const rows = listDef && Array.isArray(draft) ? (draft as Row[]) : [];
  const obj = objDef && draft && typeof draft === "object" ? (draft as Row) : {};

  return (
    <main data-theme="rose" className="min-h-screen min-w-0 bg-secondary">
      <header className="border-b border-border bg-background">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-4">
          <div className="min-w-0"><h1 className="truncate text-xl font-extrabold">Salon dashboard</h1><p className="text-xs text-muted-foreground">Manage website content and sales</p></div>
          <div className="flex gap-2"><Button asChild variant="outline" size="icon" title="View website"><a href="/" target="_blank"><ExternalLink /></a></Button><Button variant="outline" size="icon" onClick={signOut} title="Sign out"><LogOut /></Button></div>
        </div>
      </header>
      <div className="mx-auto grid max-w-7xl gap-5 px-4 py-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="flex gap-1 overflow-x-auto rounded-lg bg-card p-3 lg:block">
          {tabs.map(([k, label]) => <Button key={k} variant={active === k ? "secondary" : "ghost"} className="shrink-0 justify-start lg:w-full" onClick={() => pick(k)}>{label}</Button>)}
        </aside>
        <div className="min-w-0">
          {active === "sales" ? (
            <section className="rounded-lg bg-card p-5">
              <div className="flex items-center gap-3"><BarChart3 className="text-primary" /><div><h2 className="text-xl font-extrabold">Sales details</h2><p className="text-xs text-muted-foreground">Total recorded: ₹{sales.reduce((sum, x) => sum + Number(x.amount), 0).toLocaleString("en-IN")}</p></div></div>
              <form onSubmit={addSale} className="mt-5 grid gap-3 md:grid-cols-5">
                <Input placeholder="Customer" value={sale.customer_name} onChange={(e) => setSale({ ...sale, customer_name: e.target.value })} required />
                <Input placeholder="Service" value={sale.service_name} onChange={(e) => setSale({ ...sale, service_name: e.target.value })} required />
                <Input type="number" min="0" placeholder="Amount" value={sale.amount} onChange={(e) => setSale({ ...sale, amount: e.target.value })} required />
                <Input placeholder="Payment" value={sale.payment_method} onChange={(e) => setSale({ ...sale, payment_method: e.target.value })} />
                <Button><Plus />Add sale</Button>
              </form>
              {status && <p className="mt-3 text-sm font-semibold text-primary">{status}</p>}
              <div className="mt-5 divide-y divide-border">
                {sales.map((s) => <div key={s.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-4 py-3"><div className="min-w-0"><p className="truncate text-sm font-bold">{s.customer_name} · {s.service_name}</p><p className="text-xs text-muted-foreground">{s.sale_date} · {s.payment_method}</p></div><div className="flex items-center gap-3"><strong>₹{Number(s.amount).toLocaleString("en-IN")}</strong><Button variant="ghost" size="icon" onClick={() => removeSale(s.id)}><Trash2 /></Button></div></div>)}
              </div>
            </section>
          ) : (
            <section className="rounded-lg bg-card p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <div className="min-w-0"><h2 className="truncate text-xl font-extrabold">{listDef?.label ?? objDef?.label}</h2><p className="text-xs text-muted-foreground">Update the fields, then press Save.</p></div>
                <Button onClick={save}><Save />Save</Button>
              </div>
              {status && <p className="mt-3 text-sm font-semibold text-primary">{status}</p>}
              {objDef && <div className="mt-5 grid gap-4 sm:grid-cols-2">{objDef.fields.map((f) => <FieldInput key={f.key} field={f} value={obj[f.key]} onChange={(v) => setDraft({ ...obj, [f.key]: v })} />)}</div>}
              {listDef && (
                <div className="mt-5 space-y-4">
                  {active === "gallery" && <p className="text-sm text-muted-foreground">Choose an occasion (Diwali, Dussehra, Teej…) for each photo — the website shows a button for every occasion you use.</p>}
                  {rows.map((row, index) => (
                    <article key={index} className="rounded-lg border border-border p-4">
                      <p className="mb-3 text-xs font-bold uppercase text-muted-foreground">{listDef.item} {index + 1}</p>
                      <div className="grid gap-3 sm:grid-cols-2">{listDef.fields.map((f) => <FieldInput key={f.key} field={f} value={row[f.key]} onChange={(v) => setDraft(rows.map((r, i) => (i === index ? { ...r, [f.key]: v } : r)))} />)}</div>
                      <Button className="mt-3" variant="ghost" onClick={() => setDraft(rows.filter((_, i) => i !== index))}><Trash2 />Remove {listDef.item}</Button>
                    </article>
                  ))}
                  <Button variant="outline" onClick={() => { if (listDef.max && rows.length >= listDef.max) { setStatus(`You can add up to ${listDef.max}.`); return; } setDraft([...rows, blank(listDef.fields)]); }}><Plus />Add {listDef.item}</Button>
                </div>
              )}
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
