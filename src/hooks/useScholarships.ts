import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { ScholarshipFilters } from "./useScholarshipFilters";

const PAGE_SIZE = 12;

export function useScholarships(filters: ScholarshipFilters) {
  return useQuery({
    queryKey: ["scholarships", filters],
    queryFn: async () => {
      let query = supabase.from("scholarships").select("*", { count: "exact" });

      // Search
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,organization.ilike.%${filters.search}%`);
      }

      // Categories
      if (filters.categories.length) {
        query = query.overlaps("categories", filters.categories);
      }

      // Eligibility — check both eligible_stages and eligible_demographics
      if (filters.eligibility.length) {
        const stageValues = ["No Experience", "Student Pilot", "PPL Holder", "Instrument", "Commercial", "CFI"];
        const stages = filters.eligibility.filter(v => stageValues.includes(v));
        const demos = filters.eligibility.filter(v => !stageValues.includes(v));
        
        if (stages.length && demos.length) {
          query = query.or(`eligible_stages.ov.{${stages.join(",")}},eligible_demographics.ov.{${demos.join(",")}}`);
        } else if (stages.length) {
          query = query.overlaps("eligible_stages", stages);
        } else if (demos.length) {
          query = query.overlaps("eligible_demographics", demos);
        }
      }

      // Amount range
      if (filters.amountRange === "under1k") {
        query = query.lt("amount_max", 1000);
      } else if (filters.amountRange === "1k-5k") {
        query = query.gte("amount_max", 1000).lte("amount_max", 5000);
      } else if (filters.amountRange === "5k-20k") {
        query = query.gte("amount_max", 5000).lte("amount_max", 20000);
      } else if (filters.amountRange === "20k+") {
        query = query.gte("amount_max", 20000);
      }

      // Deadline range
      const now = new Date();
      if (filters.deadlineRange === "open") {
        query = query.eq("is_rolling", true);
      } else if (filters.deadlineRange === "this_month") {
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        query = query.gte("deadline", now.toISOString().slice(0, 10)).lte("deadline", endOfMonth.toISOString().slice(0, 10));
      } else if (filters.deadlineRange === "3months") {
        const in3 = new Date(now.getFullYear(), now.getMonth() + 3, now.getDate());
        query = query.gte("deadline", now.toISOString().slice(0, 10)).lte("deadline", in3.toISOString().slice(0, 10));
      }

      // Sort
      if (filters.sort === "highest_amount") {
        query = query.order("amount_max", { ascending: false });
      } else if (filters.sort === "lowest_amount") {
        query = query.order("amount_max", { ascending: true });
      } else if (filters.sort === "deadline_soonest") {
        query = query.order("deadline", { ascending: true, nullsFirst: false });
      } else if (filters.sort === "recently_added") {
        query = query.order("created_at", { ascending: false });
      } else {
        query = query.order("deadline", { ascending: true, nullsFirst: false });
      }

      // Pagination
      const from = (filters.page - 1) * PAGE_SIZE;
      query = query.range(from, from + PAGE_SIZE - 1);

      const { data, count, error } = await query;
      if (error) throw error;
      return { scholarships: data ?? [], total: count ?? 0, pageSize: PAGE_SIZE };
    },
  });
}

export function useScholarship(slug: string) {
  return useQuery({
    queryKey: ["scholarship", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scholarships")
        .select("*")
        .eq("slug", slug)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}

export function useNextDeadline() {
  return useQuery({
    queryKey: ["scholarship-next-deadline"],
    queryFn: async () => {
      const today = new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase
        .from("scholarships")
        .select("name, deadline, slug, amount_max")
        .gte("deadline", today)
        .order("deadline", { ascending: true })
        .limit(1)
        .single();
      if (error) return null;
      return data;
    },
  });
}
