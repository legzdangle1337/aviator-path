import type { Tables } from "@/integrations/supabase/types";

type Program = Tables<"cadet_programs">;

interface Step {
  title: string;
  detail: string;
}

export function ProgramSteps({ program }: { program: Program }) {
  const steps: Step[] = (() => {
    try {
      const raw = program.steps_json;
      if (Array.isArray(raw)) return raw as unknown as Step[];
      if (typeof raw === "string") return JSON.parse(raw) as Step[];
      return [];
    } catch {
      return [];
    }
  })();

  if (steps.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold text-foreground mb-6">Step-by-Step Process</h2>
      <div className="space-y-0">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-4">
            {/* Timeline line */}
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold flex-shrink-0">
                {i + 1}
              </div>
              {i < steps.length - 1 && <div className="w-0.5 flex-1 bg-border my-1" />}
            </div>
            <div className="pb-8">
              <h3 className="font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{step.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
