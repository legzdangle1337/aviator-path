import { Link } from "react-router-dom";
import { Calendar, Bookmark, ExternalLink } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

interface Props {
  scholarship: Tables<"scholarships">;
  isSaved?: boolean;
  onSave?: () => void;
  featured?: boolean;
}

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatAmount(min: number | null, max: number | null) {
  if (!min && !max) return "Varies";
  if (min === max) return `$${(max! / 1000).toFixed(0)}K`.replace("$0K", `$${max!.toLocaleString()}`);
  if (min && max) {
    if (max >= 1000) return `$${(min / 1000).toFixed(0)}K – $${(max / 1000).toFixed(0)}K`;
    return `$${min.toLocaleString()} – $${max.toLocaleString()}`;
  }
  return max ? `Up to $${max >= 1000 ? `${(max / 1000).toFixed(0)}K` : max.toLocaleString()}` : "";
}

export function ScholarshipCard({ scholarship, isSaved, onSave, featured }: Props) {
  const days = daysUntil(scholarship.deadline);
  const isUrgent = days !== null && days <= 14 && days >= 0;
  const isExpired = days !== null && days < 0;

  return (
    <div className={`relative bg-background rounded-xl border ${featured ? "border-gold/50 ring-1 ring-gold/20" : "border-border"} p-5 hover:border-sky/40 transition-colors`}>
      {featured && (
        <div className="absolute top-3 right-3 bg-gold/10 text-gold text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
          Featured
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Logo placeholder */}
        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-lg font-bold text-muted-foreground flex-shrink-0">
          {scholarship.organization?.charAt(0) || "S"}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground mb-0.5">{scholarship.organization}</p>
          <Link to={`/scholarships/${scholarship.slug}`} className="text-base font-semibold text-navy hover:text-sky transition-colors line-clamp-1">
            {scholarship.name}
          </Link>

          {/* Amount */}
          <p className="text-gold font-bold text-lg mt-1">
            {formatAmount(scholarship.amount_min, scholarship.amount_max)}
          </p>

          {/* Badges */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {scholarship.is_renewable && (
              <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full uppercase">Renewable</span>
            )}
            {scholarship.difficulty_level && (
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                scholarship.difficulty_level === "easy" ? "bg-emerald-50 text-emerald-700" :
                scholarship.difficulty_level === "moderate" ? "bg-amber-50 text-amber-700" :
                "bg-red-50 text-red-700"
              }`}>
                {scholarship.difficulty_level}
              </span>
            )}
            {scholarship.is_rolling && (
              <span className="text-[10px] font-semibold bg-sky/10 text-sky px-2 py-0.5 rounded-full uppercase">Rolling</span>
            )}
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{scholarship.description}</p>

          {/* Deadline */}
          <div className="flex items-center gap-4 mt-3">
            {scholarship.deadline ? (
              <div className={`flex items-center gap-1.5 text-sm ${isUrgent ? "text-destructive font-semibold" : isExpired ? "text-muted-foreground line-through" : "text-foreground/70"}`}>
                <Calendar size={14} />
                <span>
                  {isExpired ? "Expired" : `Closes ${new Date(scholarship.deadline).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
                </span>
                {days !== null && days >= 0 && (
                  <span className={`ml-1 ${isUrgent ? "text-destructive" : "text-muted-foreground"}`}>
                    {isUrgent && "⚠️ "}{days} days left
                  </span>
                )}
              </div>
            ) : (
              <span className="text-sm text-sky">Rolling deadline</span>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
        {scholarship.application_url && (
          <a
            href={scholarship.application_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-gold text-gold-foreground font-semibold text-sm px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
          >
            Apply Now <ExternalLink size={14} />
          </a>
        )}
        <Link
          to={`/scholarships/${scholarship.slug}`}
          className="text-sm font-medium text-navy border border-navy/20 px-4 py-2 rounded-lg hover:bg-navy/5 transition-colors"
        >
          Details
        </Link>
        {onSave && (
          <button onClick={onSave} className="ml-auto p-2 text-muted-foreground hover:text-gold transition-colors">
            <Bookmark size={18} className={isSaved ? "fill-gold text-gold" : ""} />
          </button>
        )}
      </div>
    </div>
  );
}

export function ScholarshipCardSkeleton() {
  return (
    <div className="bg-background rounded-xl border border-border p-5 animate-pulse">
      <div className="flex gap-4">
        <div className="w-12 h-12 rounded-lg bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-muted rounded w-24" />
          <div className="h-4 bg-muted rounded w-48" />
          <div className="h-5 bg-muted rounded w-20" />
          <div className="h-3 bg-muted rounded w-full" />
        </div>
      </div>
    </div>
  );
}
