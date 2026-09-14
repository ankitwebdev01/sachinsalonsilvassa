import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Scissors, Sparkles, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionTitle, SiteShell } from "@/components/salon/SiteShell";
import { useSalonContent } from "@/components/salon/Content";
import { whatsappUrl } from "@/lib/salon";
import fadeSrc from "@/assets/mens-haircut-fade.jpg";
const fade = { url: fadeSrc };
import stylingSrc from "@/assets/mens-hair-styling.jpg";
const styling = { url: stylingSrc };
import womenSrc from "@/assets/womens-hair-styling.jpg";
const women = { url: womenSrc };
import interiorSrc from "@/assets/salon-interior.avif";
const interior = { url: interiorSrc };

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Best Unisex Salon in Silvassa | Sachin Salon" }, { name: "description", content: "Sachin Unisex Salon offers haircuts, styling, colour, spa and grooming in Silvassa. Rated 5.0 across 345 Google reviews." }, { property: "og:title", content: "Sachin Unisex Salon — Silvassa" }, { property: "og:description", content: "Professional hair and beauty care for women and men in Silvassa." }, { property: "og:url", content: "/" }], links: [{ rel: "canonical", href: "/" }], scripts: [{ type: "application/ld+json", children: JSON.stringify({ "@context": "https://schema.org", "@type": "HairSalon", name: "Sachin Unisex Salon", telephone: "+919173414508", address: { "@type": "PostalAddress", addressLocality: "Silvassa", postalCode: "396230", addressRegion: "Dadra and Nagar Haveli and Daman and Diu", addressCountry: "IN" }, aggregateRating: { "@type": "AggregateRating", ratingValue: "5", reviewCount: "345" } }) }] }), component: HomePage,
});
const photos = [women, fade, styling, interior];
const fallbackPhoto = interior;
function HomePage() { const c = useSalonContent(); return <SiteShell>
  <section className="mx-auto max-w-6xl px-4 pb-14 pt-6 sm:px-6">
    <div className="grid gap-3 lg:grid-cols-2">
      {c.offers.slice(0,2).map((offer, i) => { const photo = photos[i] ?? fallbackPhoto; return <article key={offer.title} className={`relative min-h-80 overflow-hidden rounded-lg ${i ? "bg-warm" : "bg-secondary"}`}><img src={photo.url} alt="Salon style by Sachin Unisex Salon" className="absolute inset-0 h-full w-full object-cover opacity-45" /><div className="absolute inset-0 bg-linear-to-r from-background via-background/80 to-transparent" /><div className="relative flex min-h-80 max-w-sm flex-col justify-center p-8 sm:p-10"><p className="mb-3 text-xs font-bold uppercase text-primary">Sachin Salon · Silvassa</p><h1 className={i ? "text-4xl font-extrabold" : "text-4xl font-extrabold sm:text-5xl"}>{offer.title}</h1><p className="mt-3 text-sm text-muted-foreground">{offer.text}</p><Button asChild className="mt-6 w-fit"><a href={whatsappUrl()} target="_blank" rel="noreferrer">{offer.cta}<ArrowRight /></a></Button></div></article>})}
    </div>
  </section>
  <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6"><SectionTitle title="Book a service" action={<Link to="/services" className="text-sm font-bold">All services →</Link>} /><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{c.services.slice(0,8).map((s,i) => { const photo = photos[i%photos.length] ?? fallbackPhoto; return <Link to="/services" key={`${s.category}-${s.name}`} className="group rounded-lg bg-secondary p-3 text-center"><img src={photo.url} alt={`${s.name} at Sachin Unisex Salon`} className="mx-auto aspect-square w-full rounded-full object-cover transition-transform group-hover:scale-[1.03]" /><h3 className="mt-3 text-sm font-bold">{s.name}</h3><p className="text-xs text-muted-foreground">from ₹{s.price}</p></Link>})}</div></section>
  <section className="bg-secondary"><div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_.9fr]"><img src={interior.url} alt="Inside Sachin Unisex Salon in Silvassa" className="h-full min-h-80 w-full rounded-lg object-cover" /><div className="self-center"><p className="text-xs font-bold uppercase text-primary">Your salon in Silvassa</p><h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Care that feels personal.</h2><p className="mt-5 leading-7 text-muted-foreground">{c.pages.about}</p><div className="mt-7 flex items-center gap-3"><span className="flex items-center gap-1 text-lg font-extrabold"><Star className="fill-primary text-primary" />{c.business.rating}</span><span className="text-sm text-muted-foreground">{c.business.reviewCount} Google reviews</span></div><Button asChild variant="outline" className="mt-7"><Link to="/salons">Visit our salon<ArrowRight /></Link></Button></div></div></section>
  <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6"><SectionTitle eyebrow="Real work" title="From our chairs" /><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{photos.map((p,i)=><img key={p.url} src={p.url} alt={["Women’s hair styling in Silvassa","Men’s fade haircut in Silvassa","Men’s haircut preparation","Sachin Unisex Salon interior"][i]} className="aspect-[4/5] w-full rounded-lg object-cover" loading="lazy" />)}</div></section>
  <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6"><SectionTitle eyebrow="Guests say" title="Loved in Silvassa" /><div className="grid gap-3 md:grid-cols-3">{c.reviews.map(r=><article key={r.quote} className="rounded-lg border border-border bg-card p-6"><div className="mb-4 flex gap-1 text-primary">{Array.from({length:5}).map((_,i)=><Star key={i} className="h-4 w-4 fill-primary" />)}</div><p className="leading-7">“{r.quote}”</p><p className="mt-5 text-xs font-bold text-muted-foreground">{r.author}</p></article>)}</div></section>
</SiteShell>; }
