import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type School = Tables<"schools">;

interface Props {
  school: School;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: string;
}

export function SchoolEditModal({ school, open, onOpenChange, defaultTab = "basic" }: Props) {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<School>>({ ...school });

  const set = (key: keyof School, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const save = async () => {
    setSaving(true);
    const { error } = await supabase.from("schools").update(form).eq("id", school.id);
    setSaving(false);
    if (error) {
      toast.error("Failed to save: " + error.message);
    } else {
      toast.success("School updated!");
      queryClient.invalidateQueries({ queryKey: ["school"] });
      queryClient.invalidateQueries({ queryKey: ["schools"] });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit: {school.name}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue={defaultTab}>
          <TabsList className="w-full flex-wrap h-auto">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="location">Location</TabsTrigger>
            <TabsTrigger value="costs">Costs</TabsTrigger>
            <TabsTrigger value="fleet">Fleet</TabsTrigger>
            <TabsTrigger value="partnerships">Partnerships</TabsTrigger>
            <TabsTrigger value="financing">Financing</TabsTrigger>
            <TabsTrigger value="meta">Meta</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <Field label="Name" value={form.name} onChange={v => set("name", v)} />
            <Field label="Slug" value={form.slug} onChange={v => set("slug", v)} />
            <FieldTextarea label="Short Description" value={form.description} onChange={v => set("description", v)} />
            <FieldTextarea label="Long Description" value={form.long_description} onChange={v => set("long_description", v)} rows={6} />
            <FieldTextarea label="Editor's Note" value={form.editors_note} onChange={v => set("editors_note", v)} />
            <Field label="Website" value={form.website} onChange={v => set("website", v)} />
            <Field label="Phone" value={form.phone} onChange={v => set("phone", v)} />
            <Field label="Email" value={form.email} onChange={v => set("email", v)} />
            <div className="flex items-center gap-6 flex-wrap">
              <SwitchField label="Editor's Pick" checked={!!form.editors_pick} onChange={v => set("editors_pick", v)} />
              <SwitchField label="Featured" checked={!!form.is_featured} onChange={v => set("is_featured", v)} />
              <SwitchField label="Active" checked={form.is_active !== false} onChange={v => set("is_active", v)} />
              <SwitchField label="Claimed" checked={!!form.is_claimed} onChange={v => set("is_claimed", v)} />
            </div>
            <Field label="Part Type (61 / 141 / both)" value={form.part_type} onChange={v => set("part_type", v)} />
          </TabsContent>

          <TabsContent value="location" className="space-y-4 mt-4">
            <Field label="Address" value={form.address} onChange={v => set("address", v)} />
            <div className="grid grid-cols-3 gap-3">
              <Field label="City" value={form.city} onChange={v => set("city", v)} />
              <Field label="State" value={form.state} onChange={v => set("state", v)} />
              <Field label="Zip" value={form.zip} onChange={v => set("zip", v)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FieldNumber label="Latitude" value={form.latitude} onChange={v => set("latitude", v)} />
              <FieldNumber label="Longitude" value={form.longitude} onChange={v => set("longitude", v)} />
            </div>
            <FieldNumber label="VFR Days/Year" value={form.vfr_days_per_year} onChange={v => set("vfr_days_per_year", v)} />
          </TabsContent>

          <TabsContent value="costs" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <FieldNumber label="Advertised Cost Min" value={form.advertised_cost_min} onChange={v => set("advertised_cost_min", v)} />
              <FieldNumber label="Advertised Cost Max" value={form.advertised_cost_max} onChange={v => set("advertised_cost_max", v)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FieldNumber label="True Cost Min" value={form.true_cost_min} onChange={v => set("true_cost_min", v)} />
              <FieldNumber label="True Cost Max" value={form.true_cost_max} onChange={v => set("true_cost_max", v)} />
            </div>
            <FieldTextarea label="Cost Notes" value={form.cost_notes} onChange={v => set("cost_notes", v)} />
            <div className="grid grid-cols-2 gap-3">
              <FieldNumber label="Timeline Min (months)" value={form.timeline_months_min} onChange={v => set("timeline_months_min", v)} />
              <FieldNumber label="Timeline Max (months)" value={form.timeline_months_max} onChange={v => set("timeline_months_max", v)} />
            </div>
            <SwitchField label="Housing Available" checked={!!form.housing_available} onChange={v => set("housing_available", v)} />
            <FieldNumber label="Housing Cost/Month" value={form.housing_cost_monthly} onChange={v => set("housing_cost_monthly", v)} />
            <Field label="Housing Notes" value={form.housing_notes} onChange={v => set("housing_notes", v)} />
          </TabsContent>

          <TabsContent value="fleet" className="space-y-4 mt-4">
            <FieldNumber label="Total Aircraft" value={form.total_aircraft} onChange={v => set("total_aircraft", v)} />
            <Field label="Aircraft Types (comma-separated)" value={(form.aircraft_types ?? []).join(", ")} onChange={v => set("aircraft_types", v.split(",").map(s => s.trim()).filter(Boolean))} />
            <div className="flex items-center gap-6 flex-wrap">
              <SwitchField label="G1000" checked={!!form.has_g1000} onChange={v => set("has_g1000", v)} />
              <SwitchField label="TAA" checked={!!form.has_taa} onChange={v => set("has_taa", v)} />
              <SwitchField label="Multi-Engine" checked={!!form.has_multi_engine} onChange={v => set("has_multi_engine", v)} />
              <SwitchField label="Simulator" checked={!!form.has_simulator} onChange={v => set("has_simulator", v)} />
            </div>
            <Field label="Simulator Types" value={form.simulator_types} onChange={v => set("simulator_types", v)} />
          </TabsContent>

          <TabsContent value="partnerships" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <SwitchField label="SkyWest Elite" checked={!!form.skywest_elite} onChange={v => set("skywest_elite", v)} />
              <SwitchField label="United Aviate" checked={!!form.united_aviate} onChange={v => set("united_aviate", v)} />
              <SwitchField label="Southwest D225" checked={!!form.southwest_d225} onChange={v => set("southwest_d225", v)} />
              <SwitchField label="Delta Propel" checked={!!form.delta_propel} onChange={v => set("delta_propel", v)} />
              <SwitchField label="Envoy Cadet" checked={!!form.envoy_cadet} onChange={v => set("envoy_cadet", v)} />
              <SwitchField label="GoJet Academy" checked={!!form.gojet_academy} onChange={v => set("gojet_academy", v)} />
              <SwitchField label="PSA Pathway" checked={!!form.psa_pathway} onChange={v => set("psa_pathway", v)} />
              <SwitchField label="Piedmont Pathway" checked={!!form.piedmont_pathway} onChange={v => set("piedmont_pathway", v)} />
              <SwitchField label="American Cadet" checked={!!form.american_cadet} onChange={v => set("american_cadet", v)} />
            </div>
            <Field label="Other Partnerships" value={form.other_partnerships} onChange={v => set("other_partnerships", v)} />
          </TabsContent>

          <TabsContent value="financing" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <SwitchField label="Stratus Financial" checked={!!form.financing_stratus} onChange={v => set("financing_stratus", v)} />
              <SwitchField label="Sallie Mae" checked={!!form.financing_sallie_mae} onChange={v => set("financing_sallie_mae", v)} />
              <SwitchField label="AOPA Finance" checked={!!form.financing_aopa} onChange={v => set("financing_aopa", v)} />
              <SwitchField label="Meritize" checked={!!form.financing_meritize} onChange={v => set("financing_meritize", v)} />
              <SwitchField label="Earnest" checked={!!form.financing_earnest} onChange={v => set("financing_earnest", v)} />
            </div>
            <Field label="CFI Pay Model" value={form.cfi_pay_model} onChange={v => set("cfi_pay_model", v)} />
            <FieldNumber label="CFI Starting Pay ($/hr)" value={form.cfi_starting_pay} onChange={v => set("cfi_starting_pay", v)} />
            <FieldNumber label="Student:CFI Ratio" value={form.student_to_cfi_ratio} onChange={v => set("student_to_cfi_ratio", v)} />
          </TabsContent>

          <TabsContent value="meta" className="space-y-4 mt-4">
            <Field label="Hero Image URL" value={form.hero_image_url} onChange={v => set("hero_image_url", v)} />
            <Field label="Logo URL" value={form.logo_url} onChange={v => set("logo_url", v)} />
            <Field label="Video URL" value={form.video_url} onChange={v => set("video_url", v)} />
            <Field label="Google Place ID" value={form.google_place_id} onChange={v => set("google_place_id", v)} />
            <Field label="FAA Cert Number" value={form.faa_cert_number} onChange={v => set("faa_cert_number", v)} />
            <Field label="FAA Cert Type" value={form.faa_cert_type} onChange={v => set("faa_cert_type", v)} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper components
function Field({ label, value, onChange }: { label: string; value?: string | null; onChange: (v: string) => void }) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input value={value ?? ""} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

function FieldNumber({ label, value, onChange }: { label: string; value?: number | null; onChange: (v: number | null) => void }) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Input type="number" value={value ?? ""} onChange={e => onChange(e.target.value ? Number(e.target.value) : null)} />
    </div>
  );
}

function FieldTextarea({ label, value, onChange, rows = 3 }: { label: string; value?: string | null; onChange: (v: string) => void; rows?: number }) {
  return (
    <div>
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <Textarea value={value ?? ""} onChange={e => onChange(e.target.value)} rows={rows} />
    </div>
  );
}

function SwitchField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center gap-2">
      <Switch checked={checked} onCheckedChange={onChange} />
      <Label className="text-sm">{label}</Label>
    </div>
  );
}
