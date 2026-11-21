import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Menu, MessageCircle, X, Home, Scissors, Images, Phone } from "lucide-react";
import { useState, useEffect, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import logoSrc from "@/assets/sachin-salon-logo.png";
const logo = { url: logoSrc };
import { supabase } from "@/integrations/supabase/client";
import { whatsappUrl } from "@/lib/salon";
import { useSalonContent } from "@/components/salon/Content";

const nav = [["Services", "/services"], ["Products", "/products"], ["Salons", "/salons"], ["Gallery", "/gallery"], ["Membership", "/membership"], ["Academy", "/academy"]] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const content = useSalonContent();
  const { business, appearance } = content;
  const [admin, setAdmin] = useState(false);
  useEffect(() => { supabase.auth.getUser().then(async ({ data: { user } }) => { if (!user) return; const { data } = await supabase.from("user_roles").select("role").eq("user_id", user.id).eq("role", "admin").maybeSingle(); setAdmin(Boolean(data)); }); }, []);
  useEffect(() => { const icon = document.querySelector<HTMLLinkElement>('link[rel="icon"]'); const old = icon?.href; if (icon && appearance.logoUrl) icon.href = appearance.logoUrl; return () => { if (icon && old) icon.href = old; }; }, [appearance.logoUrl]);
  const displayLogo = appearance.logoUrl.trim() || logo.url;
  return <div data-theme={appearance.theme} className="min-h-screen min-w-0 bg-background text-foreground">
    {appearance.showAnnouncement && appearance.announcement && <div className="bg-primary px-4 py-3 text-center text-sm font-bold text-primary-foreground break-words">{appearance.announcement}</div>}
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:px-6 lg:flex">
        <Link to="/" className="flex min-w-0 items-center gap-3 lg:mr-8">
          <img src={displayLogo} alt={`${business.name} logo`} className="h-11 w-11 shrink-0 rounded-full object-contain" onError={(event) => { event.currentTarget.src = logo.url; }} />
          <span className="truncate text-sm font-extrabold uppercase tracking-wide">{business.name}</span>
        </Link>
        <nav className="hidden items-center gap-7 lg:flex">
          {nav.map(([label, to]) => <Link key={to} to={to} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground" }}>{label}</Link>)}
        </nav>
        <div className="ml-auto hidden items-center gap-4 lg:flex">
          <span className="flex max-w-48 items-center gap-2 truncate text-xs text-muted-foreground"><MapPin className="h-4 w-4 text-primary" />Silvassa 396230</span>
          <Button asChild size="sm"><a href={whatsappUrl()} target="_blank" rel="noreferrer"><MessageCircle />Book now</a></Button>
        </div>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open navigation" onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button>
      </div>
      {open && <nav className="border-t border-border bg-background px-4 py-4 lg:hidden">{nav.map(([label, to]) => <Link key={to} to={to} onClick={() => setOpen(false)} className="block border-b border-border py-3 text-sm font-semibold">{label}</Link>)}</nav>}
    </header>
    {admin && <div className="border-b border-border bg-secondary px-4 py-2 text-right"><Link to="/dashboard" className="text-sm font-bold text-primary">Admin dashboard →</Link></div>}
    <main className="min-w-0 pb-24 lg:pb-0">{children}</main>
    <footer className="border-t border-border bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div><span className="mb-4 inline-grid rounded-full bg-background p-2"><img src={displayLogo} alt={`${business.name} logo`} className="h-14 w-14 rounded-full object-contain" onError={(event) => { event.currentTarget.src = logo.url; }} /></span><p className="max-w-xs text-sm text-ink-muted">Professional hair, beauty and grooming care for women, men and families in Silvassa.</p></div>
        <div><h2 className="mb-4 text-sm font-bold uppercase">Visit us</h2><p className="text-sm leading-6 text-ink-muted">{business.address}</p><p className="mt-2 text-sm text-ink-muted">{business.hours}</p></div>
        <div className="min-w-0"><h2 className="mb-4 text-sm font-bold uppercase">Contact</h2><a className="text-xl font-bold" href={whatsappUrl()} target="_blank" rel="noreferrer">{business.displayPhone}</a><a className="mt-3 flex min-w-0 items-start gap-2 text-sm text-ink-muted hover:text-ink-foreground" href={`mailto:${business.email}`}><Mail className="mt-0.5 h-4 w-4 shrink-0"/><span className="min-w-0 break-all">{business.email}</span></a><div className="mt-5 flex items-center gap-2"><a href={whatsappUrl()} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid h-10 w-10 place-items-center rounded-full bg-whatsapp text-whatsapp-foreground"><MessageCircle className="h-5 w-5"/></a>{appearance.instagramUrl ? <a href={appearance.instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-ink-border text-ink-foreground"><Instagram className="h-5 w-5"/></a> : <span aria-label="Instagram link coming soon" title="Instagram link coming soon" className="grid h-10 w-10 place-items-center rounded-full border border-ink-border text-ink-muted opacity-60"><Instagram className="h-5 w-5"/></span>}{appearance.facebookUrl ? <a href={appearance.facebookUrl} target="_blank" rel="noreferrer" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full border border-ink-border text-ink-foreground"><Facebook className="h-5 w-5"/></a> : <span aria-label="Facebook link coming soon" title="Facebook link coming soon" className="grid h-10 w-10 place-items-center rounded-full border border-ink-border text-ink-muted opacity-60"><Facebook className="h-5 w-5"/></span>}</div></div>
      </div>
      <div className="border-t border-ink-border px-4 py-5 text-center text-xs text-ink-muted">© 2026 {business.name} · Silvassa</div>
    </footer>
    <a href={whatsappUrl()} target="_blank" rel="noreferrer" aria-label="Chat with Sachin Family Saloon on WhatsApp" className="fixed bottom-24 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-xl transition-transform hover:scale-105 lg:bottom-5 lg:right-5"><WhatsAppIcon className="h-7 w-7" /></a>
    <nav aria-label="Mobile navigation" className="fixed inset-x-3 bottom-3 z-40 lg:hidden">
      <div className="relative grid grid-cols-5 items-center rounded-full border border-ink-border bg-ink px-2 py-2 text-ink-foreground shadow-2xl">
        <MobileTab to="/" label="Home" icon={<Home className="h-5 w-5" />} />
        <MobileTab to="/services" label="Services" icon={<Scissors className="h-5 w-5" />} />
        <div className="flex justify-center"><a href={`tel:+91${business.phone.replace(/\D/g, "").slice(-10)}`} aria-label="Call the salon" className="-mt-10 grid h-16 w-16 place-items-center rounded-full border-4 border-background bg-primary text-primary-foreground shadow-xl"><Phone className="h-7 w-7" /></a></div>
        <MobileTab to="/gallery" label="Gallery" icon={<Images className="h-5 w-5" />} />
        <MobileTab to="/salons" label="Visit" icon={<MapPin className="h-5 w-5" />} />
      </div>
    </nav>
  </div>;
}

export function SectionTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return <div className="mb-7 grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-end gap-3"><div className="min-w-0">{eyebrow && <p className="mb-2 text-xs font-bold uppercase text-primary">{eyebrow}</p>}<h2 className="text-2xl font-extrabold sm:text-3xl">{title}</h2></div><div className="shrink-0">{action}</div></div>;
}

function MobileTab({ to, label, icon }: { to: string; label: string; icon: ReactNode }) {
  return <Link to={to} className="flex flex-col items-center gap-0.5 text-[11px] font-semibold text-ink-muted" activeProps={{ className: "text-primary" }} activeOptions={{ exact: to === "/" }}>{icon}<span>{label}</span></Link>;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true"><path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.5h-.01a9.4 9.4 0 0 1-4.79-1.31l-.34-.2-3.56.93.95-3.47-.22-.36a9.4 9.4 0 0 1-1.44-5.02c0-5.2 4.23-9.42 9.43-9.42a9.37 9.37 0 0 1 9.42 9.43c0 5.2-4.23 9.42-9.44 9.42zm8.02-17.44A11.27 11.27 0 0 0 12.05.75C5.8.75.72 5.83.72 12.08c0 2 .52 3.95 1.52 5.66L.62 23.25l5.65-1.48a11.3 11.3 0 0 0 5.78 1.47h.01c6.25 0 11.33-5.08 11.33-11.33 0-3.03-1.18-5.87-3.32-8.01z"/></svg>;
}
