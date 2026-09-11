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
    { name: "Hair Cut", category: "Women", price: 299, description: "A personalised cut shaped to suit your face and lifestyle." },
    { name: "Hair Wash & Blow Dry", category: "Women", price: 399, description: "Cleansing wash followed by a smooth salon finish." },
    { name: "Hair Colour", category: "Women", price: 999, description: "Rich, even colour with a shade consultation." },
    { name: "Hair Spa", category: "Women", price: 799, description: "Deep conditioning care for softer, healthier-looking hair." },
    { name: "Hair Cut", category: "Men", price: 199, description: "Clean, contemporary cuts with careful finishing." },
    { name: "Beard Styling", category: "Men", price: 149, description: "Precision beard shaping and detailing." },
    { name: "Hair Colour", category: "Men", price: 599, description: "Natural-looking grey coverage and modern colour." },
    { name: "Facial", category: "Unisex", price: 699, description: "Refreshing skin care selected for your skin needs." },
  ],
  products: [
    { name: "Nourishing Shampoo", brand: "Professional Hair Care", price: 699 },
    { name: "Repair Hair Mask", brand: "Salon Essentials", price: 899 },
    { name: "Smooth Finish Serum", brand: "Professional Hair Care", price: 549 },
    { name: "Colour Protect Conditioner", brand: "Salon Essentials", price: 749 },
  ],
  offers: [
    { title: "First Visit Welcome", text: "Discover personalised salon care in Silvassa.", cta: "Book on WhatsApp" },
    { title: "Complete Hair Ritual", text: "Haircut, wash and nourishing care tailored to you.", cta: "Enquire now" },
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
