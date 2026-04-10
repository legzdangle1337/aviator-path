import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";
import { type SchoolFilters, US_STATES, STATE_NAMES } from "@/hooks/useSchoolFilters";

interface Props {
  filters: SchoolFilters;
  setFilters: (u: Partial<SchoolFilters>) => void;
  activeCount: number;
  clearFilters: () => void;
}

const PARTNERSHIP_OPTIONS = [
  { key: "skywest_elite", label: "SkyWest Elite", tip: "Guarantees Day 1 seniority at SkyWest upon hire" },
  { key: "united_aviate", label: "United Aviate", tip: "Conditional offer pathway to United Airlines" },
  { key: "southwest_d225", label: "Southwest D225", tip: "Southwest's pilot cadet development program" },
  { key: "delta_propel", label: "Delta Propel", tip: "Delta's pilot pipeline program" },
  { key: "envoy_cadet", label: "Envoy Cadet", tip: "Pathway to American Airlines via Envoy" },
  { key: "gojet_academy", label: "GoJet Academy" },
  { key: "psa_pathway", label: "PSA Pathway" },
  { key: "piedmont_pathway", label: "Piedmont Pathway" },
  { key: "any_partnership", label: "Any Partnership", tip: "Shows schools with any airline partnership" },
];

function Section({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border py-4">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between text-sm font-semibold text-foreground">
        {title}
        <ChevronDown size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

function Checkbox({ checked, onChange, label, tip }: { checked: boolean; onChange: (v: boolean) => void; label: string; tip?: string }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground/80 group">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 rounded border-input accent-sky" />
      <span>{label}</span>
      {tip && (
        <span className="relative">
          <HelpCircle size={14} className="text-muted-foreground" />
          <span className="absolute left-6 top-0 z-50 hidden group-hover:block w-52 bg-foreground text-background text-xs rounded-lg p-2 shadow-lg">
            {tip}
          </span>
        </span>
      )}
    </label>
  );
}

export function SchoolFiltersSidebar({ filters, setFilters, activeCount, clearFilters }: Props) {
  const togglePartnership = (key: string) => {
    const current = filters.partnerships;
    const next = current.includes(key) ? current.filter((k) => k !== key) : [...current, key];
    setFilters({ partnerships: next });
  };

  return (
    <div className="space-y-0">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <h3 className="font-semibold text-foreground">
          Filters{activeCount > 0 && <span className="ml-1.5 text-xs bg-sky text-sky-foreground px-2 py-0.5 rounded-full">{activeCount}</span>}
        </h3>
        {activeCount > 0 && (
          <button onClick={clearFilters} className="text-xs text-sky hover:underline">Clear All</button>
        )}
      </div>

      {/* Location */}
      <Section title="Location">
        <select
          value={filters.state}
          onChange={(e) => setFilters({ state: e.target.value })}
          className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm outline-none"
        >
          <option value="">All States</option>
          {US_STATES.map((s) => (
            <option key={s} value={s}>{STATE_NAMES[s]}</option>
          ))}
        </select>
      </Section>

      {/* Training Type */}
      <Section title="Training Type">
        {[
          { value: "", label: "All Types" },
          { value: "141", label: "Part 141 Only" },
          { value: "61", label: "Part 61 Only" },
          { value: "both", label: "Schools with both" },
        ].map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer text-sm text-foreground/80">
            <input
              type="radio"
              name="partType"
              checked={filters.partType === opt.value}
              onChange={() => setFilters({ partType: opt.value })}
              className="h-4 w-4 accent-sky"
            />
            {opt.label}
          </label>
        ))}
      </Section>

      {/* Cost */}
      <Section title="Estimated Cost">
        <div className="space-y-3">
          <div className="text-sm font-medium text-sky">
            ${Math.round(filters.costMin / 1000)}K — ${Math.round(filters.costMax / 1000)}K
          </div>
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground">Min: ${(filters.costMin / 1000).toFixed(0)}K</label>
            <input
              type="range"
              min={0}
              max={150000}
              step={5000}
              value={filters.costMin}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (v < filters.costMax) setFilters({ costMin: v });
              }}
              className="w-full accent-sky"
            />
            <label className="text-xs text-muted-foreground">Max: ${(filters.costMax / 1000).toFixed(0)}K</label>
            <input
              type="range"
              min={50000}
              max={200000}
              step={5000}
              value={filters.costMax}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (v > filters.costMin) setFilters({ costMax: v });
              }}
              className="w-full accent-sky"
            />
          </div>
        </div>
      </Section>

      {/* Partnerships */}
      <Section title="Airline Partnerships" defaultOpen={false}>
        {PARTNERSHIP_OPTIONS.map((p) => (
          <Checkbox
            key={p.key}
            checked={filters.partnerships.includes(p.key)}
            onChange={() => togglePartnership(p.key)}
            label={p.label}
            tip={p.tip}
          />
        ))}
      </Section>

      {/* Fleet */}
      <Section title="Fleet & Equipment" defaultOpen={false}>
        <Checkbox checked={filters.hasG1000} onChange={(v) => setFilters({ hasG1000: v })} label="Garmin G1000 / Glass Cockpit" />
        <Checkbox checked={filters.hasTaa} onChange={(v) => setFilters({ hasTaa: v })} label="TAA (Technically Advanced Aircraft)" />
        <Checkbox checked={filters.hasMultiEngine} onChange={(v) => setFilters({ hasMultiEngine: v })} label="Multi-engine training available" />
        <Checkbox checked={filters.hasSimulator} onChange={(v) => setFilters({ hasSimulator: v })} label="Full-motion simulator available" />
      </Section>

      {/* Additional */}
      <Section title="Additional Filters" defaultOpen={false}>
        <Checkbox checked={filters.housingAvailable} onChange={(v) => setFilters({ housingAvailable: v })} label="Student housing available" />
        <Checkbox checked={filters.editorsPick} onChange={(v) => setFilters({ editorsPick: v })} label="AviatorPath Editor's Pick" />
        <Checkbox checked={filters.claimedOnly} onChange={(v) => setFilters({ claimedOnly: v })} label="Verified/Claimed profiles only" />

        <div className="pt-2">
          <label className="text-xs text-muted-foreground mb-1 block">Min VFR days/year: {filters.minVfrDays}</label>
          <input
            type="range"
            min={100}
            max={365}
            step={5}
            value={filters.minVfrDays}
            onChange={(e) => setFilters({ minVfrDays: Number(e.target.value) })}
            className="w-full accent-sky"
          />
        </div>

        <div className="pt-2">
          <label className="text-xs text-muted-foreground mb-1 block">Min rating</label>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((r) => (
              <button
                key={r}
                onClick={() => setFilters({ minRating: filters.minRating === r ? 0 : r })}
                className={`text-lg ${r <= filters.minRating ? "text-gold" : "text-border"}`}
              >
                ★
              </button>
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
