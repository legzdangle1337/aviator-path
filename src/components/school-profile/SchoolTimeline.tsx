import { Clock } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type School = Tables<"schools">;

const MILESTONES = [
  { label: "PPL", pct: 0.15 },
  { label: "IR", pct: 0.30 },
  { label: "CPL-SE", pct: 0.50 },
  { label: "CPL-ME", pct: 0.60 },
  { label: "CFI", pct: 0.78 },
  { label: "CFII", pct: 0.90 },
  { label: "MEI", pct: 1.0 },
];

export function SchoolTimeline({ school }: { school: School }) {
  const minMonths = school.timeline_months_min;
  const maxMonths = school.timeline_months_max;

  if (!minMonths && !maxMonths) return null;

  const totalMonths = maxMonths || minMonths!;
  const rangeLabel = minMonths && maxMonths && minMonths !== maxMonths
    ? `${minMonths}–${maxMonths} months`
    : `~${totalMonths} months`;

  return (
    <section id="timeline" className="scroll-mt-20">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="h-5 w-5 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">Estimated Training Timeline</h2>
      </div>
      <p className="text-muted-foreground mb-6">
        Zero hours to MEI in approximately <span className="font-semibold text-foreground">{rangeLabel}</span>
      </p>

      <div className="relative">
        {/* Track */}
        <div className="h-3 rounded-full bg-secondary w-full" />
        <div
          className="absolute top-0 left-0 h-3 rounded-full bg-primary"
          style={{ width: "100%" }}
        />

        {/* Milestone markers */}
        {MILESTONES.map((m) => {
          const monthEst = Math.round(totalMonths * m.pct);
          return (
            <div
              key={m.label}
              className="absolute flex flex-col items-center"
              style={{ left: `${m.pct * 100}%`, top: "-4px", transform: "translateX(-50%)" }}
            >
              <div className="w-5 h-5 rounded-full bg-primary border-2 border-background shadow-sm" />
              <span className="mt-2 text-xs font-semibold text-foreground whitespace-nowrap">{m.label}</span>
              <span className="text-[10px] text-muted-foreground">~{monthEst} mo</span>
            </div>
          );
        })}
      </div>

      {/* Spacer for labels below */}
      <div className="h-14" />

      <p className="text-xs text-muted-foreground mt-2">
        Timeline estimates based on full-time training. Individual results vary based on weather, scheduling, and aptitude.
      </p>
    </section>
  );
}
