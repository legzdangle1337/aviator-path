import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { CheckCircle } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type School = Tables<"schools">;

const CERTS = ["PPL", "Instrument", "Commercial", "CFI", "Full ATP"];
const TIMELINES = ["ASAP", "1-3 months", "3-6 months", "6+ months"];
const FINANCING = ["Have savings", "Need financing", "Have scholarship", "Not sure yet"];

export function SchoolContact({ school }: { school: School }) {
  const { user } = useAuth();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    certs: [] as string[], timeline: "", financing: "", message: "",
    lenderConsent: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName || !form.email) { toast.error("Name and email are required."); return; }
    setLoading(true);
    const { error } = await supabase.from("school_inquiries").insert({
      school_id: school.id,
      user_id: user?.id ?? null,
      name: `${form.firstName} ${form.lastName}`.trim(),
      email: form.email,
      phone: form.phone || null,
      certificates_interested: form.certs,
      training_timeline: form.timeline || null,
      financing_status: form.financing || null,
      message: form.message || null,
      opted_into_lender_contact: form.lenderConsent,
    });
    setLoading(false);
    if (error) { toast.error("Failed to send. Please try again."); return; }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section id="contact" className="scroll-mt-20 text-center py-12">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-foreground mb-2">Your inquiry has been sent!</h3>
        <p className="text-muted-foreground">{school.name} typically responds within 2 business days. Check your email for a confirmation.</p>
      </section>
    );
  }

  return (
    <section id="contact" className="scroll-mt-20">
      <h2 className="text-2xl font-bold text-foreground mb-6">Request Information</h2>
      <form onSubmit={handleSubmit} className="border rounded-xl p-6 bg-card space-y-4 max-w-2xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input placeholder="First Name *" value={form.firstName} onChange={e => setForm(f => ({ ...f, firstName: e.target.value }))} required />
          <Input placeholder="Last Name" value={form.lastName} onChange={e => setForm(f => ({ ...f, lastName: e.target.value }))} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input type="email" placeholder="Email *" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          <Input type="tel" placeholder="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
        </div>

        <div>
          <p className="text-sm font-medium text-foreground mb-2">I'm interested in:</p>
          <div className="flex flex-wrap gap-3">
            {CERTS.map(c => (
              <label key={c} className="flex items-center gap-1.5 text-sm">
                <Checkbox
                  checked={form.certs.includes(c)}
                  onCheckedChange={checked => setForm(f => ({
                    ...f,
                    certs: checked ? [...f.certs, c] : f.certs.filter(x => x !== c),
                  }))}
                />
                {c}
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select value={form.timeline} onValueChange={v => setForm(f => ({ ...f, timeline: v }))}>
            <SelectTrigger><SelectValue placeholder="Looking to start..." /></SelectTrigger>
            <SelectContent>{TIMELINES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={form.financing} onValueChange={v => setForm(f => ({ ...f, financing: v }))}>
            <SelectTrigger><SelectValue placeholder="Financing situation..." /></SelectTrigger>
            <SelectContent>{FINANCING.map(f => <SelectItem key={f} value={f}>{f}</SelectItem>)}</SelectContent>
          </Select>
        </div>

        <Textarea placeholder="Message (optional)" value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} />

        <label className="flex items-start gap-2 text-sm text-muted-foreground">
          <Checkbox
            checked={form.lenderConsent}
            onCheckedChange={c => setForm(f => ({ ...f, lenderConsent: !!c }))}
            className="mt-0.5"
          />
          I'd like to receive information about flight training financing options
        </label>

        <Button type="submit" disabled={loading} className="w-full bg-accent text-accent-foreground hover:bg-accent/90 h-12 font-semibold">
          {loading ? "Sending..." : "Send My Request"}
        </Button>
      </form>
    </section>
  );
}
