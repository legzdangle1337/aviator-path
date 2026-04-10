import { Button } from "@/components/ui/button";
import type { Tables } from "@/integrations/supabase/types";

type School = Tables<"schools">;

export function SchoolOverview({ school }: { school: School }) {
  const costMin = school.true_cost_min ?? school.advertised_cost_min;
  const costMax = school.true_cost_max ?? school.advertised_cost_max;
  const advMin = school.advertised_cost_min;
  const advMax = school.advertised_cost_max;

  const scrollToContact = () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section id="overview" className="scroll-mt-20">
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-2xl font-bold text-foreground">About {school.name}</h2>
          <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {school.long_description || school.description || "No description available."}
          </div>

          {school.editors_note && (
            <div className="bg-[hsl(var(--navy))] text-white rounded-xl p-5 border-l-4 border-accent">
              <p className="text-xs uppercase tracking-wide text-accent font-semibold mb-2">✈ AviatorPath Editor's Note</p>
              <p className="text-sm leading-relaxed opacity-90">{school.editors_note}</p>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="border rounded-xl p-6 shadow-sm bg-card">
            <h3 className="font-semibold text-foreground mb-4">True Cost Breakdown</h3>
            <div className="space-y-2 text-sm">
              {advMin && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Advertised Program Price</span>
                  <span className="font-medium">${advMin.toLocaleString()}{advMax ? ` - $${advMax.toLocaleString()}` : ""}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Checkride Fees (est.)</span>
                <span className="font-medium">$2,500</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Training Materials</span>
                <span className="font-medium">$1,500</span>
              </div>
              {school.housing_available && school.housing_cost_monthly && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Housing (12 mo.)</span>
                  <span className="font-medium">${(school.housing_cost_monthly * 12).toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fuel Overages (est.)</span>
                <span className="font-medium">$3,000</span>
              </div>
              <hr className="my-3" />
              <div className="flex justify-between text-base">
                <span className="font-bold text-foreground">TRUE ALL-IN ESTIMATE</span>
                <span className="font-bold text-green-700">
                  {costMin && costMax
                    ? `$${costMin.toLocaleString()} - $${costMax.toLocaleString()}`
                    : costMin ? `From $${costMin.toLocaleString()}` : "Contact school"}
                </span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Estimates based on community data. Contact school for current pricing.</p>
            <Button onClick={scrollToContact} className="w-full mt-4 bg-accent text-accent-foreground hover:bg-accent/90">Get Official Quote</Button>
          </div>
        </div>
      </div>
    </section>
  );
}
