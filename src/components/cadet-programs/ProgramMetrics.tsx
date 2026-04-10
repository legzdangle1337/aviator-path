import { Briefcase, Clock, GraduationCap, DollarSign, School } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Program = Tables<"cadet_programs">;

export function ProgramMetrics({ program }: { program: Program }) {
  const metrics = [
    {
      icon: Briefcase,
      label: "Conditional Job Offer",
      value: program.conditional_job_offer ? "Yes ✓" : "No — Preferred Interview",
    },
    {
      icon: Clock,
      label: "Min Hours Required",
      value: program.min_total_hours ? `${program.min_total_hours} hours` : "0 (ab initio)",
    },
    {
      icon: School,
      label: "Partner Schools",
      value: program.any_school_eligible ? "Any FAA School" : "Partner Schools Only",
    },
    {
      icon: DollarSign,
      label: "Tuition Reimbursement",
      value: program.tuition_reimbursement ? `$${program.tuition_reimbursement.toLocaleString()}` : "None listed",
    },
    {
      icon: GraduationCap,
      label: "Est. Time to FO Seat",
      value: program.avg_time_to_fo_seat || "Varies",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
      {metrics.map((m) => (
        <div key={m.label} className="border border-border rounded-xl p-4 bg-card text-center">
          <m.icon className="h-5 w-5 text-primary mx-auto mb-2" />
          <p className="text-xs text-muted-foreground mb-1">{m.label}</p>
          <p className="text-sm font-semibold text-foreground">{m.value}</p>
        </div>
      ))}
    </div>
  );
}
