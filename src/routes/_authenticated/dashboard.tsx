import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { BarChart3, ExternalLink, LogOut, Plus, Save, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ImageUpload } from "@/components/salon/ImageUpload";
import { Operations } from "@/components/salon/Operations";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { defaults, galleryOccasions, loadContent, saveContent, type ContentMap } from "@/lib/salon";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Admin Dashboard | Sachin Family Saloon" }, { name: "description", content: "Manage Sachin Family Saloon content, prices and sales." }, { name: "robots", content: "noindex" }, { property: "og:title", content: "Salon Admin Dashboard" }, { property: "og:description", content: "Private salon management." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  beforeLoad: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw redirect({ to: "/auth" });
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle();
    if (!data) throw redirect({ to: "/auth" });
  },
  component: Dashboard,
});

type Field = { key: string; label: string; kind?: "text" | "number" | "textarea" | "lines" | "url" | "select" | "image" | "date" | "toggle"; options?: string[]; wide?: boolean };
type Row = Record<string, unknown>;

const planFields: Field[] = [{ key: "name", label: "Plan name" }, { key: "price", label: "Price (₹)", kind: "number" }, { key: "duration", label: "Duration" }, { key: "description", label: "Short note", kind: "textarea", wide: true }, { key: "benefits", label: "Benefits (one per line)", kind: "lines", wide: true }];
const lists: Record<string, { label: string; item: string; max?: number; fields: Field[] }> = {
  services: { label: "Services", item: "service", fields: [{ key: "name", label: "Service name" }, { key: "category", label: "Category", kind: "select", options: ["Women", "Men", "Family"] }, { key: "price", label: "Starting price (₹, 0 = Ask)", kind: "number" }, { key: "description", label: "Description", kind: "textarea", wide: true }] },
  products: { label: "Products", item: "product", fields: [{ key: "name", label: "Product name" }, { key: "brand", label: "Brand" }, { key: "price", label: "Price (₹)", kind: "number" }, { key: "size", label: "Size / volume" }, { key: "description", label: "Description", kind: "textarea" }, { key: "imageUrl", label: "Product photo", kind: "image", wide: true }] },
  offers: { label: "Offers", item: "offer", fields: [{ key: "title", label: "Offer title" }, { key: "cta", label: "Button text" }, { key: "text", label: "Offer details", kind: "textarea", wide: true }, { key: "imageUrl", label: "Advertisement photo", kind: "image", wide: true }, { key: "validUntil", label: "Valid until (optional)", kind: "date" }] },
  membershipPlans: { label: "Membership plans", item: "membership plan", max: 6, fields: planFields },
  academyPlans: { label: "Academy plans", item: "academy course", max: 6, fields: [...planFields, { key: "imageUrl", label: "Course photo (required)", kind: "image", wide: true }] },
  gallery: { label: "Gallery", item: "photo", fields: [{ key: "imageUrl", label: "Gallery photo", kind: "image", wide: true }, { key: "occasion", label: "Occasion", kind: "select", options: galleryOccasions }, { key: "caption", label: "Caption" }] },
  stylists: { label: "Stylists", item: "stylist", fields: [{ key: "name", label: "Name" }, { key: "specialty", label: "Specialisation" }, { key: "imageUrl", label: "Stylist photo", kind: "image", wide: true }] },
  messageTemplates: { label: "WhatsApp templates", item: "message template", fields: [{ key: "name", label: "Template name" }, { key: "text", label: "Message", kind: "textarea", wide: true }] },
  reviews: { label: "Reviews", item: "review", fields: [{ key: "author", label: "Name" }, { key: "quote", label: "Review", kind: "textarea", wide: true }] },
  faqs: { label: "FAQs", item: "question", fields: [{ key: "question", label: "Question", wide: true }, { key: "answer", label: "Answer", kind: "textarea", wide: true }] },
};
const objects: Record<string, { label: string; fields: Field[] }> = {
  business: { label: "Business details", fields: [{ key: "name", label: "Business name" }, { key: "hours", label: "Opening hours" }, { key: "address", label: "Address", wide: true }, { key: "phone", label: "WhatsApp number" }, { key: "displayPhone", label: "Displayed phone" }, { key: "email", label: "Contact email" }, { key: "rating", label: "Google rating" }, { key: "reviewCount", label: "Google review count", kind: "number" }] },
  appearance: { label: "Colours & logo", fields: [{ key: "theme", label: "Website colours", kind: "select", options: ["gold", "rose"] }, { key: "logoUrl", label: "Website logo (header, footer and sign-in)", kind: "image", wide: true }, { key: "membershipImageUrl", label: "Membership overview photo", kind: "image", wide: true }, { key: "showAnnouncement", label: "Show website announcement", kind: "toggle" }, { key: "announcement", label: "Announcement", kind: "textarea", wide: true }, { key: "instagramUrl", label: "Instagram profile URL", kind: "url" }, { key: "facebookUrl", label: "Facebook page URL", kind: "url" }] },
  pages: { label: "Page text", fields: [{ key: "about", label: "About the salon", kind: "textarea", wide: true }, { key: "summary", label: "Summary", kind: "textarea", wide: true }, { key: "membership", label: "Membership note", kind: "textarea", wide: true }] },
};
const tabs: Array<[string, string]> = [...Object.entries(objects).map(([k, v]) => [k, v.label] as [string, string]), ...Object.entries(lists).map(([k, v]) => [k, v.label] as [string, string]), ["sales", "Sales & expenses"], ["appointments", "Appointments"], ["messages", "Send WhatsApp"]];

function blank(fields: Field[]): Row {
  return Object.fromEntries(fields.map((f) => [f.key, f.kind === "toggle" ? false : f.kind === "number" ? 0 : f.kind === "lines" ? [""] : f.kind === "select" ? f.options?.[0] ?? "" : ""]));
}

function FieldInput({ field, value, onChange }: { field: Field; value: unknown; onChange: (v: unknown) => void }) {
  const cls = field.wide ? "sm:col-span-2" : "";
  let input;
  if (field.kind === "image") return <div className={`min-w-0 ${cls}`}><span className="mb-2 block text-xs font-bold">{field.label}</span><ImageUpload label={field.label} value={String(value ?? "")} onChange={onChange} /></div>;
  if (field.kind === "toggle") input = <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="h-5 w-5 accent-primary" />;
  else if (field.kind === "textarea") input = <Textarea value={String(value ?? "")} onChange={(e) => onChange(e.target.value)} />;
  else if (field.kind === "lines") input = <Textarea value={Array.isArray(value) ? value.join("\n") : ""} onChange={(e) => onChange(e.target.value.split("\n"))} />;
  else if (field.kind === "select") input = <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm" value={String(value ?? "")} onChange={(e) => onChange(e.target.value)}>{field.options?.map((o) => <option key={o} value={o}>{o === "gold" ? "Black, yellow, gold and white" : o === "rose" ? "Pink, rose, black and white" : o}</option>)}</select>;
  else input = <Input type={field.kind === "number" ? "number" : field.kind === "url" ? "url" : field.kind === "date" ? "date" : "text"} value={String(value ?? "")} onChange={(e) => onChange(field.kind === "number" ? Number(e.target.value) : e.target.value)} />;
  return <label className={`block min-w-0 ${cls}`}><span className="mb-1 block text-xs font-bold">{field.label}</span>{input}{field.key === "imageUrl" && typeof value === "string" && value && <img src={value} alt="" className="mt-2 h-24 w-24 rounded-md object-cover" />}</label>;
}

function Dashboard() {
  const navigate = useNavigate();
  const [content, setContent] = useState<ContentMap>(defaults);
  const [active, setActive] = useState("business");
  const [draft, setDraft] = useState<unknown>(defaults.business);
  const [status, setStatus] = useState("");

  useEffect(() => {
    loadContent().then((c) => { setContent(c); setDraft(c.business); });
  }, []);

  function pick(key: string) { setActive(key); setStatus(""); if (!["sales", "appointments", "messages"].includes(key)) setDraft(structuredClone(content[key as keyof ContentMap])); }
  async function save() {
    const def = lists[active];
    if (active === "academyPlans" && (draft as Row[]).some((p) => !p["imageUrl"])) { setStatus("Every Academy course needs a photo."); return; }
    try { await saveContent(active as keyof ContentMap, draft as never); setContent({ ...content, [active]: draft }); setStatus(`${def?.label ?? objects[active]?.label ?? ""} saved.`); }
    catch (e) { setStatus(e instanceof Error ? e.message : "Could not save."); }
  }
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
          {["sales", "appointments", "messages"].includes(active) ? (
            <Operations active={active} templates={content.messageTemplates} />
          ) : (
            <section className="rounded-lg bg-card p-5">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                <div className="min-w-0"><h2 className="truncate text-xl font-extrabold">{listDef?.label ?? objDef?.label}</h2><p className="text-xs text-muted-foreground"></p></div>
                <Button onClick={save}><Save />Save</Button>
              </div>
              {status && <p className="mt-3 text-sm font-semibold text-primary">{status}</p>}
              {objDef && <div className="mt-5 grid gap-4 sm:grid-cols-2">{objDef.fields.map((f) => <FieldInput key={f.key} field={f} value={obj[f.key]} onChange={(v) => setDraft({ ...obj, [f.key]: v })} />)}</div>}
              {listDef && (
                <div className="mt-5 space-y-4">
                  {active === "gallery" && <p className="text-sm text-muted-foreground">Choose an occasion (Diwali, Dussehra, Teej…) for each photo — the website shows a button for every occasion you use.</p>}
                  {rows.map((row, index) => (
                    <article key={`${active}-${index}`} className="border-b border-border py-4">
                      <p className="mb-3 text-xs font-bold uppercase text-muted-foreground">{listDef.item} {index + 1}</p>
                      <div className="grid gap-3 sm:grid-cols-2">{listDef.fields.map((f) => <FieldInput key={f.key} field={f} value={row[f.key]} onChange={(v) => setDraft(rows.map((r, i) => (i === index ? { ...r, [f.key]: v } : r)))} />)}</div>
                      <div className="mt-3 flex flex-wrap gap-2"><Button variant="outline" size="icon" title="Move up" aria-label={`Move ${listDef.item} ${index + 1} up`} disabled={index === 0} onClick={() => { const next = [...rows]; const other = next[index - 1]; const current = next[index]; if (other && current) { next[index - 1] = current; next[index] = other; setDraft(next); } }}><ArrowUp /></Button><Button variant="outline" size="icon" title="Move down" aria-label={`Move ${listDef.item} ${index + 1} down`} disabled={index === rows.length - 1} onClick={() => { const next = [...rows]; const other = next[index + 1]; const current = next[index]; if (other && current) { next[index + 1] = current; next[index] = other; setDraft(next); } }}><ArrowDown /></Button><Button variant="ghost" onClick={() => setDraft(rows.filter((_, i) => i !== index))}><Trash2 />Remove {listDef.item}</Button></div>
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
