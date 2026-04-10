import { useState } from "react";
import { useProgramExperiences } from "@/hooks/useCadetPrograms";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import type { Tables } from "@/integrations/supabase/types";

type Program = Tables<"cadet_programs">;

function OutcomeBadge({ outcome }: { outcome: string }) {
  const cls = outcome === "accepted"
    ? "bg-green-100 text-green-800"
    : outcome === "waitlisted"
    ? "bg-amber-100 text-amber-800"
    : "bg-red-100 text-red-800";
  return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold uppercase ${cls}`}>{outcome}</span>;
}

export function ProgramExperiences({ program }: { program: Program }) {
  const { data: experiences = [] } = useProgramExperiences(program.id);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ year: new Date().getFullYear(), outcome: "accepted", text: "" });

  const handleSubmit = async () => {
    if (!user) return;
    if (!form.text.trim()) { toast.error("Please share your experience"); return; }
    setSubmitting(true);
    const { error } = await supabase.from("cadet_program_experiences").insert({
      program_id: program.id,
      user_id: user.id,
      year: form.year,
      outcome: form.outcome,
      experience_text: form.text,
      username: user.email?.split("@")[0] || "Anonymous",
    });
    setSubmitting(false);
    if (error) { toast.error("Failed to submit"); return; }
    toast.success("Experience shared!");
    setForm({ year: new Date().getFullYear(), outcome: "accepted", text: "" });
    setShowForm(false);
    queryClient.invalidateQueries({ queryKey: ["cadet_program_experiences", program.id] });
  };

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">Pilot Experiences</h2>
        {user ? (
          <Button variant="outline" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "Share Your Experience"}
          </Button>
        ) : (
          <Button variant="outline" asChild>
            <a href="/login">Sign in to share</a>
          </Button>
        )}
      </div>

      {showForm && (
        <div className="border border-border rounded-xl p-6 bg-card mb-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Year</label>
              <input
                type="number"
                value={form.year}
                onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
                className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm"
                min={2015}
                max={2030}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Outcome</label>
              <select
                value={form.outcome}
                onChange={(e) => setForm({ ...form, outcome: e.target.value })}
                className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm"
              >
                <option value="accepted">Accepted</option>
                <option value="waitlisted">Waitlisted</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Your Experience</label>
            <textarea
              value={form.text}
              onChange={(e) => setForm({ ...form, text: e.target.value })}
              className="w-full min-h-[120px] px-3 py-2 rounded-lg border border-input bg-background text-sm"
              placeholder="Share what the process was like, tips for other applicants, timeline..."
            />
          </div>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Experience"}
          </Button>
        </div>
      )}

      {experiences.length > 0 ? (
        <div className="space-y-4">
          {experiences.map((e) => (
            <div key={e.id} className="border border-border rounded-xl p-5 bg-card">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-medium text-foreground text-sm">{e.username || "Anonymous"}</span>
                {e.year && <span className="text-xs text-muted-foreground">{e.year}</span>}
                <OutcomeBadge outcome={e.outcome} />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{e.experience_text}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm border border-border rounded-xl p-6 bg-card text-center">
          No experiences shared yet. Be the first to share your story!
        </p>
      )}
    </section>
  );
}
