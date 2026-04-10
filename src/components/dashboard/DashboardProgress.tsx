import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Save, Plane, Award, Target, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import type { Tables } from "@/integrations/supabase/types";

interface Props {
  profile: Tables<"profiles"> | null | undefined;
}

const HOUR_FIELDS = [
  { key: "total_hours", label: "Total Hours" },
  { key: "pic_hours", label: "PIC Hours" },
  { key: "instrument_hours_actual", label: "Instrument Actual" },
  { key: "instrument_hours_simulated", label: "Instrument Simulated" },
  { key: "night_hours", label: "Night Hours" },
  { key: "cross_country_hours", label: "Cross-Country" },
  { key: "complex_hours", label: "Complex Aircraft" },
  { key: "turbine_hours", label: "Turbine" },
  { key: "multi_engine_hours", label: "Multi-Engine" },
] as const;

const CERTIFICATES = [
  "Student Pilot Certificate",
  "Private Pilot License (PPL)",
  "Instrument Rating (IR)",
  "Commercial Pilot License (CPL)",
  "Certified Flight Instructor (CFI)",
  "CFII (Instrument)",
  "MEI (Multi-Engine)",
  "ATP Certificate",
];

const MILESTONES = [
  { label: "PPL Minimums", key: "total_hours" as const, target: 40 },
  { label: "Instrument (50 hrs instrument)", key: "instrument_hours_actual" as const, target: 50 },
  { label: "Commercial (250 hrs total)", key: "total_hours" as const, target: 250 },
  { label: "CFI Eligible", key: "total_hours" as const, target: 250 },
  { label: "R-ATP (1,000 hrs)", key: "total_hours" as const, target: 1000 },
  { label: "ATP (1,500 hrs)", key: "total_hours" as const, target: 1500 },
];

export default function DashboardProgress({ profile }: Props) {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [hours, setHours] = useState<Record<string, number>>({});
  const [certs, setCerts] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      const h: Record<string, number> = {};
      HOUR_FIELDS.forEach(f => { h[f.key] = (profile as any)[f.key] ?? 0; });
      setHours(h);
      setCerts(profile.current_certificates ?? []);
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      ...hours,
      current_certificates: certs,
    } as any).eq("id", user.id);
    setSaving(false);
    if (error) { toast.error("Failed to save"); return; }
    toast.success("Progress saved!");
    queryClient.invalidateQueries({ queryKey: ["profile"] });
  };

  const toggleCert = (cert: string) => {
    setCerts(prev => prev.includes(cert) ? prev.filter(c => c !== cert) : [...prev, cert]);
  };

  // Qualifying jobs
  const { data: qualifyingJobs } = useQuery({
    queryKey: ["qualifying-jobs-list", profile?.total_hours],
    queryFn: async () => {
      const h = profile?.total_hours ?? 0;
      const { data } = await supabase
        .from("jobs")
        .select("id, job_title, company_name, slug, min_total_hours, location")
        .eq("is_active", true)
        .or(`min_total_hours.is.null,min_total_hours.lte.${h}`)
        .order("posted_date", { ascending: false })
        .limit(5);
      return data ?? [];
    },
    enabled: !!profile,
  });

  const { data: almostJobs } = useQuery({
    queryKey: ["almost-jobs", profile?.total_hours],
    queryFn: async () => {
      const h = profile?.total_hours ?? 0;
      const { data } = await supabase
        .from("jobs")
        .select("id, job_title, company_name, slug, min_total_hours")
        .eq("is_active", true)
        .gt("min_total_hours", h)
        .lte("min_total_hours", h + 300)
        .order("min_total_hours")
        .limit(5);
      return data ?? [];
    },
    enabled: !!profile,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[hsl(var(--navy))]">Your Flight Hours</h1>
        <Button onClick={handleSave} disabled={saving} className="bg-[hsl(var(--gold))] hover:bg-[hsl(var(--gold))]/90 text-[hsl(var(--gold-foreground))]">
          <Save className="h-4 w-4 mr-2" />{saving ? "Saving..." : "Save Hours"}
        </Button>
      </div>

      {/* Hour tracker */}
      <Card>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Plane className="h-5 w-5 text-[hsl(var(--gold))]" /> Hour Tracker</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {HOUR_FIELDS.map(f => (
              <div key={f.key}>
                <Label className="text-xs">{f.label}</Label>
                <Input
                  type="number" min={0}
                  value={hours[f.key] ?? 0}
                  onChange={e => setHours(prev => ({ ...prev, [f.key]: Number(e.target.value) || 0 }))}
                  className="mt-1"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Certificates */}
      <Card>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Award className="h-5 w-5 text-[hsl(var(--gold))]" /> Certificates Earned</CardTitle></CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-3">
            {CERTIFICATES.map(cert => (
              <label key={cert} className="flex items-center gap-3 cursor-pointer">
                <Checkbox checked={certs.includes(cert)} onCheckedChange={() => toggleCert(cert)} />
                <span className="text-sm">{cert}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Target className="h-5 w-5 text-[hsl(var(--gold))]" /> Milestone Progress</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {MILESTONES.map(m => {
            const current = (hours[m.key] ?? 0);
            const pct = Math.min(100, Math.round((current / m.target) * 100));
            return (
              <div key={m.label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium">{m.label}</span>
                  <span className="text-muted-foreground">{current}/{m.target} hrs</span>
                </div>
                <Progress value={pct} className="h-2.5" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Qualifying jobs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-[hsl(var(--gold))]" /> Jobs I Qualify For
          </CardTitle>
          <p className="text-sm text-muted-foreground">You qualify for {qualifyingJobs?.length ?? 0}+ jobs right now</p>
        </CardHeader>
        <CardContent>
          {qualifyingJobs?.length ? (
            <ul className="space-y-2">
              {qualifyingJobs.map(j => (
                <li key={j.id}>
                  <Link to={`/jobs/${j.slug}`} className="flex items-center justify-between p-3 border rounded-lg hover:border-[hsl(var(--sky))] transition-colors">
                    <div>
                      <p className="font-medium text-sm text-[hsl(var(--navy))]">{j.job_title}</p>
                      <p className="text-xs text-muted-foreground">{j.company_name} • {j.location}</p>
                    </div>
                    {j.min_total_hours && <Badge variant="secondary" className="text-xs">{j.min_total_hours} hrs</Badge>}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No matching jobs found. Update your hours above.</p>
          )}
        </CardContent>
      </Card>

      {/* Almost there */}
      {almostJobs && almostJobs.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-[hsl(var(--gold))]">Almost There!</CardTitle>
            <p className="text-sm text-muted-foreground">You're within 300 hours of qualifying for these</p>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {almostJobs.map(j => (
                <li key={j.id}>
                  <Link to={`/jobs/${j.slug}`} className="flex items-center justify-between p-3 border rounded-lg hover:border-[hsl(var(--gold))] transition-colors">
                    <div>
                      <p className="font-medium text-sm text-[hsl(var(--navy))]">{j.job_title}</p>
                      <p className="text-xs text-muted-foreground">{j.company_name}</p>
                    </div>
                    <Badge className="bg-[hsl(var(--gold))]/10 text-[hsl(var(--gold))] border-[hsl(var(--gold))]/30 text-xs">
                      {(j.min_total_hours ?? 0) - (profile?.total_hours ?? 0)} hrs to go
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
