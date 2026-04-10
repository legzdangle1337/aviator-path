import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Tables } from "@/integrations/supabase/types";

type School = Tables<"schools">;

export function SchoolSimilar({ schools }: { schools: School[] }) {
  if (schools.length === 0) return null;

  return (
    <section className="scroll-mt-20">
      <h2 className="text-2xl font-bold text-foreground mb-6">You Might Also Consider</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {schools.map(s => {
          const cost = s.true_cost_min ? `$${Math.round(s.true_cost_min / 1000)}K` : null;
          return (
            <Link to={`/schools/${s.slug}`} key={s.id} className="border rounded-xl overflow-hidden bg-card hover:shadow-md transition-shadow">
              <div className="h-32 bg-gradient-to-br from-[hsl(var(--navy))] to-[hsl(var(--primary))] flex items-center justify-center">
                <span className="text-3xl font-bold text-white/30">{s.name.split(" ").map(w => w[0]).join("").slice(0, 3)}</span>
              </div>
              <div className="p-4">
                <p className="font-bold text-foreground text-sm mb-1 leading-tight">{s.name}</p>
                <p className="text-xs text-muted-foreground flex items-center gap-1 mb-2"><MapPin className="w-3 h-3" />{s.city}, {s.state}</p>
                <div className="flex gap-2 text-xs">
                  {s.aviatorpath_rating && (
                    <span className="flex items-center gap-0.5 text-accent"><Star className="w-3 h-3 fill-current" />{Number(s.aviatorpath_rating).toFixed(1)}</span>
                  )}
                  {cost && <span className="text-green-700 font-medium">{cost}+</span>}
                  {s.part_type && <Badge variant="secondary" className="text-[10px] px-1.5 h-4">{s.part_type === "both" ? "61/141" : `Part ${s.part_type}`}</Badge>}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
