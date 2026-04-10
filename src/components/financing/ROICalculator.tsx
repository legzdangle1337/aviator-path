import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, CheckCircle } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, ResponsiveContainer, Legend } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const AIRLINE_PATHS: Record<string, { label: string; progression: { year: number; role: string; salary: number }[] }> = {
  regional: {
    label: "Regional Airline (SkyWest, Envoy, etc.)",
    progression: [
      { year: 1, role: "Regional FO", salary: 62000 },
      { year: 2, role: "Regional FO", salary: 72000 },
      { year: 3, role: "Regional Captain", salary: 95000 },
      { year: 5, role: "Regional Captain", salary: 110000 },
      { year: 8, role: "Regional Captain", salary: 125000 },
      { year: 10, role: "Major Airline FO", salary: 180000 },
      { year: 15, role: "Major Airline FO", salary: 240000 },
      { year: 20, role: "Major Airline Captain", salary: 340000 },
      { year: 25, role: "Major Airline Captain", salary: 380000 },
      { year: 30, role: "Major Airline Captain", salary: 400000 },
    ],
  },
  united: {
    label: "United Airlines (via Aviate)",
    progression: [
      { year: 1, role: "CFI / Time Building", salary: 45000 },
      { year: 2, role: "Regional FO", salary: 68000 },
      { year: 3, role: "Regional Captain", salary: 100000 },
      { year: 5, role: "United FO", salary: 200000 },
      { year: 8, role: "United FO", salary: 260000 },
      { year: 10, role: "United FO", salary: 290000 },
      { year: 15, role: "United Captain", salary: 370000 },
      { year: 20, role: "United Captain", salary: 410000 },
      { year: 25, role: "United Captain", salary: 430000 },
      { year: 30, role: "United Captain", salary: 450000 },
    ],
  },
  delta: {
    label: "Delta Air Lines",
    progression: [
      { year: 1, role: "CFI / Time Building", salary: 45000 },
      { year: 2, role: "Regional FO", salary: 70000 },
      { year: 4, role: "Regional Captain", salary: 105000 },
      { year: 6, role: "Delta FO", salary: 210000 },
      { year: 10, role: "Delta FO", salary: 280000 },
      { year: 15, role: "Delta Captain", salary: 380000 },
      { year: 20, role: "Delta Captain", salary: 420000 },
      { year: 25, role: "Delta Captain", salary: 440000 },
      { year: 30, role: "Delta Captain", salary: 460000 },
    ],
  },
  cargo: {
    label: "Cargo (FedEx / UPS)",
    progression: [
      { year: 1, role: "CFI / Time Building", salary: 45000 },
      { year: 3, role: "Regional FO", salary: 75000 },
      { year: 5, role: "Regional Captain", salary: 110000 },
      { year: 8, role: "Cargo FO", salary: 220000 },
      { year: 12, role: "Cargo FO", salary: 280000 },
      { year: 15, role: "Cargo Captain", salary: 350000 },
      { year: 20, role: "Cargo Captain", salary: 400000 },
      { year: 25, role: "Cargo Captain", salary: 420000 },
      { year: 30, role: "Cargo Captain", salary: 440000 },
    ],
  },
};

function interpolateSalary(progression: { year: number; salary: number }[], year: number): number {
  if (year <= progression[0].year) return progression[0].salary;
  if (year >= progression[progression.length - 1].year) return progression[progression.length - 1].salary;
  for (let i = 0; i < progression.length - 1; i++) {
    if (year >= progression[i].year && year <= progression[i + 1].year) {
      const frac = (year - progression[i].year) / (progression[i + 1].year - progression[i].year);
      return Math.round(progression[i].salary + frac * (progression[i + 1].salary - progression[i].salary));
    }
  }
  return progression[progression.length - 1].salary;
}

function getRoleAtYear(progression: { year: number; role: string }[], year: number): string {
  let role = progression[0].role;
  for (const p of progression) {
    if (year >= p.year) role = p.role;
  }
  return role;
}

export function ROICalculator() {
  const [trainingCost, setTrainingCost] = useState(85000);
  const [airline, setAirline] = useState("regional");
  const [currentSalary, setCurrentSalary] = useState(50000);

  const path = AIRLINE_PATHS[airline];

  const chartData = useMemo(() => {
    let aviationCum = -trainingCost;
    let altCum = 0;
    const data = [];
    for (let y = 0; y <= 30; y++) {
      if (y > 0) {
        aviationCum += interpolateSalary(path.progression, y);
        altCum += currentSalary * Math.pow(1.03, y - 1);
      }
      data.push({ year: y, aviation: Math.round(aviationCum), alternative: Math.round(altCum) });
    }
    return data;
  }, [trainingCost, airline, currentSalary, path]);

  const breakEvenYear = useMemo(() => {
    const point = chartData.find(d => d.year > 0 && d.aviation >= d.alternative);
    return point?.year ?? null;
  }, [chartData]);

  const milestoneYears = [1, 3, 5, 10, 20, 30];
  const tableData = milestoneYears.map(y => ({
    year: y,
    role: getRoleAtYear(path.progression, y),
    salary: interpolateSalary(path.progression, y),
    cumulative: chartData[y]?.aviation ?? 0,
  }));

  const total30Aviation = chartData[30]?.aviation ?? 0;
  const total30Alt = chartData[30]?.alternative ?? 0;

  const chartConfig = {
    aviation: { label: "Aviation Career", color: "hsl(var(--gold))" },
    alternative: { label: "Current Path", color: "hsl(var(--muted-foreground))" },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[hsl(var(--navy))] flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-[hsl(var(--gold))]" />
          Is Becoming a Pilot Worth It? The Real Numbers.
        </CardTitle>
        <p className="text-muted-foreground text-sm">We built this because no one else would show you an honest answer.</p>
      </CardHeader>
      <CardContent>
        {/* Inputs */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div>
            <Label>Training Cost ($)</Label>
            <Input type="number" value={trainingCost} onChange={e => setTrainingCost(Number(e.target.value) || 0)} className="mt-1" />
          </div>
          <div>
            <Label>Target Airline Path</Label>
            <Select value={airline} onValueChange={setAirline}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(AIRLINE_PATHS).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Current Annual Salary ($)</Label>
            <Input type="number" value={currentSalary} onChange={e => setCurrentSalary(Number(e.target.value) || 0)} className="mt-1" />
          </div>
        </div>

        {/* Chart */}
        <ChartContainer config={chartConfig} className="h-[350px] w-full mb-8">
          <LineChart data={chartData} margin={{ top: 10, right: 30, left: 10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="year" label={{ value: "Years", position: "insideBottom", offset: -5 }} />
            <YAxis tickFormatter={v => `$${(v / 1000).toFixed(0)}k`} />
            <ChartTooltip content={<ChartTooltipContent formatter={(v) => `$${Number(v).toLocaleString()}`} />} />
            <Legend />
            <Line type="monotone" dataKey="aviation" name="Aviation Career" stroke="hsl(var(--gold))" strokeWidth={3} dot={false} />
            <Line type="monotone" dataKey="alternative" name="Current Path" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" dot={false} />
            {breakEvenYear && <ReferenceLine x={breakEvenYear} stroke="hsl(var(--gold))" strokeDasharray="3 3" label={{ value: `Break-even: Year ${breakEvenYear}`, fill: "hsl(var(--gold))", fontSize: 12 }} />}
          </LineChart>
        </ChartContainer>

        {/* Key Metrics */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-[hsl(var(--gold))]/10 rounded-xl p-4 text-center border border-[hsl(var(--gold))]/30">
            <p className="text-sm text-muted-foreground">Break-Even Year</p>
            <p className="text-3xl font-extrabold text-[hsl(var(--navy))]">{breakEvenYear ? `Year ${breakEvenYear}` : "N/A"}</p>
          </div>
          <div className="bg-muted rounded-xl p-4 text-center border">
            <p className="text-sm text-muted-foreground">30-Year Aviation Earnings</p>
            <p className="text-2xl font-bold text-[hsl(var(--navy))]">${(total30Aviation / 1000000).toFixed(1)}M</p>
          </div>
          <div className="bg-muted rounded-xl p-4 text-center border">
            <p className="text-sm text-muted-foreground">Net Advantage</p>
            <p className="text-2xl font-bold text-green-700">{total30Aviation > total30Alt ? "+" : ""}${((total30Aviation - total30Alt) / 1000000).toFixed(1)}M</p>
          </div>
        </div>

        {/* Earnings Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Year</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Annual Salary</TableHead>
                <TableHead>Cumulative Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map(r => (
                <TableRow key={r.year}>
                  <TableCell className="font-medium">Year {r.year}</TableCell>
                  <TableCell>{r.role}</TableCell>
                  <TableCell>${r.salary.toLocaleString()}</TableCell>
                  <TableCell className={r.cumulative >= 0 ? "text-green-700 font-semibold" : "text-red-600"}>${r.cumulative.toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <p className="text-xs text-muted-foreground mt-4">Based on industry average pay scales (2025). Actual earnings vary by seniority, base, and contract.</p>

        <div className="mt-6 bg-[hsl(var(--gold))]/10 border border-[hsl(var(--gold))]/30 rounded-xl p-4 text-center">
          <p className="font-semibold text-[hsl(var(--navy))]">Want personalized financing advice?</p>
          <p className="text-sm text-muted-foreground mb-3">Book a 60-minute strategy call with an aviation career counselor</p>
          <a href="#" className="inline-flex items-center gap-2 bg-[hsl(var(--gold))] text-[hsl(var(--gold-foreground))] px-6 py-2 rounded-lg font-semibold hover:opacity-90 transition-opacity">
            Book a Strategy Call →
          </a>
        </div>
      </CardContent>
    </Card>
  );
}
