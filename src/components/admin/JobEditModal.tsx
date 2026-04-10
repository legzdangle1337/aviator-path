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

type Job = Tables<"jobs">;

interface Props {
  job?: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isNew?: boolean;
}

const emptyJob: Partial<Job> = {
  job_title: "", company_name: "", slug: "", application_url: "", is_active: true,
};

export function JobEditModal({ job, open, onOpenChange, isNew }: Props) {
  const queryClient = useQueryClient();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Partial<Job>>(job ? { ...job } : { ...emptyJob });

  const set = (key: keyof Job, value: any) => setForm(prev => ({ ...prev, [key]: value }));

  const save = async () => {
    setSaving(true);
    let error;
    if (isNew) {
      const res = await supabase.from("jobs").insert(form as any);
      error = res.error;
    } else {
      const res = await supabase.from("jobs").update(form).eq("id", job!.id);
      error = res.error;
    }
    setSaving(false);
    if (error) {
      toast.error("Failed to save: " + error.message);
    } else {
      toast.success(isNew ? "Job created!" : "Job updated!");
      queryClient.invalidateQueries({ queryKey: ["admin-jobs"] });
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isNew ? "Add New Job" : `Edit: ${job?.job_title}`}</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic">
          <TabsList className="w-full flex-wrap h-auto">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="requirements">Requirements</TabsTrigger>
            <TabsTrigger value="compensation">Compensation</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 mt-4">
            <Field label="Job Title" value={form.job_title} onChange={v => set("job_title", v)} />
            <Field label="Slug" value={form.slug} onChange={v => set("slug", v)} />
            <Field label="Company Name" value={form.company_name} onChange={v => set("company_name", v)} />
            <Field label="Company Website" value={form.company_website} onChange={v => set("company_website", v)} />
            <Field label="Company Logo URL" value={form.company_logo_url} onChange={v => set("company_logo_url", v)} />
            <Field label="Location" value={form.location} onChange={v => set("location", v)} />
            <Field label="Job Type" value={form.job_type} onChange={v => set("job_type", v)} />
            <Field label="Application URL" value={form.application_url} onChange={v => set("application_url", v)} />
            <FieldTextarea label="Description" value={form.description} onChange={v => set("description", v)} rows={5} />
            <FieldTextarea label="Requirements" value={form.requirements} onChange={v => set("requirements", v)} />
            <FieldTextarea label="Benefits" value={form.benefits} onChange={v => set("benefits", v)} />
            <div className="flex items-center gap-6">
              <SwitchField label="Active" checked={form.is_active !== false} onChange={v => set("is_active", v)} />
              <SwitchField label="Featured" checked={!!form.is_featured} onChange={v => set("is_featured", v)} />
              <SwitchField label="Remote" checked={!!form.is_remote} onChange={v => set("is_remote", v)} />
            </div>
          </TabsContent>

          <TabsContent value="requirements" className="space-y-4 mt-4">
            <FieldNumber label="Min Total Hours" value={form.min_total_hours} onChange={v => set("min_total_hours", v)} />
            <FieldNumber label="Min PIC Hours" value={form.min_pic_hours} onChange={v => set("min_pic_hours", v)} />
            <FieldNumber label="Min Multi Hours" value={form.min_multi_hours} onChange={v => set("min_multi_hours", v)} />
            <FieldNumber label="Min Turbine Hours" value={form.min_turbine_hours} onChange={v => set("min_turbine_hours", v)} />
            <FieldNumber label="Min Instrument Hours" value={form.min_instrument_hours} onChange={v => set("min_instrument_hours", v)} />
            <FieldNumber label="Min Night Hours" value={form.min_night_hours} onChange={v => set("min_night_hours", v)} />
            <FieldNumber label="Min Cross-Country Hours" value={form.min_cross_country_hours} onChange={v => set("min_cross_country_hours", v)} />
            <Field label="Type Rating Required" value={form.type_rating_required} onChange={v => set("type_rating_required", v)} />
          </TabsContent>

          <TabsContent value="compensation" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-3">
              <FieldNumber label="Salary Min" value={form.salary_min} onChange={v => set("salary_min", v)} />
              <FieldNumber label="Salary Max" value={form.salary_max} onChange={v => set("salary_max", v)} />
            </div>
            <Field label="Salary Type (hourly/annual)" value={form.salary_type} onChange={v => set("salary_type", v)} />
            <FieldNumber label="Signing Bonus" value={form.signing_bonus} onChange={v => set("signing_bonus", v)} />
            <FieldNumber label="Tuition Reimbursement" value={form.tuition_reimbursement} onChange={v => set("tuition_reimbursement", v)} />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving…" : isNew ? "Create Job" : "Save Changes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

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
