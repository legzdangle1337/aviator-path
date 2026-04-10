import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Save, Camera, Crown, AlertTriangle } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

interface Props {
  profile: Tables<"profiles"> | null | undefined;
}

const PILOT_STAGES = ["Researching", "Student Pilot", "PPL Holder", "Instrument Rated", "Commercial Pilot", "CFI", "ATP"];
const TIMELINES = ["ASAP", "Within 6 months", "6-12 months", "1-2 years", "Just exploring"];
const US_STATES = ["AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"];

export default function DashboardSettings({ profile }: Props) {
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    pilot_stage: "",
    target_airline: "",
    home_state: "",
    target_timeline: "",
    notification_new_jobs: true,
    notification_scholarships: true,
    notification_newsletter: true,
  });
  const [saving, setSaving] = useState(false);
  const [deleteText, setDeleteText] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        first_name: profile.first_name ?? "",
        last_name: profile.last_name ?? "",
        pilot_stage: profile.pilot_stage ?? "",
        target_airline: profile.target_airline ?? "",
        home_state: profile.home_state ?? "",
        target_timeline: profile.target_timeline ?? "",
        notification_new_jobs: profile.notification_new_jobs ?? true,
        notification_scholarships: profile.notification_scholarships ?? true,
        notification_newsletter: profile.notification_newsletter ?? true,
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update(form).eq("id", user.id);
    setSaving(false);
    if (error) { toast.error("Failed to save"); return; }
    toast.success("Settings saved!");
    queryClient.invalidateQueries({ queryKey: ["profile"] });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (uploadError) { toast.error("Upload failed"); setUploading(false); return; }
    const { data: { publicUrl } } = supabase.storage.from("avatars").getPublicUrl(path);
    await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", user.id);
    queryClient.invalidateQueries({ queryKey: ["profile"] });
    setUploading(false);
    toast.success("Photo updated!");
  };

  const handleDeleteAccount = async () => {
    if (deleteText !== "DELETE") return;
    toast.error("Account deletion requires contacting support.");
  };

  const initials = `${(form.first_name || "")[0] || ""}${(form.last_name || "")[0] || ""}`.toUpperCase() || "U";

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-[hsl(var(--navy))]">Account Settings</h1>

      {/* Avatar */}
      <Card>
        <CardContent className="p-6 flex items-center gap-6">
          <div className="relative">
            <Avatar className="h-24 w-24">
              <AvatarImage src={profile?.avatar_url || undefined} />
              <AvatarFallback className="bg-[hsl(var(--navy))] text-primary-foreground text-2xl">{initials}</AvatarFallback>
            </Avatar>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-0 right-0 bg-[hsl(var(--primary))] text-primary-foreground rounded-full p-1.5 hover:opacity-90"
              disabled={uploading}
            >
              <Camera className="h-4 w-4" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
          </div>
          <div>
            <p className="font-semibold text-lg">{form.first_name || "Your"} {form.last_name || "Name"}</p>
            <p className="text-sm text-muted-foreground">{user?.email}</p>
            {uploading && <p className="text-xs text-[hsl(var(--gold))] mt-1">Uploading...</p>}
          </div>
        </CardContent>
      </Card>

      {/* Personal info */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Personal Info</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>First Name</Label>
              <Input value={form.first_name} onChange={e => setForm(f => ({ ...f, first_name: e.target.value }))} className="mt-1" />
            </div>
            <div>
              <Label>Last Name</Label>
              <Input value={form.last_name} onChange={e => setForm(f => ({ ...f, last_name: e.target.value }))} className="mt-1" />
            </div>
          </div>
          <div>
            <Label>Email</Label>
            <Input value={user?.email ?? ""} disabled className="mt-1 opacity-60" />
          </div>
        </CardContent>
      </Card>

      {/* Aviation profile */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Aviation Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label>Pilot Stage</Label>
              <Select value={form.pilot_stage} onValueChange={v => setForm(f => ({ ...f, pilot_stage: v }))}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select stage" /></SelectTrigger>
                <SelectContent>
                  {PILOT_STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Target Airline</Label>
              <Input value={form.target_airline} onChange={e => setForm(f => ({ ...f, target_airline: e.target.value }))} placeholder="e.g., United Airlines" className="mt-1" />
            </div>
            <div>
              <Label>Home State</Label>
              <Select value={form.home_state} onValueChange={v => setForm(f => ({ ...f, home_state: v }))}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select state" /></SelectTrigger>
                <SelectContent>
                  {US_STATES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Training Timeline</Label>
              <Select value={form.target_timeline} onValueChange={v => setForm(f => ({ ...f, target_timeline: v }))}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select timeline" /></SelectTrigger>
                <SelectContent>
                  {TIMELINES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Notifications</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: "notification_new_jobs" as const, label: "New jobs matching my hours" },
            { key: "notification_scholarships" as const, label: "Scholarship deadline reminders" },
            { key: "notification_newsletter" as const, label: "Weekly newsletter" },
          ].map(n => (
            <div key={n.key} className="flex items-center justify-between">
              <Label className="text-sm">{n.label}</Label>
              <Switch checked={form[n.key]} onCheckedChange={v => setForm(f => ({ ...f, [n.key]: v }))} />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card>
        <CardHeader><CardTitle className="text-lg">Subscription</CardTitle></CardHeader>
        <CardContent>
          {profile?.is_pro ? (
            <div className="flex items-center gap-3">
              <Badge className="bg-[hsl(var(--gold))] text-[hsl(var(--gold-foreground))]"><Crown className="h-3 w-3 mr-1" /> Pro</Badge>
              <span className="text-sm text-muted-foreground">Active since {profile.pro_since ? new Date(profile.pro_since).toLocaleDateString() : "—"}</span>
            </div>
          ) : (
            <div className="text-center py-4">
              <Badge variant="secondary" className="mb-3">Free Plan</Badge>
              <p className="text-sm text-muted-foreground mb-4">Upgrade to Pro for advanced features, priority alerts, and more</p>
              <Button className="bg-[hsl(var(--gold))] hover:bg-[hsl(var(--gold))]/90 text-[hsl(var(--gold-foreground))]">
                <Crown className="h-4 w-4 mr-2" /> Upgrade to Pro
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Save */}
      <Button onClick={handleSave} disabled={saving} size="lg" className="w-full bg-[hsl(var(--primary))]">
        <Save className="h-4 w-4 mr-2" />{saving ? "Saving..." : "Save Changes"}
      </Button>

      {/* Danger zone */}
      <Card className="border-destructive/30">
        <CardHeader><CardTitle className="text-lg text-destructive flex items-center gap-2"><AlertTriangle className="h-5 w-5" /> Danger Zone</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">Once you delete your account, there is no going back. Type <strong>DELETE</strong> to confirm.</p>
          <div className="flex gap-3">
            <Input value={deleteText} onChange={e => setDeleteText(e.target.value)} placeholder='Type "DELETE"' className="max-w-xs" />
            <Button variant="destructive" disabled={deleteText !== "DELETE"} onClick={handleDeleteAccount}>Delete Account</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
