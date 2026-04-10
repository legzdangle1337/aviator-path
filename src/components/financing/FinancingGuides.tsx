import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, ArrowRight } from "lucide-react";

const GUIDES = [
  {
    title: "How to Finance Flight Training in 2026",
    description: "A complete guide covering every funding option — from federal aid to private loans to scholarships.",
    slug: "how-to-finance-flight-training-2026",
  },
  {
    title: "Federal Aid for Flight School: What Qualifies",
    description: "Which programs qualify for Pell Grants, Stafford Loans, and the GI Bill — and which don't.",
    slug: "federal-aid-flight-school",
  },
  {
    title: "Stratus Financial: Honest Review 2026",
    description: "An unbiased deep-dive into rates, requirements, student experiences, and how Stratus compares.",
    slug: "stratus-financial-review-2026",
  },
];

export function FinancingGuides() {
  return (
    <section>
      <h2 className="text-2xl font-bold text-[hsl(var(--navy))] mb-6 flex items-center gap-2">
        <BookOpen className="h-6 w-6 text-[hsl(var(--gold))]" />
        Financing Guides
      </h2>
      <div className="grid md:grid-cols-3 gap-6">
        {GUIDES.map((g) => (
          <Card key={g.slug} className="hover:border-[hsl(var(--sky))] transition-colors group cursor-pointer">
            <CardContent className="p-6 flex flex-col h-full">
              <h3 className="font-semibold text-[hsl(var(--navy))] mb-2 group-hover:text-[hsl(var(--primary))] transition-colors">
                {g.title}
              </h3>
              <p className="text-sm text-muted-foreground flex-1">{g.description}</p>
              <span className="mt-4 text-sm font-medium text-[hsl(var(--primary))] flex items-center gap-1 group-hover:gap-2 transition-all">
                Read Guide <ArrowRight className="h-4 w-4" />
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
