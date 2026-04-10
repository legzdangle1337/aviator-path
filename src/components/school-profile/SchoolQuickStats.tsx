import type { Tables } from "@/integrations/supabase/types";

type School = Tables<"schools">;

export function SchoolQuickStats({ school }: { school: School }) {
  const costMin = school.true_cost_min ?? school.advertised_cost_min;
  const costMax = school.true_cost_max ?? school.advertised_cost_max;
  const costStr = costMin && costMax
    ? `$${Math.round(costMin / 1000)}K - $${Math.round(costMax / 1000)}K`
    : costMin ? `From $${Math.round(costMin / 1000)}K` : "Contact";

  const partnerCount = [school.skywest_elite, school.united_aviate, school.delta_propel, school.southwest_d225, school.envoy_cadet, school.gojet_academy, school.psa_pathway, school.piedmont_pathway].filter(Boolean).length;

  const stats = [
    { label: "Estimated Total Cost", value: costStr },
    { label: "Training Type", value: school.part_type === "both" ? "Part 61 & 141" : school.part_type ? `Part ${school.part_type}` : "N/A" },
    { label: "Fleet Size", value: school.total_aircraft ? `${school.total_aircraft} aircraft` : "N/A" },
    { label: "Annual VFR Days", value: school.vfr_days_per_year ? `${school.vfr_days_per_year}/year` : "N/A" },
    { label: "Airline Partners", value: partnerCount > 0 ? `${partnerCount} programs` : "None" },
  ];

  return (
    <div className="bg-background border-b overflow-x-auto">
      <div className="max-w-6xl mx-auto px-4 py-4 flex gap-0 min-w-max">
        {stats.map((s, i) => (
          <div key={i} className="flex-1 px-4 border-l-2 border-sky first:border-l-0" style={{ borderColor: "hsl(var(--sky))" }}>
            <p className="text-lg font-bold text-foreground">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
