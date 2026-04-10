import { useState } from "react";
import { ChevronDown, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { type JobFilters, JOB_TYPE_OPTIONS, HOURS_RANGE_OPTIONS } from "@/hooks/useJobFilters";
import { US_STATES, STATE_NAMES } from "@/hooks/useSchoolFilters";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  filters: JobFilters;
  setFilters: (u: Partial<JobFilters>) => void;
  activeCount: number;
  clearFilters: () => void;
}

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

function Checkbox({ checked, onChange, label, desc }: { checked: boolean; onChange: (v: boolean) => void; label: string; desc?: string }) {
  return (
    <label className="flex items-start gap-2 cursor-pointer text-sm text-foreground/80">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 mt-0.5 rounded border-input accent-sky" />
      <span>
        {label}
        {desc && <span className="text-muted-foreground text-xs ml-1">({desc})</span>}
      </span>
    </label>
  );
}

export function JobFiltersSidebar({ filters, setFilters, activeCount, clearFilters }: Props) {
  const { user } = useAuth();

  const toggleJobType = (type: string) => {
    const current = filters.jobTypes;
    const next = current.includes(type) ? current.filter((t) => t !== type) : [...current, type];
    setFilters({ jobTypes: next });
  };

  return (
    <div className="space-y-0">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <h3 className="font-semibold text-foreground">
          Filters{activeCount > 0 && <span className="ml-1.5 text-xs bg-sky text-sky-foreground px-2 py-0.5 rounded-full">{activeCount}</span>}
        </h3>
        {activeCount > 0 && (
          <button onClick={clearFilters} className="text-xs text-sky hover:underline">Clear All</button>
        )}
      </div>

      {/* Job Type */}
      <Section title="Job Type">
        {JOB_TYPE_OPTIONS.map((opt) => (
          <Checkbox
            key={opt.value}
            checked={filters.jobTypes.includes(opt.value)}
            onChange={() => toggleJobType(opt.value)}
            label={opt.label}
            desc={opt.desc}
          />
        ))}
      </Section>

      {/* Hours Qualification */}
      <Section title="Hours Filter">
        {user ? (
          <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground/80 mb-3">
            <input
              type="checkbox"
              checked={filters.qualifyOnly}
              onChange={(e) => setFilters({ qualifyOnly: e.target.checked })}
              className="h-4 w-4 rounded border-input accent-sky"
            />
            <span className="font-medium">Show only jobs I qualify for</span>
          </label>
        ) : (
          <Link to="/login" className="flex items-center gap-2 text-sm text-sky hover:underline mb-3">
            <LogIn size={14} />
            Set up your profile →
          </Link>
        )}

        {HOURS_RANGE_OPTIONS.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer text-sm text-foreground/80">
            <input
              type="radio"
              name="hoursRange"
              checked={filters.hoursRange === opt.value}
              onChange={() => setFilters({ hoursRange: opt.value })}
              className="h-4 w-4 accent-sky"
            />
            {opt.label}
          </label>
        ))}
      </Section>

      {/* Location */}
      <Section title="Location" defaultOpen={false}>
        <select
          value={filters.state}
          onChange={(e) => setFilters({ state: e.target.value })}
          className="w-full h-9 px-3 rounded-lg border border-input bg-background text-sm outline-none"
        >
          <option value="">Any Location</option>
          {US_STATES.map((s) => (
            <option key={s} value={STATE_NAMES[s]}>{STATE_NAMES[s]}</option>
          ))}
        </select>
      </Section>

      {/* Posted */}
      <Section title="Date Posted" defaultOpen={false}>
        {[
          { value: "7days", label: "Last 7 days" },
          { value: "30days", label: "Last 30 days" },
          { value: "any", label: "Any time" },
        ].map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer text-sm text-foreground/80">
            <input
              type="radio"
              name="postedWithin"
              checked={filters.postedWithin === opt.value}
              onChange={() => setFilters({ postedWithin: opt.value })}
              className="h-4 w-4 accent-sky"
            />
            {opt.label}
          </label>
        ))}
      </Section>

      {/* Salary */}
      <Section title="Salary" defaultOpen={false}>
        <label className="flex items-center gap-2 cursor-pointer text-sm text-foreground/80 mb-2">
          <input
            type="checkbox"
            checked={filters.showSalary}
            onChange={(e) => setFilters({ showSalary: e.target.checked })}
            className="h-4 w-4 rounded border-input accent-sky"
          />
          Show salary info only
        </label>
        {filters.showSalary && (
          <div className="space-y-2 pl-6">
            <label className="text-xs text-muted-foreground">Min: ${(filters.salaryMin / 1000).toFixed(0)}K</label>
            <input
              type="range"
              min={0}
              max={300000}
              step={10000}
              value={filters.salaryMin}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (v < filters.salaryMax) setFilters({ salaryMin: v });
              }}
              className="w-full accent-sky"
            />
            <label className="text-xs text-muted-foreground">Max: ${(filters.salaryMax / 1000).toFixed(0)}K</label>
            <input
              type="range"
              min={0}
              max={300000}
              step={10000}
              value={filters.salaryMax}
              onChange={(e) => {
                const v = Number(e.target.value);
                if (v > filters.salaryMin) setFilters({ salaryMax: v });
              }}
              className="w-full accent-sky"
            />
          </div>
        )}
      </Section>
    </div>
  );
}
