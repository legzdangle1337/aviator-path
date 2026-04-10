import { Badge } from "@/components/ui/badge";
import { Plane } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type School = Tables<"schools">;

export function SchoolFleet({ school }: { school: School }) {
  const aircraft = school.aircraft_types ?? [];

  return (
    <section id="fleet" className="scroll-mt-20">
      <h2 className="text-2xl font-bold text-foreground mb-1">Training Fleet</h2>
      <p className="text-muted-foreground text-sm mb-6">
        {school.total_aircraft ? `${school.total_aircraft} total aircraft` : "Fleet information not available"}
        {school.has_g1000 && " • Glass cockpit equipped"}
      </p>

      {aircraft.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {aircraft.map((a, i) => (
            <div key={i} className="border rounded-xl p-4 bg-card flex flex-col items-center text-center gap-2">
              <Plane className="w-8 h-8 text-muted-foreground" />
              <p className="font-semibold text-foreground text-sm">{a}</p>
              <Badge variant="secondary" className="text-xs">
                {school.has_g1000 ? "Glass Cockpit" : "Traditional"}
              </Badge>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm">No detailed fleet information available. Contact the school for aircraft details.</p>
      )}

      {(school.has_simulator || school.simulator_types) && (
        <div className="mt-4 border rounded-xl p-4 bg-card">
          <p className="font-semibold text-foreground text-sm">Simulator Training</p>
          <p className="text-muted-foreground text-sm">{school.simulator_types || "Simulator available"}</p>
        </div>
      )}
    </section>
  );
}
