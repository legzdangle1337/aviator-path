import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp } from "lucide-react";
import { format, parseISO } from "date-fns";

interface FlightLog {
  date: string;
  hours: number;
}

interface Props {
  logs: FlightLog[];
}

export default function HoursChart({ logs }: Props) {
  const chartData = useMemo(() => {
    if (!logs.length) return [];

    const monthly: Record<string, number> = {};
    for (const log of logs) {
      const key = log.date.substring(0, 7); // YYYY-MM
      monthly[key] = (monthly[key] ?? 0) + Number(log.hours);
    }

    const sorted = Object.entries(monthly).sort(([a], [b]) => a.localeCompare(b));
    let cumulative = 0;
    return sorted.map(([month, hrs]) => {
      cumulative += hrs;
      return {
        month: format(parseISO(`${month}-01`), "MMM yyyy"),
        hours: Number(hrs.toFixed(1)),
        cumulative: Number(cumulative.toFixed(1)),
      };
    });
  }, [logs]);

  if (!chartData.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[hsl(var(--gold))]" /> Hours Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground py-8 text-center">Log your first flight to see your progress chart.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-[hsl(var(--gold))]" /> Cumulative Hours
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="hoursGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} className="text-muted-foreground" />
            <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
            <Tooltip
              contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", background: "hsl(var(--background))" }}
              formatter={(value: number) => [`${value} hrs`, "Cumulative"]}
            />
            <Area
              type="monotone"
              dataKey="cumulative"
              stroke="hsl(var(--primary))"
              fill="url(#hoursGradient)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
