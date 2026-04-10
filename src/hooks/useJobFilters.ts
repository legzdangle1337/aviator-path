import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo } from "react";

export interface JobFilters {
  jobTypes: string[];
  hoursRange: string;
  state: string;
  postedWithin: string;
  showSalary: boolean;
  salaryMin: number;
  salaryMax: number;
  qualifyOnly: boolean;
  sort: string;
  page: number;
}

const DEFAULT_FILTERS: JobFilters = {
  jobTypes: [],
  hoursRange: "any",
  state: "",
  postedWithin: "any",
  showSalary: false,
  salaryMin: 0,
  salaryMax: 300000,
  qualifyOnly: false,
  sort: "newest",
  page: 1,
};

export const JOB_TYPE_OPTIONS = [
  { value: "major_airline", label: "Major Airline", desc: "United, Delta, Southwest, AA" },
  { value: "regional_airline", label: "Regional Airline", desc: "SkyWest, GoJet, PSA, etc." },
  { value: "cfi", label: "CFI / Flight Instructor" },
  { value: "charter", label: "Charter / Part 135" },
  { value: "cargo", label: "Cargo", desc: "FedEx, UPS, Atlas Air" },
  { value: "corporate", label: "Corporate / Business Aviation" },
  { value: "military", label: "Military (Guard/Reserve)" },
  { value: "government", label: "Government Aviation" },
];

export const HOURS_RANGE_OPTIONS = [
  { value: "any", label: "Any hours requirement" },
  { value: "0-500", label: "Entry level (0–500 hours)" },
  { value: "500-1000", label: "Building time (500–1,000 hours)" },
  { value: "1000-1500", label: "Near ATP (1,000–1,500 hours)" },
  { value: "1500+", label: "ATP+ (1,500+ hours)" },
];

export function useJobFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: JobFilters = useMemo(() => {
    const p = searchParams;
    return {
      jobTypes: p.get("types")?.split(",").filter(Boolean) || [],
      hoursRange: p.get("hours") || "any",
      state: p.get("state") || "",
      postedWithin: p.get("posted") || "any",
      showSalary: p.get("salary") === "true",
      salaryMin: Number(p.get("salMin")) || 0,
      salaryMax: Number(p.get("salMax")) || 300000,
      qualifyOnly: p.get("qualify") === "true",
      sort: p.get("sort") || "newest",
      page: Number(p.get("page")) || 1,
    };
  }, [searchParams]);

  const setFilters = useCallback(
    (updater: Partial<JobFilters>) => {
      setSearchParams((prev) => {
        const current: JobFilters = {
          jobTypes: prev.get("types")?.split(",").filter(Boolean) || [],
          hoursRange: prev.get("hours") || "any",
          state: prev.get("state") || "",
          postedWithin: prev.get("posted") || "any",
          showSalary: prev.get("salary") === "true",
          salaryMin: Number(prev.get("salMin")) || 0,
          salaryMax: Number(prev.get("salMax")) || 300000,
          qualifyOnly: prev.get("qualify") === "true",
          sort: prev.get("sort") || "newest",
          page: Number(prev.get("page")) || 1,
        };

        const merged = { ...current, ...updater, page: updater.page ?? 1 };
        const params = new URLSearchParams();
        if (merged.jobTypes.length) params.set("types", merged.jobTypes.join(","));
        if (merged.hoursRange !== "any") params.set("hours", merged.hoursRange);
        if (merged.state) params.set("state", merged.state);
        if (merged.postedWithin !== "any") params.set("posted", merged.postedWithin);
        if (merged.showSalary) params.set("salary", "true");
        if (merged.salaryMin > 0) params.set("salMin", String(merged.salaryMin));
        if (merged.salaryMax < 300000) params.set("salMax", String(merged.salaryMax));
        if (merged.qualifyOnly) params.set("qualify", "true");
        if (merged.sort !== "newest") params.set("sort", merged.sort);
        if (merged.page > 1) params.set("page", String(merged.page));
        return params;
      }, { replace: true });
    },
    [setSearchParams]
  );

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filters.jobTypes.length) count++;
    if (filters.hoursRange !== "any") count++;
    if (filters.state) count++;
    if (filters.postedWithin !== "any") count++;
    if (filters.showSalary) count++;
    if (filters.qualifyOnly) count++;
    return count;
  }, [filters]);

  const clearFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  return { filters, setFilters, activeFilterCount, clearFilters };
}
