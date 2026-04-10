import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  type ScholarshipFilters,
  CATEGORY_OPTIONS,
  ELIGIBILITY_OPTIONS,
  AMOUNT_OPTIONS,
  DEADLINE_OPTIONS,
} from "@/hooks/useScholarshipFilters";

interface Props {
  filters: ScholarshipFilters;
  setFilters: (u: Partial<ScholarshipFilters>) => void;
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

export function ScholarshipFiltersSidebar({ filters, setFilters, activeCount, clearFilters }: Props) {
  const toggleArray = (arr: string[], value: string) =>
    arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value];

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

      <Section title="Type">
        {CATEGORY_OPTIONS.map((opt) => (
          <Checkbox
            key={opt.value}
            checked={filters.categories.includes(opt.value)}
            onChange={() => setFilters({ categories: toggleArray(filters.categories, opt.value) })}
            label={opt.label}
            desc={opt.desc}
          />
        ))}
      </Section>

      <Section title="Eligibility">
        {ELIGIBILITY_OPTIONS.map((opt) => (
          <Checkbox
            key={opt.value}
            checked={filters.eligibility.includes(opt.value)}
            onChange={() => setFilters({ eligibility: toggleArray(filters.eligibility, opt.value) })}
            label={opt.label}
          />
        ))}
      </Section>

      <Section title="Award Amount" defaultOpen={false}>
        {AMOUNT_OPTIONS.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer text-sm text-foreground/80">
            <input
              type="radio"
              name="amountRange"
              checked={filters.amountRange === opt.value}
              onChange={() => setFilters({ amountRange: opt.value })}
              className="h-4 w-4 accent-sky"
            />
            {opt.label}
          </label>
        ))}
      </Section>

      <Section title="Deadline" defaultOpen={false}>
        {DEADLINE_OPTIONS.map((opt) => (
          <label key={opt.value} className="flex items-center gap-2 cursor-pointer text-sm text-foreground/80">
            <input
              type="radio"
              name="deadlineRange"
              checked={filters.deadlineRange === opt.value}
              onChange={() => setFilters({ deadlineRange: opt.value })}
              className="h-4 w-4 accent-sky"
            />
            {opt.label}
          </label>
        ))}
      </Section>
    </div>
  );
}
