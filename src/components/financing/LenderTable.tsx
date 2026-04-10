import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ChevronDown, ChevronUp, ExternalLink, Check, X, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

export function LenderTable() {
  const { data: lenders, isLoading } = useQuery({
    queryKey: ["lenders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("lenders")
        .select("*")
        .eq("is_active", true)
        .order("display_order");
      if (error) throw error;
      return data;
    },
  });

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const cosignerLabel = (val: string | null) => {
    switch (val) {
      case "yes": return "Required";
      case "no": return "Not Required";
      case "optional": return "Optional";
      case "improves_rate": return "Improves Rate";
      default: return "—";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader><CardTitle>Lender Comparison</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[1,2,3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
        </CardContent>
      </Card>
    );
  }

  return (
    <section id="lenders">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-[hsl(var(--navy))]">Lender Comparison</CardTitle>
          <p className="text-muted-foreground text-sm">Side-by-side comparison of aviation-specific loan options</p>
        </CardHeader>
        <CardContent>
          {/* Desktop table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="py-3 px-3 font-semibold text-muted-foreground">Lender</th>
                  <th className="py-3 px-3 font-semibold text-muted-foreground">Loan Range</th>
                  <th className="py-3 px-3 font-semibold text-muted-foreground">APR Range</th>
                  <th className="py-3 px-3 font-semibold text-muted-foreground">Cosigner</th>
                  <th className="py-3 px-3 font-semibold text-muted-foreground">In-School Defer</th>
                  <th className="py-3 px-3 font-semibold text-muted-foreground">Grace Period</th>
                  <th className="py-3 px-3 font-semibold text-muted-foreground">Best For</th>
                  <th className="py-3 px-3"></th>
                </tr>
              </thead>
              <tbody>
                {lenders?.map((l) => (
                  <Collapsible key={l.id} open={expandedId === l.id} onOpenChange={(o) => setExpandedId(o ? l.id : null)} asChild>
                    <>
                      <tr className="border-b hover:bg-muted/30 transition-colors">
                        <td className="py-4 px-3 font-semibold text-[hsl(var(--navy))]">{l.name}</td>
                        <td className="py-4 px-3">${(l.min_amount ?? 0 / 1000).toLocaleString()} – ${((l.max_amount ?? 0) / 1000).toLocaleString()}k</td>
                        <td className="py-4 px-3">{l.apr_min}% – {l.apr_max}%</td>
                        <td className="py-4 px-3">{cosignerLabel(l.cosigner_required)}</td>
                        <td className="py-4 px-3">
                          {l.in_school_deferment ? <Check className="h-4 w-4 text-green-600" /> : <X className="h-4 w-4 text-red-400" />}
                        </td>
                        <td className="py-4 px-3">{l.grace_period_months ? `${l.grace_period_months} mo` : "—"}</td>
                        <td className="py-4 px-3 text-xs text-muted-foreground max-w-[160px]">{l.eligible_school_types}</td>
                        <td className="py-4 px-3 space-x-2 whitespace-nowrap">
                          <CollapsibleTrigger asChild>
                            <Button variant="ghost" size="sm">
                              {expandedId === l.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                            </Button>
                          </CollapsibleTrigger>
                          <a href={l.affiliate_url || l.website || "#"} target="_blank" rel="noopener noreferrer nofollow">
                            <Button size="sm" className="bg-[hsl(var(--gold))] hover:bg-[hsl(var(--gold))]/90 text-[hsl(var(--gold-foreground))]">
                              Get Quote <ExternalLink className="h-3 w-3 ml-1" />
                            </Button>
                          </a>
                        </td>
                      </tr>
                      <CollapsibleContent asChild>
                        <tr>
                          <td colSpan={8} className="bg-muted/20 px-6 py-4">
                            <div className="grid md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-1"><Check className="h-4 w-4" /> Pros</h4>
                                <ul className="space-y-1 text-sm">
                                  {l.pros?.map((p, i) => <li key={i} className="flex items-start gap-2"><Check className="h-3 w-3 mt-1 text-green-600 shrink-0" />{p}</li>)}
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-semibold text-red-600 mb-2 flex items-center gap-1"><X className="h-4 w-4" /> Cons</h4>
                                <ul className="space-y-1 text-sm">
                                  {l.cons?.map((c, i) => <li key={i} className="flex items-start gap-2"><X className="h-3 w-3 mt-1 text-red-400 shrink-0" />{c}</li>)}
                                </ul>
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground mt-3">{l.description}</p>
                          </td>
                        </tr>
                      </CollapsibleContent>
                    </>
                  </Collapsible>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="lg:hidden space-y-4">
            {lenders?.map((l) => (
              <div key={l.id} className="border rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[hsl(var(--navy))]">{l.name}</h3>
                  <a href={l.affiliate_url || l.website || "#"} target="_blank" rel="noopener noreferrer nofollow">
                    <Button size="sm" className="bg-[hsl(var(--gold))] hover:bg-[hsl(var(--gold))]/90 text-[hsl(var(--gold-foreground))]">
                      Get Quote
                    </Button>
                  </a>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><span className="text-muted-foreground">APR:</span> {l.apr_min}% – {l.apr_max}%</div>
                  <div><span className="text-muted-foreground">Range:</span> ${((l.min_amount ?? 0) / 1000)}k – ${((l.max_amount ?? 0) / 1000)}k</div>
                  <div><span className="text-muted-foreground">Cosigner:</span> {cosignerLabel(l.cosigner_required)}</div>
                  <div><span className="text-muted-foreground">Defer:</span> {l.in_school_deferment ? "Yes" : "No"}</div>
                </div>
                <p className="text-xs text-muted-foreground">{l.description}</p>
              </div>
            ))}
          </div>

          <p className="text-xs text-muted-foreground mt-6 flex items-center gap-1">
            <Info className="h-3 w-3" />
            * AviatorPath may earn a referral fee if you apply through our links. This doesn't affect our recommendations or rankings.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
