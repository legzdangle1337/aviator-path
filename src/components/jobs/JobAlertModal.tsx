import { useState } from "react";
import { X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { JOB_TYPE_OPTIONS } from "@/hooks/useJobFilters";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function JobAlertModal({ open, onClose }: Props) {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email ?? "");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("job_alerts").insert({
        email: email.trim(),
        user_id: user?.id ?? null,
        job_types: selectedTypes.length > 0 ? selectedTypes : null,
      });
      if (error) throw error;
      toast.success("Job alert created! We'll email you when matching jobs are posted.");
      onClose();
    } catch {
      toast.error("Failed to create alert. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/30" onClick={onClose} />
      <div className="relative bg-background rounded-xl shadow-2xl w-full max-w-md mx-4 p-6">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Bell className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Create Job Alert</h3>
            <p className="text-sm text-muted-foreground">Get notified when jobs match your criteria</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-sky/20"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">Job Types (optional)</label>
            <div className="grid grid-cols-2 gap-2">
              {JOB_TYPE_OPTIONS.map((opt) => (
                <label key={opt.value} className="flex items-center gap-2 cursor-pointer text-sm text-foreground/80">
                  <input
                    type="checkbox"
                    checked={selectedTypes.includes(opt.value)}
                    onChange={() => toggleType(opt.value)}
                    className="h-4 w-4 rounded border-input accent-sky"
                  />
                  {opt.label}
                </label>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full bg-gold text-gold-foreground hover:opacity-90">
            {loading ? "Creating..." : "Create Alert"}
          </Button>
        </form>
      </div>
    </div>
  );
}
