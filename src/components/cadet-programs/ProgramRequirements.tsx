import { Check, Star } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Program = Tables<"cadet_programs">;

export function ProgramRequirements({ program }: { program: Program }) {
  const must = program.requirements_must || [];
  const preferred = program.requirements_preferred || [];

  if (must.length === 0 && preferred.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold text-foreground mb-6">Requirements</h2>
      <div className="grid md:grid-cols-2 gap-6">
        {must.length > 0 && (
          <div className="border border-border rounded-xl p-6 bg-card">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <Check className="h-5 w-5 text-primary" /> MUST HAVE
            </h3>
            <ul className="space-y-2">
              {must.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                  <span className="text-primary mt-0.5">•</span> {r}
                </li>
              ))}
            </ul>
          </div>
        )}
        {preferred.length > 0 && (
          <div className="border border-border rounded-xl p-6 bg-card">
            <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <Star className="h-5 w-5 text-accent" /> PREFERRED
            </h3>
            <ul className="space-y-2">
              {preferred.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="text-accent mt-0.5">•</span> {r}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
