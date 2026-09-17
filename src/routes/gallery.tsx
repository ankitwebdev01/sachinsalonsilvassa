import { createFileRoute } from "@tanstack/react-router";
import { SectionTitle, SiteShell } from "@/components/salon/SiteShell";
import fadeSrc from "@/assets/mens-haircut-fade.jpg";
import stylingSrc from "@/assets/mens-hair-styling.jpg";
import womenSrc from "@/assets/womens-hair-styling.jpg";
import interiorSrc from "@/assets/salon-interior.avif";
import womenHaircutMenu from "@/assets/sachin-menu-women-haircut.jpg.asset.json";
import womenColourSpaMenu from "@/assets/sachin-menu-women-colour-spa.jpg.asset.json";
import womenFacialWaxingMenu from "@/assets/sachin-menu-women-facial-waxing.jpg.asset.json";
import menFacialCleanupMenu from "@/assets/sachin-menu-men-facial-cleanup.jpg.asset.json";
import menHaircutWaxingMenu from "@/assets/sachin-menu-men-haircut-waxing.jpg.asset.json";
import colourBleachMenu from "@/assets/sachin-menu-colour-bleach.jpg.asset.json";
import threadingMakeupMenu from "@/assets/sachin-menu-threading-makeup-contact.jpg.asset.json";

export const Route=createFileRoute("/gallery")({head:()=>({meta:[{title:"Salon Gallery in Silvassa | Sachin Salon"},{name:"description",content:"View Sachin Unisex Salon photos and service catalogue images for women, men, family salon care, haircuts, facials, spa and grooming in Silvassa."},{property:"og:title",content:"Sachin Unisex Salon Gallery"},{property:"og:description",content:"Real salon photos and service menu images from Sachin Unisex Salon, Silvassa."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary_large_image"},{property:"og:url",content:"/gallery"}],links:[{rel:"canonical",href:"/gallery"}]}),component:GalleryPage});

const salonPhotos=[{url:womenSrc,alt:"Women’s hair styling at Sachin Unisex Salon"},{url:fadeSrc,alt:"Men’s fade haircut at Sachin Unisex Salon"},{url:stylingSrc,alt:"Men’s haircut preparation at Sachin Unisex Salon"},{url:interiorSrc,alt:"Sachin Unisex Salon interior in Silvassa"}];
const menuPhotos=[womenHaircutMenu,womenColourSpaMenu,womenFacialWaxingMenu,menFacialCleanupMenu,menHaircutWaxingMenu,colourBleachMenu,threadingMakeupMenu];

function GalleryPage(){return <SiteShell><section className="bg-warm"><div className="mx-auto max-w-6xl px-4 py-16 sm:px-6"><p className="text-xs font-bold uppercase text-primary">Gallery</p><h1 className="mt-3 text-4xl font-extrabold sm:text-5xl">Salon photos and service catalogue</h1><p className="mt-4 max-w-2xl text-muted-foreground">Browse real salon images and the provided service menu pages for Sachin Unisex Salon.</p></div></section><section className="mx-auto max-w-6xl px-4 py-16 sm:px-6"><SectionTitle title="From our chairs" /><div className="grid grid-cols-2 gap-3 md:grid-cols-4">{salonPhotos.map((p)=><img key={p.url} src={p.url} alt={p.alt} loading="lazy" className="aspect-[4/5] w-full rounded-lg object-cover" />)}</div></section><section className="bg-secondary"><div className="mx-auto max-w-6xl px-4 py-16 sm:px-6"><SectionTitle title="Service catalogue photos" /><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{menuPhotos.map((p,i)=><a key={p.url} href={p.url} target="_blank" rel="noreferrer" className="group block overflow-hidden rounded-lg border border-border bg-card"><img src={p.url} alt={`Sachin Salon service catalogue page ${i+1}`} loading="lazy" className="aspect-[3/4] w-full object-cover transition-transform group-hover:scale-[1.02]" /><p className="p-4 text-sm font-bold">Menu page {i+1}</p></a>)}</div></div></section></SiteShell>}