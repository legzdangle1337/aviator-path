import { Link, useNavigate } from "react-router-dom";
import { Star, MapPin, Scale, Check, Heart, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompare } from "@/contexts/CompareContext";
import type { Database } from "@/integrations/supabase/types";

type School = Database["public"]["Tables"]["schools"]["Row"];

const PARTNERSHIP_BADGES: { key: keyof School; label: string }[] = [
  { key: "skywest_elite", label: "SkyWest Elite" },
  { key: "united_aviate", label: "United Aviate" },
  { key: "southwest_d225", label: "SW D225" },
  { key: "delta_propel", label: "Delta Propel" },
  { key: "envoy_cadet", label: "Envoy" },
  { key: "gojet_academy", label: "GoJet" },
  { key: "psa_pathway", label: "PSA" },
  { key: "piedmont_pathway", label: "Piedmont" },
];

function formatCost(min?: number | null, max?: number | null) {
  if (!min && !max) return null;
  const fmt = (n: number) => `$${n.toLocaleString()}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
}

function formatTimeline(min?: number | null, max?: number | null) {
  if (!min && !max) return null;
  if (min && max && min !== max) return `${min}–${max} mo`;
  return `~${max || min} mo`;
}

interface Props {
  school: School;
  isSaved?: boolean;
  onSave?: () => void;
}

export function SchoolCard({ school, isSaved, onSave }: Props) {
  const navigate = useNavigate();
  const { addSchool, removeSchool, isComparing } = useCompare();
  const inCompare = isComparing(school.id);
  const partnerships = PARTNERSHIP_BADGES.filter((p) => school[p.key] === true);
  const cost = formatCost(
    school.true_cost_min ?? school.advertised_cost_min,
    school.true_cost_max ?? school.advertised_cost_max
  );
  const timeline = formatTimeline(school.timeline_months_min, school.timeline_months_max);

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't navigate if clicking buttons
    const target = e.target as HTMLElement;
    if (target.closest("button") || target.closest("a")) return;
    navigate(`/schools/${school.slug}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="group rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md cursor-pointer"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        {/* Left column */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link
              to={`/schools/${school.slug}`}
              className="text-base font-semibold text-foreground hover:text-primary hover:underline transition-colors"
            >
              {school.name}
            </Link>
            {school.editors_pick && (
              <span className="rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
                ⭐ Editor's Pick
              </span>
            )}
            {school.is_featured && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                Featured
              </span>
            )}
          </div>

          <div className="mt-1.5 flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {school.city}, {school.state}
          </div>

          {school.description && (
            <p className="mt-2.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
              {school.description}
            </p>
          )}

          {/* Badges */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {school.part_type && (
              <span className="rounded-md border border-border bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                Part {school.part_type === "both" ? "61 & 141" : school.part_type}
              </span>
            )}
            {partnerships.map((p) => (
              <span
                key={p.key as string}
                className="rounded-md border border-primary/20 bg-primary/5 px-2 py-0.5 text-xs font-medium text-primary"
              >
                {p.label}
              </span>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-row items-end justify-between gap-3 sm:flex-col sm:items-end sm:justify-start">
          {school.aviatorpath_rating != null && Number(school.aviatorpath_rating) > 0 && (
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-semibold text-foreground">
                {Number(school.aviatorpath_rating).toFixed(1)}
              </span>
              {school.aviatorpath_review_count != null && school.aviatorpath_review_count > 0 && (
                <span className="text-xs text-muted-foreground">
                  ({school.aviatorpath_review_count})
                </span>
              )}
            </div>
          )}

          {cost && <p className="text-sm font-medium text-foreground">{cost}</p>}

          {timeline && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>{timeline} (0 → CFII)</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button
              variant={inCompare ? "secondary" : "outline"}
              size="sm"
              onClick={() => (inCompare ? removeSchool(school.id) : addSchool(school))}
              className="gap-1"
            >
              {inCompare ? (
                <><Check className="h-3.5 w-3.5" /> Comparing</>
              ) : (
                <><Scale className="h-3.5 w-3.5" /> Compare</>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => { e.stopPropagation(); onSave?.(); }}
              className={isSaved ? "text-accent border-accent" : ""}
            >
              <Heart className={`h-3.5 w-3.5 ${isSaved ? "fill-current" : ""}`} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SchoolCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 animate-pulse">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1 space-y-3">
          <div className="h-5 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/3" />
          <div className="h-4 bg-muted rounded w-full" />
          <div className="flex gap-1.5">
            <div className="h-5 bg-muted rounded-md w-16" />
            <div className="h-5 bg-muted rounded-md w-20" />
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="h-4 bg-muted rounded w-16" />
          <div className="h-4 bg-muted rounded w-24" />
          <div className="flex gap-2">
            <div className="h-8 bg-muted rounded w-20" />
            <div className="h-8 bg-muted rounded w-10" />
          </div>
        </div>
      </div>
    </div>
  );
}
