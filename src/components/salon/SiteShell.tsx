import { Link } from "@tanstack/react-router";
import { MapPin, Menu, MessageCircle, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/sachin-salon-logo.png.asset.json";
import { defaults, whatsappUrl } from "@/lib/salon";

const nav = [["Services", "/services"], ["Products", "/products"], ["Salons", "/salons"], ["Membership", "/membership"]] as const;

export function SiteShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <div className="min-h-screen bg-background text-foreground">
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto grid h-16 max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:px-6 lg:flex">
        <Link to="/" className="flex min-w-0 items-center gap-3 lg:mr-8">
          <img src={logo.url} alt="Sachin Unisex Salon logo" className="h-11 w-11 shrink-0 rounded-full object-cover" />
          <span className="truncate text-sm font-extrabold uppercase tracking-wide">Sachin Unisex Salon</span>
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
        <div><img src={logo.url} alt="" className="mb-4 h-16 w-16 rounded-full object-cover brightness-0 invert" /><p className="max-w-xs text-sm text-ink-muted">Professional hair, beauty and grooming care for women and men in Silvassa.</p></div>
        <div><h2 className="mb-4 text-sm font-bold uppercase">Visit us</h2><p className="text-sm text-ink-muted">{defaults.business.address}</p><p className="mt-2 text-sm text-ink-muted">{defaults.business.hours}</p></div>
        <div><h2 className="mb-4 text-sm font-bold uppercase">Contact</h2><a className="text-xl font-bold" href={whatsappUrl()} target="_blank" rel="noreferrer">{defaults.business.displayPhone}</a><p className="mt-3 text-xs text-ink-muted">Tap the number to chat with us on WhatsApp.</p><Link to="/auth" className="mt-6 inline-block text-xs text-ink-muted hover:text-ink-foreground">Owner login</Link></div>
      </div>
      <div className="border-t border-ink-border px-4 py-5 text-center text-xs text-ink-muted">© 2026 Sachin Unisex Salon · Silvassa</div>
    </footer>
    <a href={whatsappUrl()} target="_blank" rel="noreferrer" aria-label="Chat with Sachin Unisex Salon on WhatsApp" className="fixed bottom-5 right-5 z-40 grid h-14 w-14 place-items-center rounded-full bg-whatsapp text-whatsapp-foreground shadow-xl transition-transform hover:scale-105"><MessageCircle className="h-6 w-6" /></a>
  </div>;
}

export function SectionTitle({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return <div className="mb-7 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4"><div className="min-w-0">{eyebrow && <p className="mb-2 text-xs font-bold uppercase text-primary">{eyebrow}</p>}<h2 className="text-2xl font-extrabold sm:text-3xl">{title}</h2></div>{action}</div>;
}
