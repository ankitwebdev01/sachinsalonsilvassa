import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BadgeCheck, CalendarCheck, Phone, Scissors, ShieldCheck, Sparkles, Star, Truck } from "lucide-react";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { SectionTitle, SiteShell } from "@/components/salon/SiteShell";
import { useSalonContent } from "@/components/salon/Content";
import { whatsappUrl } from "@/lib/salon";
import fadeSrc from "@/assets/mens-haircut-fade.jpg";
import stylingSrc from "@/assets/mens-hair-styling.jpg";
import womenSrc from "@/assets/womens-hair-styling.jpg";
import interiorSrc from "@/assets/salon-interior.avif";
import firstVisitSrc from "@/assets/offer-first-visit.jpg";
import hairRitualSrc from "@/assets/offer-hair-ritual.jpg";
import familyOfferSrc from "@/assets/offer-family.jpg";
import type { Offer } from "@/lib/salon";

const fade = { url: fadeSrc };
const styling = { url: stylingSrc };
const women = { url: womenSrc };
const interior = { url: interiorSrc };
const photos = [women, fade, styling, interior];
const offerPhotos = [firstVisitSrc, hairRitualSrc, familyOfferSrc];
const fallbackPhoto = interior;

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Best Unisex Hair Salon in Silvassa, Gujarat | Sachin Salon" }, { name: "description", content: "Sachin Unisex Salon offers haircuts, styling, colour, spa and grooming in Silvassa. Rated 5.0 across 345 Google reviews." }, { property: "og:title", content: "Best Unisex Hair Salon in Silvassa, Gujarat" }, { property: "og:description", content: "Professional hair and beauty care for women, men and families in Silvassa." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }, { property: "og:url", content: "/" }], links: [{ rel: "canonical", href: "/" }], scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "HairSalon", name: "Sachin Unisex Salon", telephone: "+919173414508", address: { "@type": "PostalAddress", addressLocality: "Silvassa", postalCode: "396230", addressRegion: "Dadra and Nagar Haveli and Daman and Diu", addressCountry: "IN" }, aggregateRating: { "@type": "AggregateRating", ratingValue: "5", reviewCount: "345" } }) }] }), component: HomePage,
});

function OfferSlider({ offers, offset = 0 }: { offers: Offer[]; offset?: number }) { const sliderRef = useRef<HTMLDivElement>(null); const current = useRef(offset); const moveTo = (next: number) => { const node = sliderRef.current; if (!node || offers.length === 0) return; current.current = (next + offers.length) % offers.length; node.scrollTo({ left: current.current * node.clientWidth, behavior: "smooth" }); }; useEffect(() => { const timer = window.setInterval(() => moveTo(current.current + 1), 4200); return () => window.clearInterval(timer); }, [offers.length]); return <div className="relative"><div ref={sliderRef} className="no-scrollbar flex snap-x snap-mandatory overflow-x-auto scroll-smooth rounded-lg" aria-label="Salon offers slider">{offers.map((offer, i) => <article key={`${offer.title}-${i}`} className="relative min-h-48 w-full shrink-0 snap-center overflow-hidden rounded-lg bg-ink text-ink-foreground shadow-xl"><img src={offerPhotos[i%offerPhotos.length]} alt={`${offer.title} at Sachin Unisex Salon`} width={1200} height={608} className="absolute inset-0 h-full w-full object-cover opacity-60" /><div className="absolute inset-0 bg-linear-to-r from-ink via-ink/75 to-transparent" /><div className="relative flex min-h-48 max-w-sm flex-col justify-center p-6"><p className="mb-2 text-[11px] font-bold uppercase text-primary">Sachin Salon Offer</p><h2 className="text-2xl font-extrabold">{offer.title}</h2><p className="mt-2 line-clamp-2 text-xs leading-5 text-ink-muted">{offer.text}</p><Button asChild size="sm" className="mt-4 w-fit"><a href={whatsappUrl()} target="_blank" rel="noreferrer">{offer.cta}<ArrowRight /></a></Button></div></article>)}</div><div className="absolute bottom-3 right-3 flex gap-1"><Button type="button" size="icon" variant="secondary" className="h-8 w-8" onClick={() => moveTo(current.current-1)} aria-label="Previous offer"><ArrowLeft /></Button><Button type="button" size="icon" className="h-8 w-8" onClick={() => moveTo(current.current+1)} aria-label="Next offer"><ArrowRight /></Button></div></div> }

function HomePage() { const c = useSalonContent(); return <SiteShell>
  <section className="bg-warm">
    <div className="mx-auto grid max-w-6xl gap-8 px-4 pb-10 pt-8 sm:px-6 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
      <div className="animate-rise">
        <p className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-xs font-extrabold uppercase text-primary-foreground"><Scissors className="h-4 w-4" /> Silvassa’s trusted unisex salon</p>
        <h1 className="mt-5 max-w-xl text-4xl font-extrabold leading-tight sm:text-6xl">Best Unisex Hair Salon in Silvassa, Gujarat</h1>
        <p className="mt-4 max-w-lg text-lg text-muted-foreground">Haircuts, colour, spa, facials and grooming for women, men and families.</p>
        <div className="mt-6 grid max-w-xl gap-3 rounded-lg border border-border bg-card p-4 sm:grid-cols-[1fr_auto_1fr]">
          <div><p className="text-xs font-bold uppercase text-muted-foreground">Starting at</p><p className="text-3xl font-extrabold text-primary">₹100/-</p></div>
          <span className="hidden w-px bg-border sm:block" />
          <div><p className="text-xs font-bold uppercase text-primary">Rated 5/5</p><p className="text-sm font-semibold text-muted-foreground">345 Google reviews</p></div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg"><a href={whatsappUrl()} target="_blank" rel="noreferrer"><Phone />Book Free Consultation</a></Button>
          <Button asChild size="lg" variant="secondary"><a href={whatsappUrl()} target="_blank" rel="noreferrer">WhatsApp Us<ArrowRight /></a></Button>
        </div>
        <div className="mt-7 grid max-w-xl grid-cols-4 divide-x divide-border text-center">
          {[["345+", "Happy clients", BadgeCheck], ["Family", "Salon", ShieldCheck], ["Premium", "Quality", Sparkles], ["Daily", "Support", CalendarCheck]].map(([value, label, Icon]) => <div key={String(label)} className="px-2"><Icon className="mx-auto mb-2 h-5 w-5 text-primary" /><p className="text-sm font-extrabold">{value}</p><p className="text-[11px] text-muted-foreground">{label}</p></div>)}
        </div>
      </div>
      <div className="grid gap-4"><OfferSlider offers={c.offers} /><OfferSlider offers={c.offers} offset={1} /></div>
    </div>
    <div className="mx-auto grid max-w-6xl gap-3 px-4 pb-8 sm:px-6 md:grid-cols-4">{[[Truck, "Easy booking", "Message us on WhatsApp"], [ShieldCheck, "Safe service", "Clean tools and care"], [BadgeCheck, "Top rated", "5/5 by customers"], [Sparkles, "Premium finish", "Salon-ready styling"]].map(([Icon, title, text]) => <div key={String(title)} className="rounded-lg border border-border bg-background p-4"><Icon className="h-5 w-5 text-primary" /><p className="mt-2 font-bold">{title}</p><p className="text-xs text-muted-foreground">{text}</p></div>)}</div>
  </section>
  <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6"><SectionTitle title="Top Picks" action={<Link to="/services" className="text-sm font-bold">All services →</Link>} /><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{c.services.slice(0,4).map((s,i) => { const photo = photos[i%photos.length] ?? fallbackPhoto; return <Link to="/services" key={`${s.category}-${s.name}`} className="group rounded-lg bg-secondary p-3 text-center"><img src={photo.url} alt={`${s.name} at Sachin Unisex Salon`} className="mx-auto aspect-square w-full rounded-full object-cover transition-transform group-hover:scale-[1.03]" /><h3 className="mt-3 text-sm font-bold">{s.name}</h3><p className="text-xs text-muted-foreground">from ₹{s.price || "ask"}</p></Link>})}</div></section>
  <section className="bg-secondary"><div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_.9fr]"><img src={interior.url} alt="Inside Sachin Unisex Salon in Silvassa" className="h-full min-h-80 w-full rounded-lg object-cover" /><div className="self-center"><p className="text-xs font-bold uppercase text-primary">Your salon in Silvassa</p><h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Care that feels personal.</h2><p className="mt-5 leading-7 text-muted-foreground">{c.pages.about}</p><div className="mt-7 flex items-center gap-3"><span className="flex items-center gap-1 text-lg font-extrabold"><Star className="fill-primary text-primary" />{c.business.rating}</span><span className="text-sm text-muted-foreground">{c.business.reviewCount} Google reviews</span></div><Button asChild variant="outline" className="mt-7"><Link to="/salons">Visit our salon<ArrowRight /></Link></Button></div></div></section>
  <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6"><SectionTitle eyebrow="Real work" title="From our chairs" action={<Link to="/gallery" className="text-sm font-bold">Open gallery →</Link>} /><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{photos.map((p,i)=><img key={p.url} src={p.url} alt={["Women’s hair styling in Silvassa","Men’s fade haircut in Silvassa","Men’s haircut preparation","Sachin Unisex Salon interior"][i]} className="aspect-[4/5] w-full rounded-lg object-cover" loading="lazy" />)}</div></section>
  <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6"><SectionTitle eyebrow="Guests say" title="Loved in Silvassa" /><div className="grid gap-3 md:grid-cols-3">{c.reviews.map(r=><article key={r.quote} className="rounded-lg border border-border bg-card p-6"><div className="mb-4 flex gap-1 text-primary">{Array.from({length:5}).map((_,i)=><Star key={i} className="h-4 w-4 fill-primary" />)}</div><p className="leading-7">“{r.quote}”</p><p className="mt-5 text-xs font-bold text-muted-foreground">{r.author}</p></article>)}</div></section>
</SiteShell>; }