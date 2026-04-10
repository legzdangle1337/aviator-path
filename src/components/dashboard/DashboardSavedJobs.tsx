import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { X, MapPin, DollarSign } from "lucide-react";
import { toast } from "sonner";

export default function DashboardSavedJobs() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: savedJobs, isLoading } = useQuery({
    queryKey: ["saved-jobs-full", user?.id],
    queryFn: async () => {
      const { data: saved } = await supabase
        .from("saved_jobs")
        .select("job_id")
        .eq("user_id", user!.id);
      if (!saved?.length) return [];
      const ids = saved.map(s => s.job_id).filter(Boolean) as string[];
      const { data: jobs } = await supabase
        .from("jobs")
        .select("id, job_title, company_name, slug, location, salary_min, salary_max, min_total_hours, job_type, is_active")
        .in("id", ids);
      return jobs ?? [];
    },
    enabled: !!user,
  });

  const removeSaved = async (jobId: string) => {
    await supabase.from("saved_jobs").delete().eq("user_id", user!.id).eq("job_id", jobId);
    queryClient.invalidateQueries({ queryKey: ["saved-jobs-full"] });
    toast.success("Removed");
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-[hsl(var(--navy))]">Saved Jobs</h1>
        {[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-[hsl(var(--navy))]">Saved Jobs</h1>

      {!savedJobs?.length ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">
          No saved jobs yet. <Link to="/jobs" className="text-[hsl(var(--primary))] hover:underline">Browse jobs →</Link>
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {savedJobs.map(job => (
            <Card key={job.id} className={`transition-colors ${job.is_active ? "hover:border-[hsl(var(--sky))]" : "opacity-60"}`}>
              <CardContent className="p-4 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Link to={`/jobs/${job.slug}`} className="font-semibold text-sm text-[hsl(var(--navy))] hover:text-[hsl(var(--primary))] transition-colors truncate">
                      {job.job_title}
                    </Link>
                    {!job.is_active && <Badge variant="destructive" className="text-xs">Expired</Badge>}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span>{job.company_name}</span>
                    {job.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>}
                    {job.min_total_hours && <Badge variant="secondary" className="text-xs">{job.min_total_hours}+ hrs</Badge>}
                    {job.salary_min && (
                      <span className="flex items-center gap-1 text-green-700">
                        <DollarSign className="h-3 w-3" />${(job.salary_min / 1000).toFixed(0)}k+
                      </span>
                    )}
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeSaved(job.id)} className="text-muted-foreground hover:text-destructive shrink-0">
                  <X className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
