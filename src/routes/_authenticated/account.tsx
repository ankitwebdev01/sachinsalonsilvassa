import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { LogOut, Save } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SiteShell } from "@/components/salon/SiteShell";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated/account")({
  head: () => ({ meta: [{ title: "My Account | Sachin Family Saloon" }, { name: "description", content: "Manage your customer contact details and salon preferences." }, { property: "og:title", content: "My Account | Sachin Family Saloon" }, { property: "og:description", content: "Your private customer account." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: CustomerAccount,
});

const serviceOptions = ["Haircut", "Hair colour", "Hair spa", "Facial", "Grooming", "Family packages"];

function CustomerAccount() {
  const { user } = Route.useRouteContext();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [preferences, setPreferences] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    supabase.from("profiles").select("display_name, phone, preferences").eq("id", user.id).maybeSingle().then(({ data, error }) => {
      if (!active) return;
      if (error) setMessage("Your profile could not be loaded. Please try again.");
      if (data) {
        setName(data.display_name);
        setPhone(data.phone);
        const saved = data.preferences;
        if (saved && typeof saved === "object" && !Array.isArray(saved)) {
          const items = saved["services"];
          if (Array.isArray(items)) setPreferences(items.filter((item): item is string => typeof item === "string"));
        }
      }
      setLoading(false);
    });
    return () => { active = false; };
  }, [user.id]);

  function togglePreference(service: string) {
    setPreferences((current) => current.includes(service) ? current.filter((item) => item !== service) : [...current, service]);
  }

  async function saveProfile(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    const { error } = await supabase.from("profiles").update({ display_name: name.trim(), phone: phone.trim(), preferences: { services: preferences } }).eq("id", user.id);
    setMessage(error ? "Your profile could not be saved. Please try again." : "Profile saved.");
    setSaving(false);
  }

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    await navigate({ to: "/auth", replace: true });
  }

  return <SiteShell><section className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase text-primary">Customer account</p><h1 className="mt-2 text-3xl font-extrabold">Your details</h1><p className="mt-2 text-sm text-muted-foreground">Signed in as {user.email ?? "your account"}</p></div><Button type="button" variant="outline" onClick={signOut}><LogOut />Sign out</Button></div>
    <form onSubmit={saveProfile} className="space-y-6 rounded-lg border border-border bg-card p-5 sm:p-7">
      <label className="block space-y-2"><span className="text-sm font-semibold">Name</span><Input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required /></label>
      <label className="block space-y-2"><span className="text-sm font-semibold">Phone number</span><Input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" /></label>
      <fieldset><legend className="text-sm font-semibold">Services you are interested in</legend><div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">{serviceOptions.map((service) => <label key={service} className="flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm"><input type="checkbox" checked={preferences.includes(service)} onChange={() => togglePreference(service)} />{service}</label>)}</div></fieldset>
      {message && <p role="status" className="text-sm text-muted-foreground">{message}</p>}
      <div className="flex flex-wrap items-center gap-3"><Button type="submit" disabled={saving || loading || !name.trim()}><Save />{saving ? "Saving…" : "Save profile"}</Button><Button asChild type="button" variant="ghost"><Link to="/">Back to website</Link></Button></div>
    </form>
  </section></SiteShell>;
}