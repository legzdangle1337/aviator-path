import { useParams, Link } from "react-router-dom";
import { Calendar, ExternalLink, ArrowLeft, Clock, Award, Users, BookOpen, Bookmark } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useScholarship } from "@/hooks/useScholarships";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";

function formatAmount(min: number | null, max: number | null) {
  if (!min && !max) return "Varies";
  if (min === max && max) return `$${max.toLocaleString()}`;
  if (min && max) return `$${min.toLocaleString()} – $${max.toLocaleString()}`;
  return max ? `Up to $${max.toLocaleString()}` : "";
}

export default function ScholarshipDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: scholarship, isLoading } = useScholarship(slug || "");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  // Related scholarships
  const { data: related } = useQuery({
    queryKey: ["related-scholarships", slug],
    queryFn: async () => {
      if (!scholarship) return [];
      const { data } = await supabase
        .from("scholarships")
        .select("*")
        .neq("slug", slug!)
        .limit(3);
      return data ?? [];
    },
    enabled: !!scholarship,
  });

  const { data: savedIds } = useQuery({
    queryKey: ["saved_scholarships", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase.from("saved_scholarships").select("scholarship_id").eq("user_id", user.id);
      return data?.map((s) => s.scholarship_id) ?? [];
    },
    enabled: !!user,
  });

  const isSaved = savedIds?.includes(scholarship?.id || "");

  const toggleSave = async () => {
    if (!user || !scholarship) {
      toast.error("Sign in to save scholarships");
      return;
    }
    if (isSaved) {
      await supabase.from("saved_scholarships").delete().eq("user_id", user.id).eq("scholarship_id", scholarship.id);
    } else {
      await supabase.from("saved_scholarships").insert({ user_id: user.id, scholarship_id: scholarship.id });
    }
    queryClient.invalidateQueries({ queryKey: ["saved_scholarships"] });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky" />
        </div>
      </div>
    );
  }

  if (!scholarship) {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Scholarship Not Found</h1>
            <Link to="/scholarships" className="text-sky hover:underline">Browse all scholarships</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const daysLeft = scholarship.deadline
    ? Math.ceil((new Date(scholarship.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;
  const isUrgent = daysLeft !== null && daysLeft <= 14 && daysLeft >= 0;

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Helmet>
        <title>{scholarship.name} | Aviator Path</title>
        <meta name="description" content={scholarship.description || `${scholarship.name} from ${scholarship.organization}`} />
      </Helmet>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 flex-1 w-full">
        {/* Breadcrumb */}
        <div className="text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">›</span>
          <Link to="/scholarships" className="hover:text-foreground">Scholarships</Link>
          <span className="mx-2">›</span>
          <span className="text-foreground">{scholarship.name}</span>
        </div>

        <Link to="/scholarships" className="inline-flex items-center gap-1.5 text-sm text-sky hover:underline mb-6">
          <ArrowLeft size={14} /> Back to all scholarships
        </Link>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column */}
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="bg-background rounded-xl border border-border p-6 mb-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center text-2xl font-bold text-muted-foreground flex-shrink-0">
                  {scholarship.organization?.charAt(0) || "S"}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">{scholarship.organization}</p>
                  <h1 className="text-2xl md:text-3xl font-bold text-navy">{scholarship.name}</h1>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="text-2xl font-bold text-gold">{formatAmount(scholarship.amount_min, scholarship.amount_max)}</span>
                {scholarship.is_renewable && (
                  <span className="text-xs font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full uppercase">Renewable</span>
                )}
                {scholarship.difficulty_level && (
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase ${
                    scholarship.difficulty_level === "easy" ? "bg-emerald-50 text-emerald-700" :
                    scholarship.difficulty_level === "moderate" ? "bg-amber-50 text-amber-700" :
                    "bg-red-50 text-red-700"
                  }`}>
                    {scholarship.difficulty_level}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-4">
                {scholarship.application_url && (
                  <a
                    href={scholarship.application_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-gold text-gold-foreground font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Apply Now <ExternalLink size={16} />
                  </a>
                )}
                <button
                  onClick={toggleSave}
                  className="flex items-center gap-2 border border-border px-4 py-3 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                >
                  <Bookmark size={16} className={isSaved ? "fill-gold text-gold" : ""} />
                  {isSaved ? "Saved" : "Save"}
                </button>
              </div>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-background rounded-xl border border-border p-4 text-center">
                <Award size={20} className="mx-auto text-gold mb-1" />
                <p className="text-xs text-muted-foreground">Award</p>
                <p className="font-bold text-foreground">{formatAmount(scholarship.amount_min, scholarship.amount_max)}</p>
              </div>
              <div className="bg-background rounded-xl border border-border p-4 text-center">
                <Calendar size={20} className="mx-auto text-sky mb-1" />
                <p className="text-xs text-muted-foreground">Deadline</p>
                <p className={`font-bold ${isUrgent ? "text-destructive" : "text-foreground"}`}>
                  {scholarship.deadline ? new Date(scholarship.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "Rolling"}
                </p>
              </div>
              <div className="bg-background rounded-xl border border-border p-4 text-center">
                <Users size={20} className="mx-auto text-emerald-600 mb-1" />
                <p className="text-xs text-muted-foreground">Past Awards</p>
                <p className="font-bold text-foreground">{scholarship.past_award_count ?? "N/A"}</p>
              </div>
              <div className="bg-background rounded-xl border border-border p-4 text-center">
                <Clock size={20} className="mx-auto text-amber-600 mb-1" />
                <p className="text-xs text-muted-foreground">Announced</p>
                <p className="font-bold text-foreground text-sm">{scholarship.award_announcement_date || "TBD"}</p>
              </div>
            </div>

            {/* Description */}
            <div className="bg-background rounded-xl border border-border p-6 mb-6">
              <h2 className="text-lg font-bold text-navy mb-3">About This Scholarship</h2>
              <p className="text-foreground/80 leading-relaxed whitespace-pre-line">
                {scholarship.long_description || scholarship.description}
              </p>
              {scholarship.renewable_details && (
                <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <p className="text-sm text-emerald-800"><strong>Renewable:</strong> {scholarship.renewable_details}</p>
                </div>
              )}
            </div>

            {/* Eligibility */}
            <div className="bg-background rounded-xl border border-border p-6 mb-6">
              <h2 className="text-lg font-bold text-navy mb-3">Eligibility</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {scholarship.eligible_stages && scholarship.eligible_stages.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">Pilot Stage</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {scholarship.eligible_stages.map((s) => (
                        <span key={s} className="text-xs bg-sky/10 text-sky px-2.5 py-1 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                {scholarship.eligible_demographics && scholarship.eligible_demographics.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">Demographics</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {scholarship.eligible_demographics.map((d) => (
                        <span key={d} className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full">{d}</span>
                      ))}
                    </div>
                  </div>
                )}
                {scholarship.eligible_states && scholarship.eligible_states.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-foreground mb-2">State Restrictions</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {scholarship.eligible_states.map((s) => (
                        <span key={s} className="text-xs bg-muted text-foreground px-2.5 py-1 rounded-full">{s}</span>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-semibold text-foreground mb-2">Requirements</h3>
                  <ul className="text-sm text-foreground/80 space-y-1">
                    {scholarship.minimum_gpa && <li>• Minimum GPA: {scholarship.minimum_gpa}</li>}
                    {scholarship.minimum_hours !== null && scholarship.minimum_hours !== undefined && <li>• Minimum flight hours: {scholarship.minimum_hours}</li>}
                    {scholarship.maximum_hours !== null && scholarship.maximum_hours !== undefined && <li>• Maximum flight hours: {scholarship.maximum_hours}</li>}
                    {!scholarship.minimum_gpa && scholarship.minimum_hours === null && <li>• See application for full requirements</li>}
                  </ul>
                </div>
              </div>
            </div>

            {/* Tips */}
            {scholarship.tips && (
              <div className="bg-background rounded-xl border border-border p-6 mb-6">
                <h2 className="text-lg font-bold text-navy mb-3 flex items-center gap-2">
                  <BookOpen size={20} /> Application Tips
                </h2>
                <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{scholarship.tips}</p>
              </div>
            )}

            {/* Apply CTA */}
            {scholarship.application_url && (
              <div className="bg-navy rounded-xl p-6 text-center mb-6">
                <h2 className="text-xl font-bold text-navy-foreground mb-2">Ready to Apply?</h2>
                <p className="text-navy-foreground/70 mb-4">
                  {daysLeft !== null && daysLeft >= 0 ? `${daysLeft} days remaining before the deadline` : "Rolling applications accepted"}
                </p>
                <a
                  href={scholarship.application_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gold text-gold-foreground font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity"
                >
                  Apply Now <ExternalLink size={16} />
                </a>
              </div>
            )}
          </div>

          {/* Right column */}
          <div className="w-full lg:w-[340px] flex-shrink-0 space-y-6">
            {/* Deadline card */}
            {scholarship.deadline && (
              <div className={`rounded-xl border p-5 ${isUrgent ? "bg-red-50 border-red-200" : "bg-background border-border"}`}>
                <h3 className="font-semibold text-foreground mb-2">Deadline</h3>
                <p className={`text-2xl font-bold ${isUrgent ? "text-destructive" : "text-foreground"}`}>
                  {new Date(scholarship.deadline).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
                {daysLeft !== null && daysLeft >= 0 && (
                  <p className={`text-sm mt-1 ${isUrgent ? "text-destructive font-semibold" : "text-muted-foreground"}`}>
                    {isUrgent && "⚠️ "}{daysLeft} days remaining
                  </p>
                )}
              </div>
            )}

            {/* Categories */}
            {scholarship.categories && scholarship.categories.length > 0 && (
              <div className="bg-background rounded-xl border border-border p-5">
                <h3 className="font-semibold text-foreground mb-2">Categories</h3>
                <div className="flex flex-wrap gap-1.5">
                  {scholarship.categories.map((c) => (
                    <span key={c} className="text-xs bg-muted text-foreground px-2.5 py-1 rounded-full">{c}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Related scholarships */}
            {related && related.length > 0 && (
              <div className="bg-background rounded-xl border border-border p-5">
                <h3 className="font-semibold text-foreground mb-3">Related Scholarships</h3>
                <div className="space-y-3">
                  {related.map((r) => (
                    <Link key={r.id} to={`/scholarships/${r.slug}`} className="block p-3 rounded-lg border border-border hover:border-sky/40 transition-colors">
                      <p className="text-xs text-muted-foreground">{r.organization}</p>
                      <p className="text-sm font-semibold text-navy">{r.name}</p>
                      <p className="text-sm font-bold text-gold mt-1">{formatAmount(r.amount_min, r.amount_max)}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
