import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
      });
      if (error) {
        toast.error(error.message);
      } else {
        setSent(true);
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-start justify-center px-4 pt-8 md:pt-20 pb-12">
      <div className="w-full max-w-md bg-card rounded-xl border border-border shadow-sm p-8">
        <div className="text-center mb-6">
          <a href="/" className="inline-flex items-center gap-1 text-xl font-bold">
            <span className="text-gold">✈</span>
            <span className="text-navy">Aviator Path</span>
          </a>
        </div>

        {sent ? (
          <div className="text-center">
            <h1 className="text-2xl font-bold text-navy mb-4">Check your email</h1>
            <p className="text-muted-foreground mb-6">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <Link to="/login" className="text-sm text-sky hover:underline">
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-navy text-center mb-2">Reset your password</h1>
            <p className="text-muted-foreground text-center mb-8 text-sm">
              We'll send you a reset link
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Email address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gold text-gold-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-70"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <p className="text-center text-sm text-muted-foreground mt-6">
              <Link to="/login" className="text-sky hover:underline">Back to sign in</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
