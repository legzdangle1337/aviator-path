import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Bookmark, Check, Clock, Copy, ExternalLink, MapPin, Star, X as XIcon } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useJob, useJobs } from "@/hooks/useJobs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import { format, formatDistanceToNow } from "date-fns";
import type { Database } from "@/integrations/supabase/types";

type Job = Database["public"]["Tables"]["jobs"]["Row"];

const JOB_TYPE_LABELS: Record<string, string> = {
  major_airline: "Major Airline",
  regional_airline: "Regional Airline",
  cfi: "CFI / Instructor",
  charter: "Charter / Part 135",
  cargo: "Cargo",
  corporate: "Corporate",
  military: "Military",
  government: "Government",
};

function RequirementRow({ label, required, userVal }: { label: string; required: number | null; userVal?: number | null }) {
  if (required == null) return null;
  const meets = userVal != null && userVal >= required;
  const showCheck = userVal != null;
  return (
    <div className="flex items-center justify-between py-2 border-b border-border last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-foreground">{required.toLocaleString()}</span>
        {showCheck && (
          meets ? (
            <Check className="h-4 w-4 text-emerald-500" />
          ) : (
            <XIcon className="h-4 w-4 text-destructive" />
          )
        )}
      </div>
    </div>
  );
}

function CompanyInitials({ name }: { name: string }) {
  const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return (
    <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center text-xl font-bold text-muted-foreground">
      {initials}
    </div>
  );
}

export default function JobDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: job, isLoading } = useJob(slug ?? "");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile } = useQuery({
    queryKey: ["profile-detail", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      return data;
    },
    enabled: !!user,
  });

  const { data: savedJobIds } = useQuery({
    queryKey: ["saved_jobs", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase.from("saved_jobs").select("job_id").eq("user_id", user.id);
      return data?.map((s) => s.job_id) ?? [];
    },
    enabled: !!user,
  });

  // Track view
  useEffect(() => {
    if (job?.id) {
      supabase.from("jobs").update({ view_count: (job.view_count ?? 0) + 1 }).eq("id", job.id).then();
    }
  }, [job?.id]);

  // Similar jobs
  const { data: similarData } = useJobs(
    { jobTypes: job?.job_type ? [job.job_type] : [], hoursRange: "any", state: "", postedWithin: "any", showSalary: false, salaryMin: 0, salaryMax: 300000, qualifyOnly: false, sort: "newest", page: 1 },
    null
  );
  const similarJobs = similarData?.jobs.filter((j) => j.id !== job?.id).slice(0, 3) ?? [];

  const isSaved = savedJobIds?.includes(job?.id ?? "");

  const toggleSave = async () => {
    if (!user) {
      toast.error("Sign in to save jobs");
      return;
    }
    if (!job) return;
    if (isSaved) {
      await supabase.from("saved_jobs").delete().eq("user_id", user.id).eq("job_id", job.id);
    } else {
      await supabase.from("saved_jobs").insert({ user_id: user.id, job_id: job.id });
    }
    queryClient.invalidateQueries({ queryKey: ["saved_jobs"] });
  };

  const handleApply = async () => {
    if (!job) return;
    // Track click
    supabase.from("jobs").update({ apply_click_count: (job.apply_click_count ?? 0) + 1 }).eq("id", job.id).then();
    window.open(job.application_url, "_blank");
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Link copied!");
  };

  // Qualification check
  const qualifications = profile ? (() => {
    const checks: { label: string; meets: boolean; detail: string }[] = [];
    if (job?.min_total_hours) {
      const meets = (profile.total_hours ?? 0) >= job.min_total_hours;
      checks.push({ label: "Total Hours", meets, detail: `${job.min_total_hours.toLocaleString()} required, you have ${(profile.total_hours ?? 0).toLocaleString()}` });
    }
    if (job?.min_pic_hours) {
      const meets = (profile.pic_hours ?? 0) >= job.min_pic_hours;
      checks.push({ label: "PIC Hours", meets, detail: `${job.min_pic_hours.toLocaleString()} required, you have ${(profile.pic_hours ?? 0).toLocaleString()}` });
    }
    if (job?.min_instrument_hours) {
      const meets = ((profile.instrument_hours_actual ?? 0) + (profile.instrument_hours_simulated ?? 0)) >= job.min_instrument_hours;
      checks.push({ label: "Instrument Hours", meets, detail: `${job.min_instrument_hours} required` });
    }
    if (job?.min_night_hours) {
      const meets = (profile.night_hours ?? 0) >= job.min_night_hours;
      checks.push({ label: "Night Hours", meets, detail: `${job.min_night_hours} required` });
    }
    if (job?.min_cross_country_hours) {
      const meets = (profile.cross_country_hours ?? 0) >= job.min_cross_country_hours;
      checks.push({ label: "Cross Country Hours", meets, detail: `${job.min_cross_country_hours} required` });
    }
    if (job?.min_multi_hours) {
      const meets = (profile.multi_engine_hours ?? 0) >= job.min_multi_hours;
      checks.push({ label: "Multi-Engine Hours", meets, detail: `${job.min_multi_hours} required` });
    }
    if (job?.min_turbine_hours) {
      const meets = (profile.turbine_hours ?? 0) >= job.min_turbine_hours;
      checks.push({ label: "Turbine Hours", meets, detail: `${job.min_turbine_hours} required` });
    }
    return checks;
  })() : null;

  const allMet = qualifications?.every((q) => q.meets);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 lg:px-8 py-12 w-full">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-muted rounded w-2/3" />
            <div className="h-5 bg-muted rounded w-1/3" />
            <div className="h-40 bg-muted rounded-xl" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-surface flex flex-col">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Job not found</h1>
          <Link to="/jobs" className="text-sky hover:underline">← Back to Jobs</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Helmet>
        <title>{`${job.job_title} at ${job.company_name} | Aviator Path`}</title>
        <meta name="description" content={job.description?.slice(0, 155) || `${job.job_title} position at ${job.company_name}. Apply now on Aviator Path.`} />
        <link rel="canonical" href={`https://aviatorpath.com/jobs/${job.slug}`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://aviatorpath.com/" },
            { "@type": "ListItem", "position": 2, "name": "Jobs", "item": "https://aviatorpath.com/jobs" },
            { "@type": "ListItem", "position": 3, "name": job.job_title, "item": `https://aviatorpath.com/jobs/${job.slug}` }
          ]
        })}</script>
      </Helmet>
      <Navbar />

      <div className="bg-background border-b border-border">
        <div className="max-w-5xl mx-auto px-4 lg:px-8 py-4">
          <Link to="/jobs" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ArrowLeft size={14} /> Back to Jobs
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 lg:px-8 py-8 flex-1 w-full">
        <div className="flex gap-8 flex-col lg:flex-row">
          {/* Left column (2/3) */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-navy">{job.job_title}</h1>
              <div className="flex items-center gap-3 mt-2 text-muted-foreground flex-wrap">
                <span className="font-medium text-foreground">{job.company_name}</span>
                {job.location && (
                  <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                )}
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                {job.posted_date && (
                  <span>Posted {formatDistanceToNow(new Date(job.posted_date), { addSuffix: true })}</span>
                )}
                {job.expires_date && (
                  <span>Expires {format(new Date(job.expires_date), "MMM d, yyyy")}</span>
                )}
                <button onClick={copyLink} className="flex items-center gap-1 text-sky hover:underline">
                  <Copy size={14} /> Share
                </button>
              </div>
            </div>

            {/* Do I Qualify Card */}
            <div className="rounded-xl border-2 border-sky/20 bg-card p-5">
              <h3 className="font-semibold text-foreground mb-3">Do I Qualify?</h3>
              {qualifications ? (
                <>
                  {allMet ? (
                    <div className="flex items-center gap-2 text-emerald-600 font-medium mb-3">
                      <Check size={18} /> You meet all requirements for this position!
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground mb-3">
                      You're missing some requirements:
                    </div>
                  )}
                  <div className="space-y-1">
                    {qualifications.map((q) => (
                      <div key={q.label} className="flex items-center gap-2 text-sm">
                        {q.meets ? (
                          <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                        ) : (
                          <XIcon className="h-4 w-4 text-destructive flex-shrink-0" />
                        )}
                        <span className={q.meets ? "text-foreground" : "text-destructive"}>{q.detail}</span>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <Link to="/login" className="text-sm text-sky hover:underline">
                  Log in with your flight hours to see if you qualify →
                </Link>
              )}
            </div>

            {/* Requirements */}
            <div className="rounded-xl border border-border bg-card p-5">
              <h3 className="font-semibold text-foreground mb-3">Requirements</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                <div>
                  <RequirementRow label="Total Hours" required={job.min_total_hours} userVal={profile?.total_hours} />
                  <RequirementRow label="PIC Hours" required={job.min_pic_hours} userVal={profile?.pic_hours} />
                  <RequirementRow label="Instrument Hours" required={job.min_instrument_hours} userVal={profile ? (profile.instrument_hours_actual ?? 0) + (profile.instrument_hours_simulated ?? 0) : null} />
                  <RequirementRow label="Night Hours" required={job.min_night_hours} userVal={profile?.night_hours} />
                </div>
                <div>
                  <RequirementRow label="Cross Country" required={job.min_cross_country_hours} userVal={profile?.cross_country_hours} />
                  <RequirementRow label="Multi-Engine" required={job.min_multi_hours} userVal={profile?.multi_engine_hours} />
                  <RequirementRow label="Turbine Hours" required={job.min_turbine_hours} userVal={profile?.turbine_hours} />
                  {job.required_certificates && job.required_certificates.length > 0 && (
                    <div className="flex items-center justify-between py-2 border-b border-border">
                      <span className="text-sm text-muted-foreground">Certificates</span>
                      <span className="text-sm font-medium text-foreground">{job.required_certificates.join(", ")}</span>
                    </div>
                  )}
                  {job.type_rating_required && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground">Type Rating</span>
                      <span className="text-sm font-medium text-foreground">{job.type_rating_required}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            {job.description && (
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground mb-3">Full Description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{job.description}</p>
              </div>
            )}

            {/* Benefits */}
            {job.benefits && (
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground mb-3">Benefits</h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{job.benefits}</p>
              </div>
            )}

            {/* Requirements text */}
            {job.requirements && (
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground mb-3">How To Apply</h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{job.requirements}</p>
              </div>
            )}

            {/* Apply button */}
            <Button onClick={handleApply} className="w-full bg-gold text-gold-foreground hover:opacity-90 h-12 text-base font-semibold gap-2">
              Apply Now <ExternalLink size={16} />
            </Button>
          </div>

          {/* Right column (1/3) */}
          <div className="w-full lg:w-[320px] flex-shrink-0 space-y-6">
            {/* Company Card */}
            <div className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-center gap-3 mb-4">
                {job.company_logo_url ? (
                  <img src={job.company_logo_url} alt={job.company_name} className="w-16 h-16 rounded-xl object-contain border border-border" />
                ) : (
                  <CompanyInitials name={job.company_name} />
                )}
                <div>
                  <h3 className="font-semibold text-foreground">{job.company_name}</h3>
                  {job.company_website && (
                    <a href={job.company_website} target="_blank" rel="noopener noreferrer" className="text-sm text-sky hover:underline flex items-center gap-1">
                      Website <ExternalLink size={12} />
                    </a>
                  )}
                </div>
              </div>

              {(job.glassdoor_rating || job.apc_qol_rating) && (
                <div className="space-y-2 mb-4">
                  {job.glassdoor_rating && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Glassdoor</span>
                      <span className="flex items-center gap-1 font-medium">
                        <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                        {Number(job.glassdoor_rating).toFixed(1)}
                      </span>
                    </div>
                  )}
                  {job.apc_qol_rating && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">APC QOL Rating</span>
                      <span className="font-medium">{Number(job.apc_qol_rating).toFixed(1)}/10</span>
                    </div>
                  )}
                </div>
              )}

              {job.company_description && (
                <p className="text-sm text-muted-foreground leading-relaxed">{job.company_description}</p>
              )}
            </div>

            {/* Salary card */}
            {job.salary_min && (
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground mb-2">Compensation</h3>
                <p className="text-lg font-bold text-emerald-700">
                  ${job.salary_min.toLocaleString()}{job.salary_max ? ` – $${job.salary_max.toLocaleString()}` : "+"}{job.salary_type === "annual" ? "/yr" : ""}
                </p>
                {job.signing_bonus != null && job.signing_bonus > 0 && (
                  <p className="text-sm text-accent font-medium mt-1">+${job.signing_bonus.toLocaleString()} sign-on bonus</p>
                )}
                {job.tuition_reimbursement != null && job.tuition_reimbursement > 0 && (
                  <p className="text-sm text-sky font-medium mt-1">${job.tuition_reimbursement.toLocaleString()} tuition reimbursement</p>
                )}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button onClick={handleApply} className="flex-1 bg-gold text-gold-foreground hover:opacity-90 gap-2">
                Apply Now <ExternalLink size={14} />
              </Button>
              <Button variant="outline" onClick={toggleSave} className={isSaved ? "text-accent border-accent" : ""}>
                <Bookmark className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
              </Button>
            </div>

            {/* Similar Jobs */}
            {similarJobs.length > 0 && (
              <div className="rounded-xl border border-border bg-card p-5">
                <h3 className="font-semibold text-foreground mb-3">Similar Jobs</h3>
                <div className="space-y-3">
                  {similarJobs.map((sj) => (
                    <Link
                      key={sj.id}
                      to={`/jobs/${sj.slug}`}
                      className="block p-3 rounded-lg border border-border hover:border-sky/30 hover:bg-muted/50 transition-colors"
                    >
                      <p className="text-sm font-medium text-foreground">{sj.job_title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{sj.company_name} • {sj.location}</p>
                      {sj.salary_min && (
                        <p className="text-xs font-medium text-emerald-700 mt-1">
                          ${sj.salary_min.toLocaleString()}{sj.salary_max ? `–$${sj.salary_max.toLocaleString()}` : "+"}
                        </p>
                      )}
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
