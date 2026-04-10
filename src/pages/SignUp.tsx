import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

const pilotStages = [
  { value: "researching", label: "Researching flight training (0 hours)" },
  { value: "student", label: "Student pilot (< 40 hours)" },
  { value: "ppl", label: "PPL holder" },
  { value: "instrument", label: "Instrument rated" },
  { value: "commercial", label: "Commercial pilot" },
  { value: "cfi", label: "CFI / Flight Instructor" },
  { value: "regional", label: "Regional airline pilot" },
  { value: "major", label: "Major airline pilot" },
  { value: "other", label: "Flight school or employer" },
];

function getPasswordStrength(pw: string): { label: string; color: string; width: string } {
  if (pw.length < 6) return { label: "Weak", color: "bg-destructive", width: "w-1/4" };
  const hasUpper = /[A-Z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  const hasSpecial = /[^A-Za-z0-9]/.test(pw);
  const score = [pw.length >= 8, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;
  if (score <= 1) return { label: "Weak", color: "bg-destructive", width: "w-1/4" };
  if (score === 2) return { label: "Fair", color: "bg-gold", width: "w-1/2" };
  return { label: "Strong", color: "bg-green-500", width: "w-full" };
}

export default function SignUpPage() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [pilotStage, setPilotStage] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreed) { toast.error("Please agree to the Terms of Service."); return; }
    if (password.length < 6) { toast.error("Password must be at least 6 characters."); return; }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: `${firstName} ${lastName}`.trim(),
            first_name: firstName,
            last_name: lastName,
            pilot_stage: pilotStage || undefined,
          },
        },
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Account created! Check your email to verify.");
        navigate("/login");
      }
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed.");
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-start justify-center px-4 pt-8 md:pt-20 pb-12">
      <div className="w-full max-w-md bg-card rounded-xl border border-border shadow-sm p-8">
        {/* Logo */}
        <div className="text-center mb-6">
          <a href="/" className="inline-flex items-center gap-1 text-xl font-bold">
            <span className="text-gold">✈</span>
            <span className="text-navy">Aviator Path</span>
          </a>
        </div>

        <h1 className="text-2xl font-bold text-navy text-center mb-1">Start your aviation journey</h1>
        <p className="text-muted-foreground text-center mb-8 text-sm">Free forever. No credit card required.</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">First Name</label>
              <input
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Last Name</label>
              <input
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Email */}
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

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">Password</label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-10 px-3 pr-10 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {password.length > 0 && (
              <div className="mt-2">
                <div className="h-1 rounded-full bg-muted overflow-hidden">
                  <div className={`h-full ${strength.color} ${strength.width} transition-all`} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">{strength.label}</p>
              </div>
            )}
          </div>

          {/* Pilot stage */}
          <div>
            <label className="text-sm font-medium text-foreground mb-1 block">I'm currently:</label>
            <select
              value={pilotStage}
              onChange={(e) => setPilotStage(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-ring appearance-none"
            >
              <option value="">Select your stage...</option>
              {pilotStages.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
          </div>

          {/* Terms */}
          <label className="flex items-start gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-input accent-gold"
            />
            <span className="text-sm text-muted-foreground">
              I agree to the{" "}
              <a href="/terms" className="text-sky underline">Terms of Service</a>{" "}
              and{" "}
              <a href="/privacy" className="text-sky underline">Privacy Policy</a>
            </span>
          </label>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-gold text-gold-foreground font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-70"
          >
            {loading ? "Creating account..." : "Create Free Account"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-border" />
          <span className="text-sm text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Google */}
        <button
          onClick={handleGoogle}
          className="w-full h-12 border border-border rounded-lg font-medium text-sm text-foreground flex items-center justify-center gap-2 hover:bg-muted transition-colors"
        >
          <svg viewBox="0 0 24 24" width="18" height="18">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-sky font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
