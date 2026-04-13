import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import FlightLogForm from "./progress/FlightLogForm";
import HoursSummaryCards from "./progress/HoursSummaryCards";
import HoursChart from "./progress/HoursChart";

interface Props {
  profile: Tables<"profiles"> | null | undefined;
}

export default function DashboardProgress({ profile }: Props) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["flight-logs", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("flight_logs")
        .select("*")
        .eq("user_id", user!.id)
        .order("date", { ascending: true });
      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const onLogSaved = () => {
    queryClient.invalidateQueries({ queryKey: ["flight-logs"] });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[hsl(var(--navy))]">My Progress</h1>

      <FlightLogForm onSaved={onLogSaved} />
      <HoursSummaryCards logs={logs} isLoading={isLoading} />
      <HoursChart logs={logs} />
    </div>
  );
}
