import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Menu, MessageCircle, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import logoSrc from "@/assets/sachin-salon-logo.png";
const logo = { url: logoSrc };
import { whatsappUrl } from "@/lib/salon";
import { useSalonContent } from "@/components/salon/Content";

const nav = [["Services", "/services"], ["Products", "/products"], ["Salons", "/salons"], ["Gallery", "/gallery"], ["Membership", "/membership"], ["Academy", "/academy"]] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const content = useSalonContent();
  const { business, appearance } = content;
  const displayLogo = appearance.logoUrl.trim() || logo.url;
  return <div data-theme={appearance.theme} className="min-h-screen max-w-full overflow-x-clip bg-background text-foreground">
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:px-6 lg:flex">
        <Link to="/" className="flex min-w-0 items-center gap-3 lg:mr-8">
          <img src={displayLogo} alt={`${business.name} logo`} className="h-11 w-11 shrink-0 rounded-full object-cover" onError={(event) => { event.currentTarget.src = logo.url; }} />
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
    <main>{children}</main>
    <footer className="border-t border-border bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
        <div><span className="mb-4 inline-grid rounded-full bg-background p-2"><img src={displayLogo} alt={`${business.name} logo`} className="h-14 w-14 rounded-full object-contain" onError={(event) => { event.currentTarget.src = logo.url; }} /></span><p className="max-w-xs text-sm text-ink-muted">Professional hair, beauty and grooming care for women, men and families in Silvassa.</p></div>
        <div><h2 className="mb-4 text-sm font-bold uppercase">Visit us</h2><p className="text-sm leading-6 text-ink-muted">{business.address}</p><p className="mt-2 text-sm text-ink-muted">{business.hours}</p></div>
        <div className="min-w-0"><h2 className="mb-4 text-sm font-bold uppercase">Contact</h2><a className="text-xl font-bold" href={whatsappUrl()} target="_blank" rel="noreferrer">{business.displayPhone}</a><a className="mt-3 flex min-w-0 items-start gap-2 text-sm text-ink-muted hover:text-ink-foreground" href={`mailto:${business.email}`}><Mail className="mt-0.5 h-4 w-4 shrink-0"/><span className="min-w-0 break-all">{business.email}</span></a><div className="mt-5 flex items-center gap-2"><a href={whatsappUrl()} target="_blank" rel="noreferrer" aria-label="WhatsApp" className="grid h-10 w-10 place-items-center rounded-full bg-whatsapp text-whatsapp-foreground"><MessageCircle className="h-5 w-5"/></a>{appearance.instagramUrl ? <a href={appearance.instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram" className="grid h-10 w-10 place-items-center rounded-full border border-ink-border text-ink-foreground"><Instagram className="h-5 w-5"/></a> : <span aria-label="Instagram link coming soon" title="Instagram link coming soon" className="grid h-10 w-10 place-items-center rounded-full border border-ink-border text-ink-muted opacity-60"><Instagram className="h-5 w-5"/></span>}{appearance.facebookUrl ? <a href={appearance.facebookUrl} target="_blank" rel="noreferrer" aria-label="Facebook" className="grid h-10 w-10 place-items-center rounded-full border border-ink-border text-ink-foreground"><Facebook className="h-5 w-5"/></a> : <span aria-label="Facebook link coming soon" title="Facebook link coming soon" className="grid h-10 w-10 place-items-center rounded-full border border-ink-border text-ink-muted opacity-60"><Facebook className="h-5 w-5"/></span>}</div></div>
      </div>
      <div className="border-t border-ink-border px-4 py-5 text-center text-xs text-ink-muted">© 2026 {business.name} · Silvassa</div>
    </footer>
    <a href={whatsappUrl()} target="_blank" rel="noreferrer" aria-label="Chat with Sachin Unisex Salon on WhatsApp" className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-xl transition-transform hover:scale-105"><MessageCircle className="h-6 w-6" /></a>
  </div>;
}

export function SectionTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return <div className="mb-7 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4"><div className="min-w-0">{eyebrow && <p className="mb-2 text-xs font-bold uppercase text-primary">{eyebrow}</p>}<h2 className="text-2xl font-extrabold sm:text-3xl">{title}</h2></div>{action}</div>;
}
