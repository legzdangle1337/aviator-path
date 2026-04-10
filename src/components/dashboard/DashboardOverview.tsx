import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { Plane, Briefcase, BookmarkCheck, CalendarClock, ArrowRight } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import type { Tables } from "@/integrations/supabase/types";

interface Props {
  profile: Tables<"profiles"> | null | undefined;
}

const STAGES = ["Researching", "Student Pilot", "PPL Holder", "Instrument Rated", "Commercial Pilot", "CFI", "ATP"];

export default function DashboardOverview({ profile }: Props) {
  const { user } = useAuth();

  const { data: savedCounts } = useQuery({
    queryKey: ["dashboard-saved-counts", user?.id],
    queryFn: async () => {
      const [schools, jobs, scholarships] = await Promise.all([
        supabase.from("saved_schools").select("id", { count: "exact", head: true }).eq("user_id", user!.id),
        supabase.from("saved_jobs").select("id", { count: "exact", head: true }).eq("user_id", user!.id),
        supabase.from("saved_scholarships").select("id", { count: "exact", head: true }).eq("user_id", user!.id),
      ]);
      return { schools: schools.count ?? 0, jobs: jobs.count ?? 0, scholarships: scholarships.count ?? 0 };
    },
    enabled: !!user,
  });

  const { data: qualifyingJobCount } = useQuery({
    queryKey: ["qualifying-jobs", profile?.total_hours],
    queryFn: async () => {
      const hours = profile?.total_hours ?? 0;
      const { count } = await supabase
        .from("jobs")
        .select("id", { count: "exact", head: true })
        .eq("is_active", true)
        .or(`min_total_hours.is.null,min_total_hours.lte.${hours}`);
      return count ?? 0;
    },
    enabled: !!profile,
  });

  const { data: upcomingDeadlines } = useQuery({
    queryKey: ["upcoming-deadlines", user?.id],
    queryFn: async () => {
      const { data: saved } = await supabase
        .from("saved_scholarships")
        .select("scholarship_id")
        .eq("user_id", user!.id);
      if (!saved?.length) return [];
      const ids = saved.map(s => s.scholarship_id).filter(Boolean) as string[];
      const { data } = await supabase
        .from("scholarships")
        .select("name, deadline, slug")
        .in("id", ids)
        .not("deadline", "is", null)
        .gte("deadline", new Date().toISOString().split("T")[0])
        .order("deadline")
        .limit(3);
      return data ?? [];
    },
    enabled: !!user,
  });

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const stageIndex = STAGES.indexOf(profile?.pilot_stage || "");
  const stageProgress = stageIndex >= 0 ? Math.round(((stageIndex + 1) / STAGES.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[hsl(var(--navy))]">
          {greeting()}, {profile?.first_name || "Pilot"} ✈️
        </h1>
        <p className="text-sm text-muted-foreground">{format(new Date(), "EEEE, MMMM d, yyyy")}</p>
      </div>

      {/* Stats grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Journey */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Plane className="h-4 w-4 text-[hsl(var(--gold))]" /> My Journey
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-bold text-[hsl(var(--navy))] mb-2">{profile?.pilot_stage || "Not set"}</p>
            <Progress value={stageProgress} className="h-2 mb-2" />
            <Link to="/dashboard/settings" className="text-xs text-[hsl(var(--primary))] hover:underline">Edit →</Link>
          </CardContent>
        </Card>

        {/* Qualifying jobs */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-[hsl(var(--gold))]" /> Jobs I Qualify For
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-extrabold text-[hsl(var(--navy))]">{qualifyingJobCount ?? 0}</p>
            <p className="text-xs text-muted-foreground mb-2">match your {profile?.total_hours ?? 0} hours</p>
            <Link to="/jobs" className="text-xs text-[hsl(var(--primary))] hover:underline">View Jobs →</Link>
          </CardContent>
        </Card>

        {/* Saved */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <BookmarkCheck className="h-4 w-4 text-[hsl(var(--gold))]" /> Saved Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 text-sm mb-2">
              <span className="font-semibold">{savedCounts?.schools ?? 0} Schools</span>
              <span className="font-semibold">{savedCounts?.jobs ?? 0} Jobs</span>
              <span className="font-semibold">{savedCounts?.scholarships ?? 0} Schol.</span>
            </div>
            <Link to="/dashboard/schools" className="text-xs text-[hsl(var(--primary))] hover:underline">View All →</Link>
          </CardContent>
        </Card>

        {/* Deadlines */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-[hsl(var(--gold))]" /> Upcoming Deadlines
            </CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingDeadlines?.length ? (
              <ul className="space-y-1.5">
                {upcomingDeadlines.map((s) => {
                  const days = differenceInDays(new Date(s.deadline!), new Date());
                  return (
                    <li key={s.slug} className="text-xs">
                      <Link to={`/scholarships/${s.slug}`} className="hover:underline font-medium truncate block">{s.name}</Link>
                      <span className={days < 14 ? "text-destructive font-semibold" : "text-muted-foreground"}>
                        {days} days left
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-xs text-muted-foreground">No upcoming deadlines. Save scholarships to track them.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[hsl(var(--navy))]">Recommended For You</CardTitle>
          <p className="text-sm text-muted-foreground">Based on your profile</p>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-3 gap-4">
            <Link to="/schools" className="border rounded-xl p-4 hover:border-[hsl(var(--sky))] transition-colors group">
              <p className="font-semibold text-sm text-[hsl(var(--navy))] group-hover:text-[hsl(var(--primary))]">Browse Schools</p>
              <p className="text-xs text-muted-foreground mt-1">Find flight schools that match your budget and location</p>
              <span className="text-xs text-[hsl(var(--primary))] mt-2 flex items-center gap-1">Explore <ArrowRight className="h-3 w-3" /></span>
            </Link>
            <Link to="/jobs" className="border rounded-xl p-4 hover:border-[hsl(var(--sky))] transition-colors group">
              <p className="font-semibold text-sm text-[hsl(var(--navy))] group-hover:text-[hsl(var(--primary))]">Browse Jobs</p>
              <p className="text-xs text-muted-foreground mt-1">See pilot positions matching your flight hours</p>
              <span className="text-xs text-[hsl(var(--primary))] mt-2 flex items-center gap-1">Explore <ArrowRight className="h-3 w-3" /></span>
            </Link>
            <Link to="/scholarships" className="border rounded-xl p-4 hover:border-[hsl(var(--sky))] transition-colors group">
              <p className="font-semibold text-sm text-[hsl(var(--navy))] group-hover:text-[hsl(var(--primary))]">Find Scholarships</p>
              <p className="text-xs text-muted-foreground mt-1">Discover aviation scholarships you're eligible for</p>
              <span className="text-xs text-[hsl(var(--primary))] mt-2 flex items-center gap-1">Explore <ArrowRight className="h-3 w-3" /></span>
            </Link>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            <Link to="/dashboard/settings" className="text-[hsl(var(--primary))] hover:underline">Update your profile</Link> to improve recommendations
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
