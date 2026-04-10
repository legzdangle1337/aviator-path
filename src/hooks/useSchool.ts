import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSchool(slug: string | undefined) {
  return useQuery({
    queryKey: ["school", slug],
    queryFn: async () => {
      if (!slug) throw new Error("No slug");
      const { data, error } = await supabase
        .from("schools")
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

export function useSchoolReviews(schoolId: string | undefined) {
  return useQuery({
    queryKey: ["school-reviews", schoolId],
    queryFn: async () => {
      if (!schoolId) throw new Error("No school ID");
      const { data, error } = await supabase
        .from("school_reviews")
        .select("*")
        .eq("school_id", schoolId)
        .eq("is_hidden", false)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!schoolId,
  });
}

export function useSimilarSchools(state: string | undefined, excludeId: string | undefined) {
  return useQuery({
    queryKey: ["similar-schools", state, excludeId],
    queryFn: async () => {
      if (!state) return [];
      let query = supabase
        .from("schools")
        .select("*")
        .eq("state", state)
        .eq("is_active", true)
        .limit(3);
      if (excludeId) query = query.neq("id", excludeId);
      const { data, error } = await query;
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!state,
  });
}
