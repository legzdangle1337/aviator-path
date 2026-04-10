import { Link, useNavigate } from "react-router-dom";
import { Bookmark, Clock, ExternalLink, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Database } from "@/integrations/supabase/types";
import { formatDistanceToNow, differenceInHours, differenceInDays } from "date-fns";

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
  ferry: "Ferry",
  survey: "Survey",
  other: "Other",
};

function CompanyInitials({ name }: { name: string }) {
  const initials = name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return (
    <div className="w-14 h-14 rounded-lg bg-muted flex items-center justify-center text-lg font-bold text-muted-foreground flex-shrink-0">
      {initials}
    </div>
  );
}

interface Props {
  job: Job;
  isSaved?: boolean;
  onSave?: () => void;
}

export function JobCard({ job, isSaved, onSave }: Props) {
  const navigate = useNavigate();
  const postedDate = job.posted_date ? new Date(job.posted_date) : null;
  const expiresDate = job.expires_date ? new Date(job.expires_date) : null;
  const isNew = postedDate && differenceInHours(new Date(), postedDate) < 48;
  const isExpiring = expiresDate && differenceInDays(expiresDate, new Date()) < 7 && differenceInDays(expiresDate, new Date()) >= 0;

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) return;
    navigate(`/jobs/${job.slug}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group relative rounded-xl border border-border bg-card p-5 transition-all hover:shadow-md hover:border-sky/30 cursor-pointer"
    >
      {/* Featured ribbon */}
      {job.is_featured && (
        <div className="absolute top-3 right-3 bg-gold text-gold-foreground text-[10px] font-bold uppercase px-2 py-0.5 rounded-md">
          Featured
        </div>
      )}

      <div className="flex gap-4">
        {/* Logo */}
        {job.company_logo_url ? (
          <img src={job.company_logo_url} alt={job.company_name} className="w-14 h-14 rounded-lg object-contain flex-shrink-0 border border-border" />
        ) : (
          <CompanyInitials name={job.company_name} />
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  to={`/jobs/${job.slug}`}
                  className="text-base font-semibold text-navy hover:text-primary hover:underline transition-colors"
                >
                  {job.job_title}
                </Link>
                {isNew && (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-emerald-600">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> NEW
                  </span>
                )}
                {isExpiring && (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-amber-600">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" /> EXPIRING
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                <span>{job.company_name}</span>
                {job.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {job.location}
                  </span>
                )}
              </div>
            </div>

            {postedDate && (
              <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                <Clock size={12} />
                {formatDistanceToNow(postedDate, { addSuffix: true })}
              </span>
            )}
          </div>

          {/* Requirement pills */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {job.min_total_hours != null && job.min_total_hours > 0 && (
              <span className="rounded-md bg-accent/10 border border-accent/20 px-2 py-0.5 text-xs font-medium text-accent">
                {job.min_total_hours.toLocaleString()}+ Hours Required
              </span>
            )}
            {job.required_certificates && job.required_certificates.length > 0 && job.required_certificates.map((cert) => (
              <span key={cert} className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {cert} Certificate
              </span>
            ))}
            {job.job_type && (
              <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                {JOB_TYPE_LABELS[job.job_type] || job.job_type}
              </span>
            )}
            {(job as any).conditional_job_offer && (
              <span className="rounded-md bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-xs font-medium text-emerald-700">
                Conditional Offer
              </span>
            )}
          </div>

          {/* Salary + actions */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {job.salary_min != null && (
                <span className="text-sm font-medium text-emerald-700">
                  ${job.salary_min.toLocaleString()}{job.salary_max ? ` – $${job.salary_max.toLocaleString()}` : "+"}{job.salary_type === "annual" ? "/yr" : ""}
                </span>
              )}
              {job.signing_bonus != null && job.signing_bonus > 0 && (
                <span className="text-xs text-accent font-medium">
                  +${job.signing_bonus.toLocaleString()} sign-on
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link to={`/jobs/${job.slug}`}>View Details</Link>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={(e) => { e.stopPropagation(); onSave?.(); }}
                className={isSaved ? "text-accent border-accent" : ""}
              >
                <Bookmark className={`h-3.5 w-3.5 ${isSaved ? "fill-current" : ""}`} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function JobCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 animate-pulse">
      <div className="flex gap-4">
        <div className="w-14 h-14 bg-muted rounded-lg" />
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-muted rounded w-2/3" />
          <div className="h-4 bg-muted rounded w-1/3" />
          <div className="flex gap-2">
            <div className="h-5 bg-muted rounded-md w-28" />
            <div className="h-5 bg-muted rounded-md w-20" />
          </div>
          <div className="flex justify-between">
            <div className="h-4 bg-muted rounded w-32" />
            <div className="flex gap-2">
              <div className="h-8 bg-muted rounded w-24" />
              <div className="h-8 bg-muted rounded w-10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
