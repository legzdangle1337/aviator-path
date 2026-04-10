import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { JobFilters } from "./useJobFilters";

const PAGE_SIZE = 20;

function getHoursRange(range: string): { min: number; max: number } | null {
  switch (range) {
    case "0-500": return { min: 0, max: 500 };
    case "500-1000": return { min: 500, max: 1000 };
    case "1000-1500": return { min: 1000, max: 1500 };
    case "1500+": return { min: 1500, max: 999999 };
    default: return null;
  }
}

export function useJobs(filters: JobFilters, userHours?: number | null) {
  return useQuery({
    queryKey: ["jobs", filters, userHours],
    queryFn: async () => {
      let query = supabase
        .from("jobs")
        .select("*", { count: "exact" })
        .eq("is_active", true);

      // Job types
      if (filters.jobTypes.length > 0) {
        query = query.in("job_type", filters.jobTypes);
      }

      // Hours range
      const hoursRange = getHoursRange(filters.hoursRange);
      if (hoursRange) {
        query = query.or(`min_total_hours.is.null,min_total_hours.lte.${hoursRange.max}`);
        if (hoursRange.min > 0) {
          query = query.or(`min_total_hours.is.null,min_total_hours.gte.${hoursRange.min}`);
        }
      }

      // Qualify only
      if (filters.qualifyOnly && userHours != null) {
        query = query.or(`min_total_hours.is.null,min_total_hours.lte.${userHours}`);
      }

      // Location
      if (filters.state) {
        query = query.ilike("location", `%${filters.state}%`);
      }

      // Posted within
      if (filters.postedWithin === "7days") {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        query = query.gte("posted_date", d.toISOString());
      } else if (filters.postedWithin === "30days") {
        const d = new Date();
        d.setDate(d.getDate() - 30);
        query = query.gte("posted_date", d.toISOString());
      }

      // Salary
      if (filters.showSalary) {
        query = query.not("salary_min", "is", null);
        if (filters.salaryMin > 0) query = query.gte("salary_min", filters.salaryMin);
        if (filters.salaryMax < 300000) query = query.lte("salary_max", filters.salaryMax);
      }

      // Sort
      switch (filters.sort) {
        case "salary_high":
          query = query.order("salary_max", { ascending: false, nullsFirst: false });
          break;
        case "salary_low":
          query = query.order("salary_min", { ascending: true, nullsFirst: false });
          break;
        case "oldest":
          query = query.order("posted_date", { ascending: true });
          break;
        default:
          query = query.order("is_featured", { ascending: false }).order("posted_date", { ascending: false });
      }

      const from = (filters.page - 1) * PAGE_SIZE;
      query = query.range(from, from + PAGE_SIZE - 1);

      const { data, error, count } = await query;
      if (error) throw error;
      return { jobs: data ?? [], total: count ?? 0, pageSize: PAGE_SIZE };
    },
    staleTime: 30_000,
  });
}

export function useJob(slug: string) {
  return useQuery({
    queryKey: ["job", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}

export function useJobStats() {
  return useQuery({
    queryKey: ["job-stats"],
    queryFn: async () => {
      const { count: totalCount } = await supabase
        .from("jobs")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true);

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      const { count: newCount } = await supabase
        .from("jobs")
        .select("*", { count: "exact", head: true })
        .eq("is_active", true)
        .gte("posted_date", weekAgo.toISOString());

      const { data: latest } = await supabase
        .from("jobs")
        .select("posted_date")
        .eq("is_active", true)
        .order("posted_date", { ascending: false })
        .limit(1)
        .single();

      return {
        total: totalCount ?? 0,
        newThisWeek: newCount ?? 0,
        lastUpdated: latest?.posted_date ?? null,
      };
    },
    staleTime: 60_000,
  });
}
