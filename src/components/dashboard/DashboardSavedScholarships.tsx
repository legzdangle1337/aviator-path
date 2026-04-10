import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { X, Calendar, DollarSign } from "lucide-react";
import { toast } from "sonner";
import { differenceInDays, format } from "date-fns";

export default function DashboardSavedScholarships() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: saved, isLoading } = useQuery({
    queryKey: ["saved-scholarships-full", user?.id],
    queryFn: async () => {
      const { data: savedItems } = await supabase
        .from("saved_scholarships")
        .select("scholarship_id")
        .eq("user_id", user!.id);
      if (!savedItems?.length) return [];
      const ids = savedItems.map(s => s.scholarship_id).filter(Boolean) as string[];
      const { data } = await supabase
        .from("scholarships")
        .select("id, name, organization, slug, amount_min, amount_max, deadline, is_renewable")
        .in("id", ids)
        .order("deadline");
      return data ?? [];
    },
    enabled: !!user,
  });

  const remove = async (id: string) => {
    await supabase.from("saved_scholarships").delete().eq("user_id", user!.id).eq("scholarship_id", id);
    queryClient.invalidateQueries({ queryKey: ["saved-scholarships-full"] });
    toast.success("Removed");
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-[hsl(var(--navy))]">Saved Scholarships</h1>
        {[1,2,3].map(i => <Skeleton key={i} className="h-20 w-full" />)}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-[hsl(var(--navy))]">Saved Scholarships</h1>

      {!saved?.length ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">
          No saved scholarships yet. <Link to="/scholarships" className="text-[hsl(var(--primary))] hover:underline">Browse scholarships →</Link>
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {saved.map(s => {
            const daysLeft = s.deadline ? differenceInDays(new Date(s.deadline), new Date()) : null;
            return (
              <Card key={s.id} className="hover:border-[hsl(var(--sky))] transition-colors">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <Link to={`/scholarships/${s.slug}`} className="font-semibold text-sm text-[hsl(var(--navy))] hover:text-[hsl(var(--primary))] transition-colors">
                      {s.name}
                    </Link>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                      <span>{s.organization}</span>
                      {s.amount_max && (
                        <span className="flex items-center gap-1 text-[hsl(var(--gold))] font-semibold">
                          <DollarSign className="h-3 w-3" />${s.amount_max.toLocaleString()}
                        </span>
                      )}
                      {s.is_renewable && <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">Renewable</Badge>}
                      {s.deadline && (
                        <span className={`flex items-center gap-1 ${daysLeft !== null && daysLeft < 14 ? "text-destructive font-semibold" : ""}`}>
                          <Calendar className="h-3 w-3" />
                          {daysLeft !== null && daysLeft >= 0 ? `${daysLeft} days left` : format(new Date(s.deadline), "MMM d, yyyy")}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => remove(s.id)} className="text-muted-foreground hover:text-destructive shrink-0">
                    <X className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
