import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useCadetPrograms() {
  return useQuery({
    queryKey: ["cadet_programs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cadet_programs")
        .select("*")
        .eq("is_active", true)
        .order("airline_name");
      if (error) throw error;
      return data;
    },
  });
}

export function useCadetProgram(slug?: string) {
  return useQuery({
    queryKey: ["cadet_program", slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cadet_programs")
        .select("*")
        .eq("slug", slug!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!slug,
  });
}

export function useProgramExperiences(programId?: string) {
  return useQuery({
    queryKey: ["cadet_program_experiences", programId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cadet_program_experiences")
        .select("*")
        .eq("program_id", programId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!programId,
  });
}
