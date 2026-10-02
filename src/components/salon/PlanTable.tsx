import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappUrl, type Plan } from "@/lib/salon";

type PlanTableProps = {
  plans: Plan[];
  enquiryLabel: string;
  messagePrefix: string;
  showImages?: boolean;
};

export function PlanTable({ plans, enquiryLabel, messagePrefix, showImages = false }: PlanTableProps) {
  return <div className="mt-8 overflow-hidden rounded-lg border border-border shadow-sm">
    <div className={`hidden gap-4 border-b border-border bg-ink px-5 py-4 text-left text-xs font-bold uppercase text-primary md:grid ${showImages ? "grid-cols-[120px_1.1fr_.7fr_.8fr_1.7fr_auto]" : "grid-cols-[1.1fr_.7fr_.8fr_2fr_auto]"}`}>
      {showImages && <span>Training</span>}<span>Plan</span><span>Price</span><span>Duration</span><span>What is included</span><span>Enquire</span>
    </div>
    <div>
      {plans.map((plan,index) => <article key={plan.name} className={`grid gap-4 border-b border-border px-5 py-6 last:border-b-0 md:items-center ${showImages ? "md:grid-cols-[120px_1.1fr_.7fr_.8fr_1.7fr_auto]" : "md:grid-cols-[1.1fr_.7fr_.8fr_2fr_auto]"} ${index%2===0 ? "bg-ink text-ink-foreground" : "bg-primary text-primary-foreground"}`}>
        {showImages && <div className="overflow-hidden rounded-md bg-background">{plan.imageUrl ? <img src={plan.imageUrl} alt={`${plan.name} training`} loading="lazy" className="aspect-square h-full w-full object-cover"/> : <div className="grid aspect-square place-items-center px-2 text-center text-xs text-muted-foreground">Image coming soon</div>}</div>}
        <div><h3 className="text-lg font-extrabold">{plan.name}</h3><p className={`mt-1 text-sm leading-6 ${index%2===0 ? "text-ink-muted" : "text-primary-foreground/75"}`}>{plan.description}</p></div>
        <div><span className="text-xs font-bold uppercase opacity-70 md:hidden">Price</span><p className="text-xl font-extrabold">₹{plan.price.toLocaleString("en-IN")}</p></div>
        <div><span className="text-xs font-bold uppercase text-muted-foreground md:hidden">Duration</span><p className="text-sm font-bold">{plan.duration}</p></div>
        <ul className="space-y-2">{plan.benefits.map((benefit) => <li key={benefit} className="flex gap-2 text-sm leading-5"><Check className="mt-0.5 h-4 w-4 shrink-0"/><span>{benefit}</span></li>)}</ul>
        <Button asChild variant={index%2===0 ? "default" : "secondary"} className="w-full md:w-auto"><a href={whatsappUrl(`${messagePrefix} ${plan.name} plan priced at ₹${plan.price.toLocaleString("en-IN")}.`)} target="_blank" rel="noreferrer">{enquiryLabel}</a></Button>
      </article>)}
    </div>
  </div>;
}