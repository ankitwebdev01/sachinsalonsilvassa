import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { whatsappUrl, type Plan } from "@/lib/salon";

type PlanTableProps = {
  plans: Plan[];
  enquiryLabel: string;
  messagePrefix: string;
};

export function PlanTable({ plans, enquiryLabel, messagePrefix }: PlanTableProps) {
  return <div className="mt-8 overflow-hidden rounded-lg border border-border bg-card text-card-foreground shadow-sm">
    <div className="hidden grid-cols-[1.1fr_0.7fr_0.8fr_2fr_auto] gap-4 border-b border-border bg-secondary px-5 py-4 text-left text-xs font-bold uppercase text-muted-foreground md:grid">
      <span>Plan</span><span>Price</span><span>Duration</span><span>What is included</span><span>Enquire</span>
    </div>
    <div className="divide-y divide-border">
      {plans.map((plan) => <article key={plan.name} className="grid gap-4 px-5 py-6 md:grid-cols-[1.1fr_0.7fr_0.8fr_2fr_auto] md:items-center">
        <div><h3 className="text-lg font-extrabold">{plan.name}</h3><p className="mt-1 text-sm leading-6 text-muted-foreground">{plan.description}</p></div>
        <div><span className="text-xs font-bold uppercase text-muted-foreground md:hidden">Price</span><p className="text-xl font-extrabold text-primary">₹{plan.price.toLocaleString("en-IN")}</p></div>
        <div><span className="text-xs font-bold uppercase text-muted-foreground md:hidden">Duration</span><p className="text-sm font-bold">{plan.duration}</p></div>
        <ul className="space-y-2">{plan.benefits.map((benefit) => <li key={benefit} className="flex gap-2 text-sm leading-5"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary"/><span>{benefit}</span></li>)}</ul>
        <Button asChild className="w-full md:w-auto"><a href={whatsappUrl(`${messagePrefix} ${plan.name} plan priced at ₹${plan.price.toLocaleString("en-IN")}.`)} target="_blank" rel="noreferrer">{enquiryLabel}</a></Button>
      </article>)}
    </div>
  </div>;
}