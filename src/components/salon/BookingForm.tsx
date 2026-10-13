import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function BookingForm({ services }: { services: string[] }) {
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const values = new FormData(form);
    setBusy(true);
    const { error } = await supabase.rpc("request_salon_appointment", { customer: String(values.get("name")), contact: String(values.get("phone")).replace(/[\s()-]/g, ""), service: String(values.get("service")), preferred: new Date(String(values.get("time"))).toISOString() });
    setStatus(error ? error.message : "Request received. The salon will contact you to confirm your appointment.");
    if (!error) form.reset();
    setBusy(false);
  }
  return <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6"><h2 className="text-3xl font-extrabold">Request an appointment</h2><form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Name<Input name="name" required minLength={2} maxLength={100} autoComplete="name" /></label><label className="text-sm font-semibold">Phone<Input name="phone" type="tel" required pattern="[+0-9 ()-]{10,20}" autoComplete="tel" /></label><label className="text-sm font-semibold">Service<select name="service" required className="h-10 w-full rounded-md border border-input bg-background px-3">{services.map((name) => <option key={name}>{name}</option>)}</select></label><label className="text-sm font-semibold">Preferred date and time<Input name="time" type="datetime-local" required /></label><div className="sm:col-span-2"><Button disabled={busy}>{busy ? "Sending…" : "Request appointment"}</Button><p aria-live="polite" className="mt-3 text-sm text-muted-foreground">{status || "Appointment times are confirmed by the salon."}</p></div></form></section>;
}