import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link, useNavigate } from "react-router-dom";
import { X, Star, MapPin, DollarSign, GitCompare } from "lucide-react";
import { toast } from "sonner";

export default function DashboardSavedSchools() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string[]>([]);

  const { data: savedSchools, isLoading } = useQuery({
    queryKey: ["saved-schools-full", user?.id],
    queryFn: async () => {
      const { data: saved } = await supabase
        .from("saved_schools")
        .select("school_id, notes")
        .eq("user_id", user!.id);
      if (!saved?.length) return [];
      const ids = saved.map(s => s.school_id).filter(Boolean) as string[];
      const { data: schools } = await supabase
        .from("schools")
        .select("id, name, slug, city, state, advertised_cost_min, advertised_cost_max, airline_partnerships, google_rating")
        .in("id", ids);
      return (schools ?? []).map(s => ({
        ...s,
        notes: saved.find(sv => sv.school_id === s.id)?.notes ?? "",
      }));
    },
    enabled: !!user,
  });

  const removeSaved = async (schoolId: string) => {
    await supabase.from("saved_schools").delete().eq("user_id", user!.id).eq("school_id", schoolId);
    queryClient.invalidateQueries({ queryKey: ["saved-schools-full"] });
    toast.success("Removed");
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-[hsl(var(--navy))]">Saved Schools</h1>
        {[1,2,3].map(i => <Skeleton key={i} className="h-24 w-full" />)}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[hsl(var(--navy))]">Saved Schools</h1>
        {selected.length >= 2 && (
          <Button onClick={() => navigate(`/compare?ids=${selected.join(",")}`)} className="bg-[hsl(var(--primary))]">
            <GitCompare className="h-4 w-4 mr-2" /> Compare ({selected.length})
          </Button>
        )}
      </div>

      {!savedSchools?.length ? (
        <Card><CardContent className="p-8 text-center text-muted-foreground">
          No saved schools yet. <Link to="/schools" className="text-[hsl(var(--primary))] hover:underline">Browse schools →</Link>
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {savedSchools.map(school => (
            <Card key={school.id} className="hover:border-[hsl(var(--sky))] transition-colors">
              <CardContent className="p-4 flex items-start gap-3">
                <Checkbox
                  checked={selected.includes(school.id)}
                  onCheckedChange={() => toggleSelect(school.id)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <Link to={`/schools/${school.slug}`} className="font-semibold text-[hsl(var(--navy))] hover:text-[hsl(var(--primary))] transition-colors">
                    {school.name}
                  </Link>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{school.city}, {school.state}</span>
                    {school.google_rating && <span className="flex items-center gap-1"><Star className="h-3 w-3 text-[hsl(var(--gold))]" />{school.google_rating}</span>}
                    {school.advertised_cost_min && (
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        ${(school.advertised_cost_min / 1000).toFixed(0)}k–${((school.advertised_cost_max ?? school.advertised_cost_min) / 1000).toFixed(0)}k
                      </span>
                    )}
                  </div>
                  {school.airline_partnerships?.length ? (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {school.airline_partnerships.slice(0, 3).map(p => (
                        <Badge key={p} variant="secondary" className="text-xs">{p}</Badge>
                      ))}
                    </div>
                  ) : null}
                </div>
                <Button variant="ghost" size="icon" onClick={() => removeSaved(school.id)} className="text-muted-foreground hover:text-destructive shrink-0">
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
