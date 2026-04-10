import { Link } from "react-router-dom";
import { Check, X, Minus } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Program = Tables<"cadet_programs">;

function StatusBadge({ status }: { status: string | null }) {
  const s = (status || "unknown").toLowerCase();
  if (s === "open") return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800">OPEN</span>;
  if (s === "closed") return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">CLOSED</span>;
  if (s === "rolling") return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">ROLLING</span>;
  return <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground">UNKNOWN</span>;
}

function BoolCell({ value }: { value: boolean | null }) {
  if (value === true) return <Check className="h-4 w-4 text-green-600 mx-auto" />;
  if (value === false) return <X className="h-4 w-4 text-red-400 mx-auto" />;
  return <Minus className="h-4 w-4 text-muted-foreground mx-auto" />;
}

export function ComparisonMatrix({ programs }: { programs: Program[] }) {
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left p-3 font-semibold text-foreground sticky left-0 bg-muted/50 z-10 min-w-[180px]">Program</th>
              <th className="text-left p-3 font-semibold text-foreground">Airline</th>
              <th className="text-center p-3 font-semibold text-foreground">Job Offer</th>
              <th className="text-center p-3 font-semibold text-foreground">Min Hours</th>
              <th className="text-center p-3 font-semibold text-foreground">Any School?</th>
              <th className="text-center p-3 font-semibold text-foreground">Reimburse</th>
              <th className="text-center p-3 font-semibold text-foreground">Status</th>
            </tr>
          </thead>
          <tbody>
            {programs.map((p, i) => (
              <tr key={p.id} className={`border-b border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/20"} hover:bg-primary/5 transition-colors`}>
                <td className="p-3 sticky left-0 z-10 bg-inherit">
                  <Link to={`/cadet-programs/${p.slug}`} className="font-medium text-primary hover:underline">
                    {p.program_name}
                  </Link>
                </td>
                <td className="p-3 text-foreground">{p.airline_name}</td>
                <td className="p-3 text-center"><BoolCell value={p.conditional_job_offer} /></td>
                <td className="p-3 text-center text-foreground">{p.min_total_hours ?? "0"}</td>
                <td className="p-3 text-center"><BoolCell value={p.any_school_eligible} /></td>
                <td className="p-3 text-center text-foreground">
                  {p.tuition_reimbursement ? `$${p.tuition_reimbursement.toLocaleString()}` : "—"}
                </td>
                <td className="p-3 text-center"><StatusBadge status={p.application_status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
