import { useState } from "react";
import { MapPin, Star, Heart, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AdminEditButton } from "@/components/admin/AdminEditButton";
import { SchoolEditModal } from "@/components/admin/SchoolEditModal";
import type { Tables } from "@/integrations/supabase/types";

type School = Tables<"schools">;

export function SchoolHero({ school }: { school: School }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editOpen, setEditOpen] = useState(false);

  const { data: isSaved } = useQuery({
    queryKey: ["saved-school", school.id, user?.id],
    queryFn: async () => {
      if (!user) return false;
      const { data } = await supabase
        .from("saved_schools")
        .select("id")
        .eq("user_id", user.id)
        .eq("school_id", school.id)
        .maybeSingle();
      return !!data;
    },
    enabled: !!user,
  });

  const toggleSave = async () => {
    if (!user) { toast.error("Sign in to save schools"); return; }
    if (isSaved) {
      await supabase.from("saved_schools").delete().eq("user_id", user.id).eq("school_id", school.id);
    } else {
      await supabase.from("saved_schools").insert({ user_id: user.id, school_id: school.id });
    }
    queryClient.invalidateQueries({ queryKey: ["saved-school", school.id] });
  };

  const scrollToContact = () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });

  const partnerships: string[] = [];
  if (school.skywest_elite) partnerships.push("SkyWest Elite");
  if (school.united_aviate) partnerships.push("United Aviate");
  if (school.delta_propel) partnerships.push("Delta Propel");
  if (school.southwest_d225) partnerships.push("SW D225");

  return (
    <>
      <div className="relative w-full h-[250px] md:h-[400px] overflow-hidden">
        {school.hero_image_url ? (
          <img src={school.hero_image_url} alt={school.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[hsl(var(--navy))] to-[hsl(var(--primary))]" />
        )}
        <div className="absolute inset-0 bg-black/50" />

        {school.is_featured && (
          <Badge className="absolute top-4 right-4 bg-accent text-accent-foreground">Featured</Badge>
        )}

        <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-10 text-white">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-4xl font-bold mb-1">{school.name}</h1>
            <AdminEditButton onClick={() => setEditOpen(true)} className="border-white/40 text-white hover:bg-white/20" />
          </div>
          <p className="text-sm md:text-lg opacity-90 flex items-center gap-1 mb-2">
            <MapPin className="w-4 h-4" /> {school.city}, {school.state}
          </p>
          {school.aviatorpath_rating && (
            <div className="flex items-center gap-2 mb-3">
              <div className="flex items-center gap-1 text-accent">
                <Star className="w-4 h-4 fill-current" />
                <span className="font-semibold">{Number(school.aviatorpath_rating).toFixed(1)}</span>
              </div>
              <span className="text-sm opacity-75">({school.aviatorpath_review_count || 0} reviews)</span>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            {school.part_type && <Badge variant="secondary" className="bg-white/20 text-white border-0">{school.part_type === "both" ? "Part 61 & 141" : `Part ${school.part_type}`}</Badge>}
            {school.has_g1000 && <Badge variant="secondary" className="bg-white/20 text-white border-0">G1000</Badge>}
            {partnerships.map(p => <Badge key={p} variant="secondary" className="bg-white/20 text-white border-0">{p}</Badge>)}
            {school.is_claimed && <Badge variant="secondary" className="bg-white/20 text-white border-0">✓ Verified</Badge>}
          </div>
        </div>

        <div className="absolute top-4 right-4 md:top-6 md:right-6 flex gap-2">
          {school.website && (
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <a href={school.website} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" /> Visit Website
              </a>
            </Button>
          )}
          <Button onClick={scrollToContact} variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20">Get School Info</Button>
          <Button variant="outline" onClick={toggleSave} className="bg-white/10 border-white text-white hover:bg-white/20">
            <Heart className={`w-4 h-4 ${isSaved ? "fill-current text-red-400" : ""}`} />
          </Button>
        </div>
      </div>

      <SchoolEditModal school={school} open={editOpen} onOpenChange={setEditOpen} />
    </>
  );
}
