import { supabase } from "@/integrations/supabase/client";

export type Business = { name: string; address: string; phone: string; displayPhone: string; rating: string; reviewCount: number; hours: string };
export type Service = { name: string; category: string; price: number; description: string };
export type Product = { name: string; brand: string; price: number };
export type Offer = { title: string; text: string; cta: string };
export type Review = { quote: string; author: string };
export type Faq = { question: string; answer: string };
export type Pages = { about: string; summary: string; membership: string };
export type ContentMap = { business: Business; services: Service[]; products: Product[]; offers: Offer[]; reviews: Review[]; faqs: Faq[]; pages: Pages };

export const defaults: ContentMap = {
  business: { name: "Sachin Unisex Salon", address: "Silvassa - 396230, Dadra and Nagar Haveli and Daman and Diu", phone: "+919173414508", displayPhone: "091734 14508", rating: "5.0", reviewCount: 345, hours: "Monday–Sunday · 9:00 AM–10:00 PM" },
  services: [
    { name: "Hair Cut", category: "Women", price: 150, description: "Main women’s haircut styles including U cut, layer cut, step cut and baby cut." },
    { name: "Hair Spa", category: "Women", price: 500, description: "Hair spa, dandruff care, hair fall care, keratin spa and oil massage with spa." },
    { name: "Hair Colour", category: "Women", price: 200, description: "Garnier, Matrix, B-Blunt, Wella, highlights, global colour and hair mehndi options." },
    { name: "Facial", category: "Women", price: 500, description: "Rich feel, fruit, lotus, L’Oréal, Shehnaz, VLCC, D-tan and mini facial choices." },
    { name: "Waxing", category: "Women", price: 150, description: "Face wax, hand wax, half leg wax, full leg wax, underarms and full body waxing." },
    { name: "Threading", category: "Women", price: 30, description: "Upper lips, eyebrow, forehead and full face threading services." },
    { name: "Straightening & Spa", category: "Women", price: 600, description: "Smoothening, straightening, rebonding, keratin treatment and repair care." },
    { name: "Make-up", category: "Women", price: 0, description: "Bridal, engagement, party make-up, hairstyle and mehndi styling by appointment." },
    { name: "Hair Cut", category: "Men", price: 100, description: "Men’s cut, kids cut, shampoo style and clean finishing." },
    { name: "Massage", category: "Men", price: 70, description: "Head massage with oil choices and body massage options." },
    { name: "Hair Colour", category: "Men", price: 300, description: "Natural colour, Matrix, B-Blunt, highlights and global colour options." },
    { name: "Bleach", category: "Men", price: 200, description: "Normal bleach, oxy bleach, D-tan bleach, VLCC and skin whitening bleach." },
    { name: "Facial", category: "Men", price: 450, description: "Mini facial, D-tan, lotus, VLCC, L’Oréal and premium facial services." },
    { name: "Clean-up", category: "Men", price: 200, description: "Massage face pack, scrub, charcoal and D-tan clean-up choices." },
    { name: "Shave & Beard", category: "Men", price: 70, description: "Shave, beard setup and beard setup with haircut and shampoo." },
    { name: "Complete Hair Ritual", category: "Family", price: 999, description: "Haircut, wash, nourishing care and finishing for a fresh salon look." },
    { name: "Family Haircuts", category: "Family", price: 599, description: "Haircut packages for parents, kids and family visits." },
    { name: "Wedding & Party Ready", category: "Family", price: 0, description: "Make-up, hair styling and grooming for family occasions." },
    { name: "Facial & Hair Spa Combo", category: "Family", price: 1499, description: "A combined self-care package for hair, skin and relaxation." },
    { name: "Doorstep Salon Package", category: "Family", price: 0, description: "Premium salon-at-your-doorstep booking by appointment and availability." },
  ],
  products: [
    { name: "Nourishing Shampoo", brand: "Professional Hair Care", price: 699 },
    { name: "Repair Hair Mask", brand: "Salon Essentials", price: 899 },
    { name: "Smooth Finish Serum", brand: "Professional Hair Care", price: 549 },
    { name: "Colour Protect Conditioner", brand: "Salon Essentials", price: 749 },
  ],
  offers: [
    { title: "First Visit Welcome", text: "Discover personalised salon care in Silvassa with a smooth first appointment experience.", cta: "Book on WhatsApp" },
    { title: "Complete Hair Ritual", text: "Haircut, wash, nourishing care and styling tailored for your best hair day.", cta: "Enquire now" },
    { title: "Family Salon Day", text: "Easy hair and grooming appointments for parents and children together.", cta: "Plan your visit" },
  ],
  reviews: [
    { quote: "Best experience and brilliant staff good service 😊", author: "Google review" },
    { quote: "Nice salon with nice facilities. Personal care is taken by the owner himself.", author: "Google review" },
    { quote: "Had a wonderful experience overall with haircut, facial and hair spa.", author: "Google review" },
  ],
  faqs: [
    { question: "How many types of salons exist?", answer: "Some salons are unisex and cater to both men and women, while others specialise. Sachin Unisex Salon welcomes everyone in Silvassa." },
    { question: "Can I walk in for a service?", answer: "Walk-ins may be available, but contacting us on WhatsApp before your visit is recommended so we can reserve your preferred time." },
    { question: "Can I get nail art done at Sachin Unisex Salon?", answer: "Service availability may change. Please message the salon on WhatsApp before visiting to confirm specialist services." },
    { question: "How good are the services?", answer: "Customers have rated Sachin Unisex Salon 5.0 on Google across 345 reviews for attentive service and quality salon care." },
    { question: "How can I contact Sachin Unisex Salon in Silvassa?", answer: "Tap any phone number or WhatsApp button on this website to start a personal chat with the salon." },
  ],
  pages: {
    about: "Sachin Unisex Salon is a leading salon in Silvassa, offering thoughtful hair and beauty services for women and men. Our team focuses on careful consultation, skilled service and a welcoming experience for every guest.",
    summary: "Whether you are visiting for a regular haircut, a fresh new style or complete grooming care, Sachin Unisex Salon brings attentive service and professional finishing together in one convenient Silvassa destination.",
    membership: "Enjoy more from every visit with salon privileges, seasonal care offers and personalised service recommendations.",
  },
};

export const whatsappUrl = (message = "Hello Sachin Unisex Salon, I would like to book an appointment.") => `https://wa.me/919173414508?text=${encodeURIComponent(message)}`;

export async function loadContent(): Promise<ContentMap> {
  const { data } = await supabase.from("site_content").select("content_key, content");
  if (!data) return defaults;
  const output = { ...defaults } as ContentMap;
  for (const row of data) {
    if (row.content_key in output) Object.assign(output, { [row.content_key]: row.content });
  }
  return output;
}

export async function saveContent<K extends keyof ContentMap>(key: K, value: ContentMap[K]) {
  const { error } = await supabase.from("site_content").update({ content: value }).eq("content_key", key);
  if (error) throw error;
}
