import { Link } from "react-router-dom";
import { School, ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import type { Tables } from "@/integrations/supabase/types";

type Program = Tables<"cadet_programs">;

export function ProgramPartnerSchools({ program }: { program: Program }) {
  const slugs = program.partner_school_slugs || [];

  const { data: schools = [] } = useQuery({
    queryKey: ["partner_schools", program.id],
    queryFn: async () => {
      if (slugs.length === 0) return [];
      const { data, error } = await supabase
        .from("schools")
        .select("id, name, slug, city, state, aviatorpath_rating")
        .in("slug", slugs);
      if (error) throw error;
      return data;
    },
    enabled: slugs.length > 0,
  });

  return (
    <section>
      <h2 className="text-2xl font-bold text-foreground mb-4">Partner Schools</h2>

      {program.any_school_eligible ? (
        <div className="border border-border rounded-xl p-6 bg-card">
          <div className="flex items-center gap-3 mb-3">
            <School className="h-6 w-6 text-primary" />
            <h3 className="font-semibold text-foreground">Any FAA Certificated Flight School</h3>
          </div>
          <p className="text-muted-foreground text-sm mb-4">
            This program accepts students from any FAA certificated flight school. You are not limited to specific partner schools.
          </p>
          <Button asChild variant="outline" className="gap-2">
            <Link to="/schools">Browse All Schools <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      ) : schools.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {schools.map((s) => (
            <Link
              key={s.id}
              to={`/schools/${s.slug}`}
              className="border border-border rounded-xl p-4 bg-card hover:shadow-md transition-shadow"
            >
              <h3 className="font-semibold text-foreground">{s.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">{s.city}, {s.state}</p>
              {s.aviatorpath_rating && Number(s.aviatorpath_rating) > 0 && (
                <p className="text-sm text-foreground mt-2">⭐ {Number(s.aviatorpath_rating).toFixed(1)}</p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="border border-border rounded-xl p-6 bg-card">
          <p className="text-muted-foreground text-sm">
            This program has specific partner school requirements. Visit the program website for the current list of approved schools.
          </p>
          <Button asChild variant="outline" className="gap-2 mt-4">
            <Link to="/schools">Browse All Schools <ArrowRight className="h-4 w-4" /></Link>
          </Button>
        </div>
      )}
    </section>
  );
}
