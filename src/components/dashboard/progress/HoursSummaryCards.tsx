import { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Plane, Eye, Moon, Compass, Navigation, Layers } from "lucide-react";

interface FlightLog {
  flight_type: string;
  hours: number;
}

interface Props {
  logs: FlightLog[];
  isLoading: boolean;
}

const CATEGORIES = [
  { key: "total", label: "Total Time", target: 1500, icon: Plane, types: null },
  { key: "pic", label: "PIC Time", target: 250, icon: Eye, types: ["pic", "solo"] },
  { key: "night", label: "Night Time", target: 100, icon: Moon, types: ["night"] },
  { key: "instrument", label: "Instrument", target: 75, icon: Compass, types: ["instrument", "simulated_instrument"] },
  { key: "xc", label: "Cross Country", target: 500, icon: Navigation, types: ["cross_country"] },
  { key: "multi", label: "Multi-Engine", target: 50, icon: Layers, types: ["multi_engine"] },
];

export default function HoursSummaryCards({ logs, isLoading }: Props) {
  const totals = useMemo(() => {
    const result: Record<string, number> = {};
    const allHours = logs.reduce((sum, l) => sum + Number(l.hours), 0);
    result.total = allHours;

    for (const cat of CATEGORIES) {
      if (cat.types) {
        result[cat.key] = logs
          .filter(l => cat.types!.includes(l.flight_type))
          .reduce((sum, l) => sum + Number(l.hours), 0);
      }
    }
    return result;
  }, [logs]);

  if (isLoading) {
    return <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{Array.from({ length: 6 }).map((_, i) => <Card key={i} className="h-28 animate-pulse bg-muted" />)}</div>;
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {CATEGORIES.map(cat => {
        const current = totals[cat.key] ?? 0;
        const pct = Math.min(100, Math.round((current / cat.target) * 100));
        const Icon = cat.icon;
        return (
          <Card key={cat.key}>
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="h-4 w-4 text-[hsl(var(--gold))]" />
                  <span className="text-sm font-medium">{cat.label}</span>
                </div>
                <span className="text-xs text-muted-foreground">ATP: {cat.target} hrs</span>
              </div>
              <p className="text-2xl font-bold text-[hsl(var(--navy))] mb-2">{current.toFixed(1)}</p>
              <Progress value={pct} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1">{pct}% of ATP minimum</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
