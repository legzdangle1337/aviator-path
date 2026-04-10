import { useSearchParams } from "react-router-dom";
import { useCallback, useMemo } from "react";

export interface ScholarshipFilters {
  categories: string[];
  eligibility: string[];
  amountRange: string;
  deadlineRange: string;
  sort: string;
  page: number;
  search: string;
}

const DEFAULT_FILTERS: ScholarshipFilters = {
  categories: [],
  eligibility: [],
  amountRange: "",
  deadlineRange: "",
  sort: "deadline_soonest",
  page: 1,
  search: "",
};

export const CATEGORY_OPTIONS = [
  { value: "Flight Training", label: "Flight Training", desc: "Direct funding for flight hours" },
  { value: "Academic", label: "Academic", desc: "For aviation degree programs" },
  { value: "Equipment & Gear", label: "Equipment & Gear" },
  { value: "Airline-Sponsored", label: "Airline-Sponsored" },
  { value: "Organization-Based", label: "Organization-Based", desc: "AOPA, EAA, WAI, etc." },
];

export const ELIGIBILITY_OPTIONS = [
  { value: "No Experience", label: "No flight experience required" },
  { value: "Student Pilot", label: "Student pilots" },
  { value: "PPL Holder", label: "PPL holders" },
  { value: "Women in Aviation", label: "Women in aviation" },
  { value: "Military Veterans", label: "Military veterans" },
  { value: "BIPOC/Underrepresented", label: "BIPOC / Underrepresented" },
  { value: "High School Students", label: "High school students" },
];

export const AMOUNT_OPTIONS = [
  { value: "", label: "Any amount" },
  { value: "under1k", label: "Under $1,000" },
  { value: "1k-5k", label: "$1,000 – $5,000" },
  { value: "5k-20k", label: "$5,000 – $20,000" },
  { value: "20k+", label: "$20,000+" },
];

export const DEADLINE_OPTIONS = [
  { value: "", label: "Any" },
  { value: "open", label: "Open now (rolling)" },
  { value: "this_month", label: "Closing this month" },
  { value: "3months", label: "Next 3 months" },
];

export function useScholarshipFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters: ScholarshipFilters = useMemo(() => {
    const p = searchParams;
    return {
      categories: p.get("cat")?.split(",").filter(Boolean) || [],
      eligibility: p.get("elig")?.split(",").filter(Boolean) || [],
      amountRange: p.get("amount") || "",
      deadlineRange: p.get("deadline") || "",
      sort: p.get("sort") || "deadline_soonest",
      page: Number(p.get("page")) || 1,
      search: p.get("q") || "",
    };
  }, [searchParams]);

  const setFilters = useCallback(
    (updater: Partial<ScholarshipFilters>) => {
      setSearchParams((prev) => {
        const current: ScholarshipFilters = {
          categories: prev.get("cat")?.split(",").filter(Boolean) || [],
          eligibility: prev.get("elig")?.split(",").filter(Boolean) || [],
          amountRange: prev.get("amount") || "",
          deadlineRange: prev.get("deadline") || "",
          sort: prev.get("sort") || "deadline_soonest",
          page: Number(prev.get("page")) || 1,
          search: prev.get("q") || "",
        };
        const merged = { ...current, ...updater, page: updater.page ?? 1 };
        const params = new URLSearchParams();
        if (merged.categories.length) params.set("cat", merged.categories.join(","));
        if (merged.eligibility.length) params.set("elig", merged.eligibility.join(","));
        if (merged.amountRange) params.set("amount", merged.amountRange);
        if (merged.deadlineRange) params.set("deadline", merged.deadlineRange);
        if (merged.sort !== "deadline_soonest") params.set("sort", merged.sort);
        if (merged.page > 1) params.set("page", String(merged.page));
        if (merged.search) params.set("q", merged.search);
        return params;
      }, { replace: true });
    },
    [setSearchParams]
  );

  const activeFilterCount = useMemo(() => {
    let c = 0;
    if (filters.categories.length) c++;
    if (filters.eligibility.length) c++;
    if (filters.amountRange) c++;
    if (filters.deadlineRange) c++;
    if (filters.search) c++;
    return c;
  }, [filters]);

  const clearFilters = useCallback(() => {
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  return { filters, setFilters, activeFilterCount, clearFilters };
}
