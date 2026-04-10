import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { SchoolFilters } from "./useSchoolFilters";
import { STATE_NAMES } from "./useSchoolFilters";

// Reverse map: "Alabama" -> "AL"
const STATE_NAME_TO_ABBR: Record<string, string> = Object.fromEntries(
  Object.entries(STATE_NAMES).map(([abbr, name]) => [name, abbr])
);

const PAGE_SIZE = 20;

export function useSchools(filters: SchoolFilters) {
  return useQuery({
    queryKey: ["schools", filters],
    queryFn: async () => {
      let query = supabase
        .from("schools")
        .select("*", { count: "exact" })
        .eq("is_active", true);

      // Text search
      if (filters.search) {
        const q = `%${filters.search}%`;
        // Also try to match state abbreviation from full state name
        const stateMatch = Object.entries(STATE_NAME_TO_ABBR).find(
          ([name]) => name.toLowerCase() === filters.search.toLowerCase()
        );
        const stateAbbr = stateMatch ? stateMatch[1] : null;
        const orParts = [`name.ilike.${q}`, `city.ilike.${q}`, `state.ilike.${q}`, `description.ilike.${q}`];
        if (stateAbbr) {
          orParts.push(`state.eq.${stateAbbr}`);
        }
        query = query.or(orParts.join(","));
      }

      // Location
      if (filters.state) query = query.eq("state", filters.state);

      // Part type
      if (filters.partType === "141") query = query.in("part_type", ["141", "both"]);
      else if (filters.partType === "61") query = query.in("part_type", ["61", "both"]);
      else if (filters.partType === "both") query = query.eq("part_type", "both");

      // Cost range
      query = query.or(
        `true_cost_min.is.null,true_cost_min.gte.${filters.costMin}`
      );
      query = query.or(
        `true_cost_max.is.null,true_cost_max.lte.${filters.costMax}`
      );

      // Partnerships
      if (filters.partnerships.length > 0) {
        const anyPartnership = filters.partnerships.includes("any_partnership");
        if (!anyPartnership) {
          for (const p of filters.partnerships) {
            if (p === "skywest_elite") query = query.eq("skywest_elite", true);
            if (p === "united_aviate") query = query.eq("united_aviate", true);
            if (p === "southwest_d225") query = query.eq("southwest_d225", true);
            if (p === "delta_propel") query = query.eq("delta_propel", true);
            if (p === "envoy_cadet") query = query.eq("envoy_cadet", true);
            if (p === "gojet_academy") query = query.eq("gojet_academy", true);
            if (p === "psa_pathway") query = query.eq("psa_pathway", true);
            if (p === "piedmont_pathway") query = query.eq("piedmont_pathway", true);
          }
        } else {
          query = query.or(
            "skywest_elite.eq.true,united_aviate.eq.true,southwest_d225.eq.true,delta_propel.eq.true,envoy_cadet.eq.true,gojet_academy.eq.true,psa_pathway.eq.true,piedmont_pathway.eq.true"
          );
        }
      }

      // Fleet & equipment
      if (filters.hasG1000) query = query.eq("has_g1000", true);
      if (filters.hasTaa) query = query.eq("has_taa", true);
      if (filters.hasMultiEngine) query = query.eq("has_multi_engine", true);
      if (filters.hasSimulator) query = query.eq("has_simulator", true);

      // Additional
      if (filters.housingAvailable) query = query.eq("housing_available", true);
      if (filters.editorsPick) query = query.eq("editors_pick", true);
      if (filters.claimedOnly) query = query.eq("is_claimed", true);
      if (filters.minVfrDays > 100) query = query.gte("vfr_days_per_year", filters.minVfrDays);
      if (filters.minRating > 0) query = query.gte("aviatorpath_rating", filters.minRating);

      // Sort
      switch (filters.sort) {
        case "highest_rated":
          query = query.order("aviatorpath_rating", { ascending: false, nullsFirst: false });
          break;
        case "lowest_cost":
          query = query.order("true_cost_min", { ascending: true, nullsFirst: false });
          break;
        case "most_reviews":
          query = query.order("aviatorpath_review_count", { ascending: false, nullsFirst: false });
          break;
        case "recently_updated":
          query = query.order("updated_at", { ascending: false });
          break;
        case "featured_first":
          query = query.order("is_featured", { ascending: false }).order("aviatorpath_rating", { ascending: false, nullsFirst: false });
          break;
        default:
          query = query.order("is_featured", { ascending: false }).order("editors_pick", { ascending: false }).order("aviatorpath_rating", { ascending: false, nullsFirst: false });
      }

      // Pagination
      const from = (filters.page - 1) * PAGE_SIZE;
      query = query.range(from, from + PAGE_SIZE - 1);

      const { data, error, count } = await query;
      if (error) throw error;
      return { schools: data ?? [], total: count ?? 0, pageSize: PAGE_SIZE };
    },
    staleTime: 30_000,
  });
}
