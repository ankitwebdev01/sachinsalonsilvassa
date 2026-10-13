import { useEffect, useState } from "react";
import { MessageCircle, Plus, Trash2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";

export function Operations({ active, templates }: { active: string; templates: { name: string; text: string }[] }) {
  const [appointments, setAppointments] = useState<Tables<"appointments">[]>([]);
  const [sales, setSales] = useState<Tables<"sales">[]>([]);
  const [expenses, setExpenses] = useState<Tables<"expenses">[]>([]);
  const [status, setStatus] = useState("");
  const [period, setPeriod] = useState("Today");
  const [phone, setPhone] = useState("");
  const [text, setText] = useState(templates[0]?.text ?? "");
  async function refresh() {
    const [a, s, e] = await Promise.all([supabase.from("appointments").select("*").order("created_at", { ascending: false }), supabase.from("sales").select("*").order("sale_date", { ascending: false }), supabase.from("expenses").select("*").order("expense_date", { ascending: false })]);
    setAppointments(a.data ?? []); setSales(s.data ?? []); setExpenses(e.data ?? []);
    if (a.error || s.error || e.error) setStatus("Could not load records. Please try again.");
  }
  useEffect(() => { void refresh(); }, []);
  function inPeriod(day: string) {
    const now = new Date(); const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (period === "This week") start.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    if (period === "This month") start.setDate(1);
    return period === "All" || (day.slice(0, 10) >= `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}-${String(start.getDate()).padStart(2, "0")}` && day.slice(0, 10) <= `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`);
  }
  const shownSales = sales.filter((s) => inPeriod(s.sale_date)); const shownExpenses = expenses.filter((e) => inPeriod(e.expense_date));
  const revenue = shownSales.reduce((sum, s) => sum + Number(s.amount), 0); const cost = shownExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  async function record(event: React.FormEvent<HTMLFormElement>, expense: boolean) {
    event.preventDefault(); const form = event.currentTarget; const f = new FormData(form);
    const amount = Number(f.get("amount")); if (!Number.isFinite(amount) || amount <= 0) { setStatus("Enter an amount greater than zero."); return; }
    const { error } = expense ? await supabase.from("expenses").insert({ description: String(f.get("description")), amount, expense_date: String(f.get("date")) }) : await supabase.from("sales").insert({ customer_name: String(f.get("customer")), service_name: String(f.get("service")), amount, payment_method: String(f.get("payment")), sale_date: String(f.get("date")) });
    setStatus(error ? error.message : expense ? "Expense saved." : "Sale saved."); if (!error) { form.reset(); await refresh(); }
  }
  async function remove(table: "sales" | "expenses", id: string) { if (!window.confirm("Delete this record?")) return; const { error } = await supabase.from(table).delete().eq("id", id); if (error) setStatus(error.message); else await refresh(); }
  const whatsapp = (value: string, message: string) => `https://wa.me/${value.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
  function exportLedger() {
    const escape = (v: unknown) => `"${String(v).replace(/^[=+@-]/, "'").replaceAll('"', '""')}"`;
    const rows = [["Type", "Date", "Description", "Amount", "Payment"], ...shownSales.map((s) => ["Sale", s.sale_date, `${s.customer_name} — ${s.service_name}`, s.amount, s.payment_method]), ...shownExpenses.map((e) => ["Expense", e.expense_date, e.description, e.amount, ""] )];
    const url = URL.createObjectURL(new Blob([rows.map((r) => r.map(escape).join(",")).join("\n")], { type: "text/csv" })); const link = document.createElement("a"); link.href = url; link.download = "salon-ledger.csv"; link.click(); URL.revokeObjectURL(url);
  }
  return <section className="min-w-0 space-y-5"><h2 className="text-xl font-extrabold">{active === "appointments" ? "Appointment requests" : active === "messages" ? "Send WhatsApp" : "Sales & expenses"}</h2>{status && <p role="status" className="text-sm text-primary">{status}</p>}
    {active === "appointments" && <><Button variant="outline" onClick={refresh}>Refresh</Button>{!appointments.length && <p className="text-muted-foreground">No appointment requests yet.</p>}{appointments.map((a) => <article key={a.id} className="space-y-3 rounded-lg border border-border bg-card p-4"><h3 className="font-bold">{a.customer_name}</h3><p className="text-sm">{a.service_name} · {new Date(a.preferred_at).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}</p><p className="text-sm text-muted-foreground">{a.phone}</p><div className="flex flex-wrap gap-3"><select aria-label={`Status for ${a.customer_name}`} className="h-10 rounded-md border border-input bg-background px-3" value={a.status} onChange={async (e) => { const { error } = await supabase.from("appointments").update({ status: e.target.value }).eq("id", a.id); if (error) setStatus(error.message); else await refresh(); }}>{["New", "Confirmed", "Completed", "Cancelled"].map((v) => <option key={v}>{v}</option>)}</select><Button asChild variant="outline"><a href={whatsapp(a.phone, `Hello ${a.customer_name}, regarding your ${a.service_name} appointment request at Sachin Family Saloon…`)} target="_blank" rel="noreferrer"><MessageCircle />WhatsApp</a></Button></div></article>)}</>}
    {active === "messages" && <div className="space-y-4"><label className="block text-sm font-bold">Template<select className="mt-2 h-10 w-full rounded-md border border-input bg-background px-3" onChange={(e) => setText(templates[Number(e.target.value)]?.text ?? "")}>{templates.map((t, i) => <option key={i} value={i}>{t.name}</option>)}</select></label><label className="block text-sm font-bold">Customer phone (with country code)<Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} /></label><label className="block text-sm font-bold">Message<Textarea rows={6} value={text} onChange={(e) => setText(e.target.value)} /></label>{/^\+?\d{10,15}$/.test(phone) && text.trim() ? <Button asChild><a href={whatsapp(phone, text)} target="_blank" rel="noreferrer"><MessageCircle />Open WhatsApp</a></Button> : <Button disabled><MessageCircle />Open WhatsApp</Button>}</div>}
    {active === "sales" && <><div className="flex flex-wrap gap-2">{["Today", "This week", "This month", "All"].map((p) => <Button key={p} variant={period === p ? "default" : "outline"} onClick={() => setPeriod(p)}>{p}</Button>)}<Button variant="outline" onClick={exportLedger}><Download />Export</Button></div><dl className="grid grid-cols-3 gap-2">{[["Sales", revenue], ["Expenses", cost], ["Net", revenue - cost]].map(([label, amount]) => <div key={label} className="min-w-0 border-b border-border py-4"><dt className="text-xs text-muted-foreground">{label}</dt><dd className="break-all font-extrabold">₹{Number(amount).toLocaleString("en-IN")}</dd></div>)}</dl>
    <h3 className="font-bold">Add sale</h3><form onSubmit={(e) => void record(e, false)} className="grid gap-3 sm:grid-cols-2"><label className="text-sm">Customer<Input name="customer" required /></label><label className="text-sm">Service<Input name="service" required /></label><label className="text-sm">Amount (₹)<Input name="amount" type="number" min="0.01" step="0.01" required /></label><label className="text-sm">Date<Input name="date" type="date" required /></label><label className="text-sm">Payment<select name="payment" className="h-10 w-full rounded-md border border-input bg-background px-3">{["Cash", "UPI", "Card"].map((p) => <option key={p}>{p}</option>)}</select></label><Button className="self-end"><Plus />Add sale</Button></form>
    <h3 className="font-bold">Add expense</h3><form onSubmit={(e) => void record(e, true)} className="grid gap-3 sm:grid-cols-2"><label className="text-sm">Description<Input name="description" required /></label><label className="text-sm">Amount (₹)<Input name="amount" type="number" min="0.01" step="0.01" required /></label><label className="text-sm">Date<Input name="date" type="date" required /></label><Button className="self-end"><Plus />Add expense</Button></form>
    <h3 className="font-bold">Sales</h3>{shownSales.map((s) => <div key={s.id} className="flex items-center justify-between gap-3 border-b border-border py-3"><p className="min-w-0 break-words text-sm">{s.customer_name} · {s.service_name}<span className="block text-xs text-muted-foreground">{s.sale_date} · {s.payment_method}</span></p><strong className="shrink-0 text-sm">₹{s.amount}</strong><Button variant="ghost" size="icon" aria-label={`Delete sale for ${s.customer_name}`} onClick={() => void remove("sales", s.id)}><Trash2 /></Button></div>)}<h3 className="font-bold">Expenses</h3>{shownExpenses.map((e) => <div key={e.id} className="flex items-center justify-between gap-3 border-b border-border py-3"><p className="min-w-0 break-words text-sm">{e.description}<span className="block text-xs text-muted-foreground">{e.expense_date}</span></p><strong className="shrink-0 text-sm">₹{e.amount}</strong><Button variant="ghost" size="icon" aria-label={`Delete expense ${e.description}`} onClick={() => void remove("expenses", e.id)}><Trash2 /></Button></div>)}</>}
  </section>;
}