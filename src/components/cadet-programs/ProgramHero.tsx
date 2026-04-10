import { Briefcase } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Program = Tables<"cadet_programs">;

function StatusBadge({ status }: { status: string | null }) {
  const s = (status || "unknown").toLowerCase();
  const cls = s === "open" ? "bg-green-500" : s === "closed" ? "bg-red-500" : s === "rolling" ? "bg-blue-500" : "bg-muted";
  return <span className={`${cls} text-white px-4 py-1.5 rounded-full text-sm font-bold uppercase`}>{s}</span>;
}

export function ProgramHero({ program }: { program: Program }) {
  return (
    <div className="relative bg-[hsl(var(--navy))] text-white overflow-hidden">
      {program.hero_image_url && (
        <img src={program.hero_image_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" />
      )}
      <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          {program.airline_logo_url ? (
            <img src={program.airline_logo_url} alt={program.airline_name} className="h-20 w-20 rounded-xl bg-white p-2 object-contain" />
          ) : (
            <div className="h-20 w-20 rounded-xl bg-white/10 flex items-center justify-center">
              <Briefcase className="h-10 w-10 text-white/60" />
            </div>
          )}
          <div className="space-y-3">
            <p className="text-white/70 text-sm font-medium uppercase tracking-wide">{program.airline_name}</p>
            <h1 className="text-3xl md:text-5xl font-bold">{program.program_name}</h1>
            <div className="flex items-center gap-4 flex-wrap">
              <StatusBadge status={program.application_status} />
              {program.application_url && (
                <a
                  href={program.application_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-accent text-accent-foreground px-6 py-2.5 rounded-lg font-semibold hover:bg-accent/90 transition-colors"
                >
                  Apply Now
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
