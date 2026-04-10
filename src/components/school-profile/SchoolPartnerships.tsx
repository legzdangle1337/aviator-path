import { Badge } from "@/components/ui/badge";
import type { Tables } from "@/integrations/supabase/types";

type School = Tables<"schools">;

const PARTNERSHIPS = [
  { key: "skywest_elite", name: "SkyWest Elite", benefit: "Day 1 SkyWest Seniority", color: "bg-blue-100 text-blue-800" },
  { key: "united_aviate", name: "United Aviate", benefit: "Pathway to United Airlines", color: "bg-indigo-100 text-indigo-800" },
  { key: "southwest_d225", name: "Southwest D225", benefit: "Southwest Cadet Program", color: "bg-orange-100 text-orange-800" },
  { key: "delta_propel", name: "Delta Propel", benefit: "Delta Pipeline Program", color: "bg-purple-100 text-purple-800" },
  { key: "envoy_cadet", name: "Envoy Cadet", benefit: "Pathway to American Airlines", color: "bg-red-100 text-red-800" },
  { key: "gojet_academy", name: "GoJet Academy", benefit: "GoJet Pilot Pipeline", color: "bg-teal-100 text-teal-800" },
  { key: "psa_pathway", name: "PSA Pathway", benefit: "PSA Airlines Pipeline", color: "bg-cyan-100 text-cyan-800" },
  { key: "piedmont_pathway", name: "Piedmont Pathway", benefit: "Piedmont Airlines Pipeline", color: "bg-emerald-100 text-emerald-800" },
] as const;

export function SchoolPartnerships({ school }: { school: School }) {
  const active = PARTNERSHIPS.filter(p => school[p.key as keyof School] === true);

  return (
    <section id="partnerships" className="scroll-mt-20">
      <h2 className="text-2xl font-bold text-foreground mb-6">Airline Pathway Opportunities</h2>
      {active.length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {active.map(p => (
            <div key={p.key} className="border rounded-xl p-4 flex items-start gap-4 bg-card">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
                {p.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-foreground">{p.name}</p>
                <Badge className={`${p.color} mt-1 text-xs`}>{p.benefit}</Badge>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-muted rounded-xl p-6 text-muted-foreground text-sm">
          No airline partnership programs at this time. Students may apply to all airlines independently after completing training.
        </div>
      )}
    </section>
  );
}
