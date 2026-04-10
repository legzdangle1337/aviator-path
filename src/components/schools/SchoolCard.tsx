import { MapPin, Star, Heart, Scale } from "lucide-react";
import { useCompare } from "@/contexts/CompareContext";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type School = Database["public"]["Tables"]["schools"]["Row"];

const PARTNERSHIP_BADGES: { key: keyof School; label: string; bg: string; text: string }[] = [
  { key: "skywest_elite", label: "SkyWest", bg: "bg-blue-50", text: "text-blue-800" },
  { key: "united_aviate", label: "Aviate", bg: "bg-indigo-50", text: "text-indigo-800" },
  { key: "southwest_d225", label: "D225", bg: "bg-orange-50", text: "text-orange-800" },
  { key: "delta_propel", label: "Delta", bg: "bg-purple-50", text: "text-purple-800" },
  { key: "envoy_cadet", label: "Envoy", bg: "bg-red-50", text: "text-red-800" },
  { key: "gojet_academy", label: "GoJet", bg: "bg-teal-50", text: "text-teal-800" },
  { key: "psa_pathway", label: "PSA", bg: "bg-emerald-50", text: "text-emerald-800" },
  { key: "piedmont_pathway", label: "Piedmont", bg: "bg-cyan-50", text: "text-cyan-800" },
];

function formatCost(min?: number | null, max?: number | null) {
  if (!min && !max) return null;
  const fmt = (n: number) => `$${Math.round(n / 1000)}K`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
}

interface Props {
  school: School;
  isSaved?: boolean;
  onSave?: () => void;
}

export function SchoolCard({ school, isSaved, onSave }: Props) {
  const partnerships = PARTNERSHIP_BADGES.filter((p) => school[p.key] === true);
  const visiblePartnerships = partnerships.slice(0, 3);
  const extraCount = partnerships.length - 3;
  const cost = formatCost(school.true_cost_min ?? school.advertised_cost_min, school.true_cost_max ?? school.advertised_cost_max);

  return (
    <div className="bg-card rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-border cursor-pointer group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {school.hero_image_url ? (
          <img src={school.hero_image_url} alt={school.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, hsl(var(--sky) / 0.2), hsl(var(--navy) / 0.3))` }}>
            <span className="text-4xl font-bold text-navy/30">
              {school.name.split(" ").map((w) => w[0]).join("").slice(0, 3)}
            </span>
          </div>
        )}

        {school.editors_pick && (
          <span className="absolute top-3 left-0 bg-gold text-gold-foreground text-xs font-semibold px-3 py-1 rounded-r-full">
            ⭐ Editor's Pick
          </span>
        )}
        {school.is_featured && (
          <span className="absolute top-3 right-0 bg-sky text-sky-foreground text-xs font-semibold px-3 py-1 rounded-l-full">
            Featured
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="font-bold text-lg text-navy leading-tight mb-1 line-clamp-1">{school.name}</h3>
        <p className="text-sm text-muted-foreground mb-3 flex items-center gap-1">
          <MapPin size={14} />
          {school.city}, {school.state}
        </p>

        {/* Badges */}
        <div className="flex flex-wrap gap-1 mb-3">
          {school.part_type && (
            <span className="text-xs border border-border rounded-full px-2 py-0.5 text-muted-foreground">
              Part {school.part_type === "both" ? "61/141" : school.part_type}
            </span>
          )}
          {visiblePartnerships.map((p) => (
            <span key={p.key as string} className={`text-xs rounded-full px-2 py-0.5 ${p.bg} ${p.text}`}>
              {p.label}
            </span>
          ))}
          {extraCount > 0 && (
            <span className="text-xs rounded-full px-2 py-0.5 bg-muted text-muted-foreground">+{extraCount} more</span>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mb-4 text-sm">
          {school.aviatorpath_rating != null && Number(school.aviatorpath_rating) > 0 && (
            <span className="flex items-center gap-1">
              <Star size={14} className="text-gold fill-gold" />
              <span className="font-medium text-foreground">{Number(school.aviatorpath_rating).toFixed(1)}</span>
              {school.aviatorpath_review_count != null && school.aviatorpath_review_count > 0 && (
                <span className="text-muted-foreground">({school.aviatorpath_review_count})</span>
              )}
            </span>
          )}
          {cost && <span className="text-green-700 font-medium">{cost}</span>}
        </div>

        {/* Actions */}
        <div className="flex gap-2 border-t border-border pt-4">
          <a
            href={`/schools/${school.slug}`}
            className="flex-1 text-center text-sm font-medium border border-navy text-navy rounded-lg py-2 hover:bg-navy hover:text-navy-foreground transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            View Profile
          </a>
          <CompareButton school={school} />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSave?.();
            }}
            className={`px-3 border rounded-lg transition-colors ${
              isSaved ? "bg-gold/10 border-gold text-gold" : "border-border text-muted-foreground hover:text-gold hover:border-gold"
            }`}
          >
            <Heart size={16} className={isSaved ? "fill-gold" : ""} />
          </button>
        </div>
      </div>
    </div>
  );
}

function CompareButton({ school }: { school: School }) {
  const { addSchool, removeSchool, isComparing } = useCompare();
  const active = isComparing(school.id);

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        if (active) {
          removeSchool(school.id);
        } else {
          addSchool(school);
          toast.success(`${school.name} added to comparison`);
        }
      }}
      className={`px-3 border rounded-lg transition-colors ${
        active ? "bg-sky/10 border-sky text-sky" : "border-border text-muted-foreground hover:text-sky hover:border-sky"
      }`}
      title="Compare"
    >
      <Scale size={16} />
    </button>
  );
}

export function SchoolCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl shadow-sm overflow-hidden border border-border animate-pulse">
      <div className="h-48 bg-muted" />
      <div className="p-5 space-y-3">
        <div className="h-5 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="flex gap-1">
          <div className="h-5 bg-muted rounded-full w-16" />
          <div className="h-5 bg-muted rounded-full w-16" />
        </div>
        <div className="flex gap-4">
          <div className="h-4 bg-muted rounded w-20" />
          <div className="h-4 bg-muted rounded w-24" />
        </div>
        <div className="border-t border-border pt-4 flex gap-2">
          <div className="h-9 bg-muted rounded-lg flex-1" />
          <div className="h-9 bg-muted rounded-lg w-10" />
        </div>
      </div>
    </div>
  );
}
