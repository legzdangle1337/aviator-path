import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export function EmailCapture() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from("subscribers")
        .insert({ email: email.trim(), source: "homepage" });

      if (error) {
        if (error.code === "23505") {
          toast.info("You're already subscribed.");
        } else {
          toast.error("Something went wrong. Please try again.");
        }
      } else {
        toast.success("You're on the list! We'll be in touch.");
        setEmail("");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="py-16 px-4"
      style={{
        background: "linear-gradient(135deg, #F5A623 0%, #e8950f 50%, #d4850a 100%)",
      }}
    >
      <div className="max-w-lg mx-auto text-center">
        <h2 className="text-2xl md:text-[32px] font-bold text-primary-foreground mb-4">
          Stay Ahead of Pilot Hiring
        </h2>
        <p className="text-primary-foreground/90 mb-8 max-w-[500px] mx-auto">
          Get weekly updates: new pilot jobs, scholarship deadlines, hiring news, and school spotlights.
          Free, always.
        </p>

        <form onSubmit={handleSubmit} className="flex max-w-[400px] mx-auto">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="flex-1 px-4 py-3 rounded-l-lg text-sm text-foreground bg-background border-0 outline-none"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-navy text-navy-foreground font-semibold px-6 py-3 rounded-r-lg hover:opacity-90 transition-opacity disabled:opacity-70"
          >
            {loading ? "..." : "Subscribe Free"}
          </button>
        </form>

        <p className="text-primary-foreground/80 text-sm mt-3">
          No spam. Unsubscribe anytime. We never sell your email.
        </p>
      </div>
    </section>
  );
}
