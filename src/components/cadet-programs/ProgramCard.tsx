import { Link } from "react-router-dom";
import { ArrowRight, Briefcase, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/integrations/supabase/types";

type Program = Tables<"cadet_programs">;

function StatusBadge({ status }: { status: string | null }) {
  const s = (status || "unknown").toLowerCase();
  if (s === "open") return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 uppercase">Open</span>;
  if (s === "closed") return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 uppercase">Closed</span>;
  if (s === "rolling") return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 uppercase">Rolling</span>;
  return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-muted text-muted-foreground uppercase">Unknown</span>;
}

export function ProgramCard({ program }: { program: Program }) {
  const keyBenefit = program.key_benefits?.[0];

  return (
    <div className="rounded-xl border border-border bg-card p-6 flex flex-col gap-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {program.airline_logo_url ? (
            <img src={program.airline_logo_url} alt={program.airline_name} className="h-10 w-10 rounded-lg object-contain bg-muted p-1" />
          ) : (
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-primary" />
            </div>
          )}
          <div>
            <h3 className="font-semibold text-foreground leading-tight">{program.program_name}</h3>
            <p className="text-sm text-muted-foreground">{program.airline_name}</p>
          </div>
        </div>
        <StatusBadge status={program.application_status} />
      </div>

      {/* Key benefit */}
      {keyBenefit && (
        <p className="text-sm text-muted-foreground line-clamp-2">{keyBenefit}</p>
      )}

      {/* Stats */}
      <div className="flex flex-wrap gap-3 text-xs">
        <span className="flex items-center gap-1 text-foreground/80">
          <Clock className="h-3.5 w-3.5" /> Min {program.min_total_hours || 0} hrs
        </span>
        {program.conditional_job_offer && (
          <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded-md font-medium">
            ✓ Job Offer
          </span>
        )}
        {program.tuition_reimbursement != null && program.tuition_reimbursement > 0 && (
          <span className="text-foreground/80">
            💰 ${program.tuition_reimbursement.toLocaleString()} reimburse
          </span>
        )}
      </div>

      {/* CTA */}
      <Button asChild variant="outline" className="mt-auto gap-2">
        <Link to={`/cadet-programs/${program.slug}`}>
          Learn More <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}
