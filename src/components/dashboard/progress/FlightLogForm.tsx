import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Plus } from "lucide-react";

const FLIGHT_TYPES = [
  { value: "dual", label: "Dual (with instructor)" },
  { value: "solo", label: "Solo" },
  { value: "pic", label: "PIC" },
  { value: "night", label: "Night" },
  { value: "instrument", label: "Instrument (actual)" },
  { value: "simulated_instrument", label: "Simulated Instrument" },
  { value: "cross_country", label: "Cross-Country" },
  { value: "multi_engine", label: "Multi-Engine" },
];

interface Props {
  onSaved: () => void;
}

export default function FlightLogForm({ onSaved }: Props) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [flightType, setFlightType] = useState("");
  const [hours, setHours] = useState("");
  const [aircraft, setAircraft] = useState("");
  const [notes, setNotes] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !flightType || !hours) return;

    setSaving(true);
    const { error } = await supabase.from("flight_logs").insert({
      user_id: user.id,
      date,
      flight_type: flightType,
      hours: parseFloat(hours),
      aircraft: aircraft || null,
      notes: notes || null,
    });
    setSaving(false);

    if (error) {
      toast.error("Failed to save flight log");
      return;
    }

    toast.success("Flight logged!");
    setFlightType("");
    setHours("");
    setAircraft("");
    setNotes("");
    onSaved();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Plus className="h-5 w-5 text-[hsl(var(--gold))]" /> Log a Flight
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <Label className="text-xs">Date</Label>
              <Input type="date" value={date} onChange={e => setDate(e.target.value)} className="mt-1" required />
            </div>
            <div>
              <Label className="text-xs">Flight Type</Label>
              <Select value={flightType} onValueChange={setFlightType} required>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select..." /></SelectTrigger>
                <SelectContent>
                  {FLIGHT_TYPES.map(t => (
                    <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Hours</Label>
              <Input type="number" min={0.1} step={0.1} value={hours} onChange={e => setHours(e.target.value)} placeholder="1.5" className="mt-1" required />
            </div>
            <div>
              <Label className="text-xs">Aircraft</Label>
              <Input value={aircraft} onChange={e => setAircraft(e.target.value)} placeholder="C172" className="mt-1" />
            </div>
          </div>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label className="text-xs">Notes (optional)</Label>
              <Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Pattern work, XC to KJFK..." className="mt-1 h-10 min-h-[40px]" />
            </div>
            <Button type="submit" disabled={saving || !flightType || !hours} className="bg-[hsl(var(--gold))] hover:bg-[hsl(var(--gold))]/90 text-[hsl(var(--gold-foreground))]">
              {saving ? "Saving..." : "Log Flight"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
