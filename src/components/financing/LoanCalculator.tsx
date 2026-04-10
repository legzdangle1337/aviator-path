import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calculator } from "lucide-react";

function calcPayment(principal: number, annualRate: number, months: number) {
  if (annualRate === 0) return principal / months;
  const r = annualRate / 100 / 12;
  return (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
}

const TERMS = [
  { label: "5 years", months: 60 },
  { label: "7 years", months: 84 },
  { label: "10 years", months: 120 },
  { label: "15 years", months: 180 },
  { label: "20 years", months: 240 },
];

const SCENARIOS = [
  { label: "Short (7yr)", months: 84 },
  { label: "Medium (10yr)", months: 120 },
  { label: "Long (15yr)", months: 180 },
];

export function LoanCalculator() {
  const [amount, setAmount] = useState(80000);
  const [rate, setRate] = useState(8.5);
  const [termMonths, setTermMonths] = useState(120);
  const [duringSchool, setDuringSchool] = useState(false);

  const result = useMemo(() => {
    const monthly = calcPayment(amount, rate, termMonths);
    const totalPaid = monthly * termMonths;
    const totalInterest = totalPaid - amount;
    const now = new Date();
    const payoff = new Date(now.getFullYear(), now.getMonth() + termMonths);
    return { monthly, totalPaid, totalInterest, payoff };
  }, [amount, rate, termMonths]);

  const scenarios = useMemo(() => {
    return SCENARIOS.map(s => {
      const m = calcPayment(amount, rate, s.months);
      return { ...s, monthly: m, totalInterest: m * s.months - amount, isSelected: s.months === termMonths };
    });
  }, [amount, rate, termMonths]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[hsl(var(--navy))] flex items-center gap-2">
          <Calculator className="h-6 w-6 text-[hsl(var(--gold))]" />
          Loan Payment Calculator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="space-y-6">
            <div>
              <Label>Loan Amount: ${amount.toLocaleString()}</Label>
              <Slider
                value={[amount]}
                onValueChange={([v]) => setAmount(v)}
                min={10000} max={150000} step={1000}
                className="mt-2"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>$10,000</span><span>$150,000</span>
              </div>
            </div>

            <div>
              <Label>Annual Interest Rate (%)</Label>
              <Input
                type="number" step={0.1} min={0} max={30}
                value={rate}
                onChange={e => setRate(parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Loan Term</Label>
              <Select value={String(termMonths)} onValueChange={v => setTermMonths(Number(v))}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TERMS.map(t => <SelectItem key={t.months} value={String(t.months)}>{t.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-3">
              <Switch checked={duringSchool} onCheckedChange={setDuringSchool} />
              <Label className="text-sm">{duringSchool ? "Repayment during school" : "Repayment after graduation"}</Label>
            </div>
          </div>

          {/* Results */}
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-[hsl(var(--navy))] to-[hsl(var(--primary))] rounded-xl p-6 text-primary-foreground">
              <p className="text-sm text-primary-foreground/70">Monthly Payment</p>
              <p className="text-4xl font-extrabold text-[hsl(var(--gold))]">${Math.round(result.monthly).toLocaleString()}</p>
              <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
                <div>
                  <p className="text-primary-foreground/70">Total Interest</p>
                  <p className="font-semibold">${Math.round(result.totalInterest).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-primary-foreground/70">Total Cost</p>
                  <p className="font-semibold">${Math.round(result.totalPaid).toLocaleString()}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-primary-foreground/70">Payoff Date</p>
                  <p className="font-semibold">{result.payoff.toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
                </div>
              </div>
            </div>

            {/* Scenarios */}
            <div className="grid grid-cols-3 gap-3">
              {scenarios.map(s => (
                <button
                  key={s.label}
                  onClick={() => setTermMonths(s.months)}
                  className={`rounded-lg border p-3 text-center transition-all ${
                    s.isSelected
                      ? "border-[hsl(var(--gold))] bg-[hsl(var(--gold))]/10 ring-2 ring-[hsl(var(--gold))]/30"
                      : "border-border hover:border-[hsl(var(--sky))]"
                  }`}
                >
                  <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
                  <p className="text-lg font-bold text-[hsl(var(--navy))]">${Math.round(s.monthly).toLocaleString()}/mo</p>
                  <p className="text-xs text-muted-foreground">${Math.round(s.totalInterest).toLocaleString()} interest</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
