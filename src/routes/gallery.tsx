import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SectionTitle, SiteShell } from "@/components/salon/SiteShell";
import { useSalonContent } from "@/components/salon/Content";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Salon Gallery in Silvassa | Sachin Family Saloon" },
      { name: "description", content: "Festive and everyday looks from Sachin Family Saloon, Silvassa — Diwali, Dussehra, Teej, Navratri, bridal and more." },
      { property: "og:title", content: "Sachin Family Saloon Gallery" },
      { property: "og:description", content: "Festive Diwali, Dussehra, Teej and bridal looks plus everyday salon work in Silvassa." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const c = useSalonContent();
  const [occasion, setOccasion] = useState("All");
  const occasions = ["All", ...Array.from(new Set(c.gallery.map((g) => g.occasion || "Everyday")))];
  const shown = occasion === "All" ? c.gallery : c.gallery.filter((g) => (g.occasion || "Everyday") === occasion);
  return (
    <SiteShell>
      <section className="bg-warm">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="text-xs font-bold uppercase text-primary">Gallery</p>
          <h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Looks from our chairs</h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">Festive specials and everyday salon work from Sachin Family Saloon.</p>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionTitle title="Browse by occasion" />
        <div className="mb-8 flex flex-wrap gap-2">
          {occasions.map((o) => (
            <Button key={o} variant={occasion === o ? "default" : "secondary"} onClick={() => setOccasion(o)}>{o}</Button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {shown.map((p, i) => (
            <figure key={`${p.imageUrl}-${i}`} className="min-w-0">
              <img src={p.imageUrl} alt={p.caption || `${p.occasion} look at Sachin Family Saloon`} loading="lazy" className="aspect-[4/5] w-full rounded-lg object-cover" />
              {p.caption && <figcaption className="mt-2 text-xs text-muted-foreground">{p.caption}</figcaption>}
            </figure>
          ))}
        </div>
        {!shown.length && <p className="text-muted-foreground">Photos coming soon.</p>}
      </section>
    </SiteShell>
  );
}
