import { ExternalLink } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type School = Tables<"schools">;

const LENDERS = [
  { key: "financing_stratus", name: "Stratus Financial" },
  { key: "financing_sallie_mae", name: "Sallie Mae" },
  { key: "financing_aopa", name: "AOPA Finance" },
  { key: "financing_meritize", name: "Meritize" },
  { key: "financing_earnest", name: "Earnest" },
] as const;

export function SchoolFinancing({ school }: { school: School }) {
  const active = LENDERS.filter(l => school[l.key as keyof School] === true);

  if (active.length === 0) return null;

  return (
    <section className="scroll-mt-20">
      <h2 className="text-2xl font-bold text-foreground mb-6">Financing Options Accepted</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {active.map(l => (
          <div key={l.key} className="border rounded-xl p-4 bg-card flex flex-col items-center text-center gap-2">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
              {l.name.charAt(0)}
            </div>
            <p className="font-semibold text-foreground text-sm">{l.name}</p>
            <span className="text-xs text-accent flex items-center gap-1 cursor-pointer hover:underline">
              Get Quote <ExternalLink className="w-3 h-3" />
            </span>
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mt-3">AviatorPath may earn a referral fee.</p>
    </section>
  );
}
