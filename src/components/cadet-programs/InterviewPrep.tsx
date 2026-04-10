import { MessageCircle, Clock, AlertTriangle } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Program = Tables<"cadet_programs">;

export function InterviewPrep({ program }: { program: Program }) {
  const questions = program.interview_questions || [];
  const process = program.interview_process;

  if (!process && questions.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold text-foreground mb-6">Interview Prep — What to Expect</h2>

      {process && (
        <div className="border border-border rounded-xl p-6 bg-card mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Clock className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Interview Process</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{process}</p>
        </div>
      )}

      {questions.length > 0 && (
        <div className="border border-border rounded-xl p-6 bg-card mb-6">
          <div className="flex items-center gap-2 mb-4">
            <MessageCircle className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Community-Reported Interview Questions</h3>
          </div>
          <ul className="space-y-2">
            {questions.map((q, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                <span className="text-primary font-bold">{i + 1}.</span> {q}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/50 rounded-lg p-3">
        <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <p>Interview questions and processes are community-reported and may change. Always verify current information directly with the program.</p>
      </div>
    </section>
  );
}
