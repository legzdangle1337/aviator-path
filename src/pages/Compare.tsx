import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCompare } from "@/contexts/CompareContext";
import { supabase } from "@/integrations/supabase/client";
import { Check, X, Star, Scale, Share2, FileDown, RotateCcw, Plus } from "lucide-react";
import { toast } from "sonner";
import { Helmet } from "react-helmet-async";
import type { Tables } from "@/integrations/supabase/types";

type School = Tables<"schools">;

const PARTNERSHIP_ROWS: { key: keyof School; label: string }[] = [
  { key: "skywest_elite", label: "SkyWest Elite" },
  { key: "united_aviate", label: "United Aviate" },
  { key: "southwest_d225", label: "Southwest D225" },
  { key: "delta_propel", label: "Delta Propel" },
  { key: "envoy_cadet", label: "Envoy Cadet" },
  { key: "gojet_academy", label: "GoJet Academy" },
  { key: "psa_pathway", label: "PSA Pathway" },
  { key: "piedmont_pathway", label: "Piedmont Pathway" },
];

const FINANCING_ROWS: { key: keyof School; label: string }[] = [
  { key: "financing_stratus", label: "Stratus Financial" },
  { key: "financing_sallie_mae", label: "Sallie Mae" },
  { key: "financing_aopa", label: "AOPA Finance" },
  { key: "financing_meritize", label: "Meritize" },
  { key: "financing_earnest", label: "Earnest" },
];

function formatCost(n?: number | null) {
  if (!n) return "—";
  return `$${(n / 1000).toFixed(0)}K`;
}

function BoolCell({ val }: { val: boolean | null | undefined }) {
  return val ? (
    <Check className="w-5 h-5 text-green-600 mx-auto" />
  ) : (
    <X className="w-5 h-5 text-gray-300 mx-auto" />
  );
}

function Cell({ children, highlight }: { children: React.ReactNode; highlight?: boolean }) {
  return (
    <td className={`px-4 py-3 text-sm text-center whitespace-nowrap ${highlight ? "bg-green-50" : ""}`}>
      {children}
    </td>
  );
}

export default function Compare() {
  const [searchParams] = useSearchParams();
  const { schools: ctxSchools, removeSchool, clearAll } = useCompare();
  const [schools, setSchools] = useState<School[]>(ctxSchools);
  const [loading, setLoading] = useState(false);

  // If URL has slugs but context is empty, fetch from DB
  useEffect(() => {
    const slugParam = searchParams.get("schools");
    if (slugParam && ctxSchools.length === 0) {
      const slugs = slugParam.split(",").filter(Boolean);
      if (slugs.length === 0) return;
      setLoading(true);
      supabase
        .from("schools")
        .select("*")
        .in("slug", slugs)
        .then(({ data }) => {
          if (data) setSchools(data);
          setLoading(false);
        });
    } else {
      setSchools(ctxSchools);
    }
  }, [searchParams, ctxSchools]);

  const shareLink = () => {
    const url = `${window.location.origin}/compare?schools=${schools.map((s) => s.slug).join(",")}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copied!");
  };

  // Compute highlights
  const lowestCostIdx = schools.reduce((best, s, i) => {
    const cost = s.true_cost_min ?? s.advertised_cost_min ?? Infinity;
    const bestCost = schools[best]?.true_cost_min ?? schools[best]?.advertised_cost_min ?? Infinity;
    return cost < bestCost ? i : best;
  }, 0);

  const partnershipCounts = schools.map((s) => PARTNERSHIP_ROWS.filter((p) => s[p.key] === true).length);
  const mostPartnershipsIdx = partnershipCounts.indexOf(Math.max(...partnershipCounts));

  const highestRatingIdx = schools.reduce((best, s, i) => {
    const r = s.aviatorpath_rating ?? 0;
    const br = schools[best]?.aviatorpath_rating ?? 0;
    return r > br ? i : best;
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center text-muted-foreground">Loading comparison…</div>
        <Footer />
      </div>
    );
  }

  if (schools.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <Scale className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-navy mb-2">No Schools to Compare</h1>
          <p className="text-muted-foreground mb-6">Add schools from the directory to start comparing.</p>
          <Link to="/schools" className="inline-flex items-center gap-2 bg-[hsl(var(--gold))] text-white font-semibold px-6 py-3 rounded-lg hover:brightness-110 transition">
            <Plus size={18} /> Browse Schools
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  if (schools.length === 1) {
    const s = schools[0];
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center">
          <Scale className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-navy mb-2">Add at Least One More School</h1>
          <p className="text-muted-foreground mb-6">You have <span className="font-semibold">{s.name}</span> selected. Add another to compare.</p>
          <Link to="/schools" className="inline-flex items-center gap-2 bg-[hsl(var(--gold))] text-white font-semibold px-6 py-3 rounded-lg hover:brightness-110 transition">
            <Plus size={18} /> Add More Schools
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-navy mb-6">School Comparison</h1>

        {/* Table */}
        <div className="overflow-x-auto border border-border rounded-xl bg-card">
          <table className="w-full min-w-[600px]">
            {/* Header */}
            <thead>
              <tr className="border-b border-border">
                <th className="sticky left-0 bg-card z-10 w-48 p-4" />
                {schools.map((s) => (
                  <th key={s.id} className="p-4 text-center min-w-[200px]">
                    <div className="relative">
                      <button onClick={() => removeSchool(s.id)} className="absolute -top-1 -right-1 text-muted-foreground hover:text-destructive">
                        <X size={16} />
                      </button>
                      <div className="h-20 w-full rounded-lg overflow-hidden mb-2">
                        {s.hero_image_url ? (
                          <img src={s.hero_image_url} alt={s.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-[hsl(var(--sky)/0.2)] to-[hsl(var(--navy)/0.3)] flex items-center justify-center">
                            <span className="text-lg font-bold text-navy/30">{s.name.split(" ").map((w) => w[0]).join("").slice(0, 3)}</span>
                          </div>
                        )}
                      </div>
                      <Link to={`/schools/${s.slug}`} className="font-semibold text-navy hover:underline text-sm">{s.name}</Link>
                      <p className="text-xs text-muted-foreground">{s.city}, {s.state}</p>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {/* PRICING */}
              <SectionHeader label="Pricing" cols={schools.length} />
              <Row label="Advertised Cost">
                {schools.map((s, i) => <Cell key={s.id} highlight={i === lowestCostIdx}>{formatCost(s.advertised_cost_min)} – {formatCost(s.advertised_cost_max)}</Cell>)}
              </Row>
              <Row label="True All-In Estimate">
                {schools.map((s, i) => <Cell key={s.id} highlight={i === lowestCostIdx}>{formatCost(s.true_cost_min)} – {formatCost(s.true_cost_max)}</Cell>)}
              </Row>

              {/* TRAINING */}
              <SectionHeader label="Training" cols={schools.length} />
              <Row label="Type">
                {schools.map((s) => <Cell key={s.id}>{s.part_type === "both" ? "Part 61 & 141" : s.part_type ? `Part ${s.part_type}` : "—"}</Cell>)}
              </Row>
              <Row label="Timeline">
                {schools.map((s) => <Cell key={s.id}>{s.timeline_months_min && s.timeline_months_max ? `${s.timeline_months_min}–${s.timeline_months_max} mo` : "—"}</Cell>)}
              </Row>
              <Row label="VFR Days/Year">
                {schools.map((s) => <Cell key={s.id}>{s.vfr_days_per_year ?? "—"}</Cell>)}
              </Row>
              <Row label="Housing Available">
                {schools.map((s) => <Cell key={s.id}><BoolCell val={s.housing_available} /></Cell>)}
              </Row>

              {/* FLEET */}
              <SectionHeader label="Fleet & Equipment" cols={schools.length} />
              <Row label="Aircraft Count">
                {schools.map((s) => <Cell key={s.id}>{s.total_aircraft ?? "—"}</Cell>)}
              </Row>
              <Row label="Glass Cockpit (G1000)">
                {schools.map((s) => <Cell key={s.id}><BoolCell val={s.has_g1000} /></Cell>)}
              </Row>
              <Row label="TAA">
                {schools.map((s) => <Cell key={s.id}><BoolCell val={s.has_taa} /></Cell>)}
              </Row>
              <Row label="Multi-Engine">
                {schools.map((s) => <Cell key={s.id}><BoolCell val={s.has_multi_engine} /></Cell>)}
              </Row>
              <Row label="Simulator">
                {schools.map((s) => <Cell key={s.id}><BoolCell val={s.has_simulator} /></Cell>)}
              </Row>

              {/* PARTNERSHIPS */}
              <SectionHeader label="Airline Partnerships" cols={schools.length} />
              {PARTNERSHIP_ROWS.map((p) => (
                <Row key={p.key as string} label={p.label}>
                  {schools.map((s, i) => (
                    <Cell key={s.id} highlight={i === mostPartnershipsIdx}>
                      <BoolCell val={s[p.key] as boolean | null} />
                    </Cell>
                  ))}
                </Row>
              ))}

              {/* CFI */}
              <SectionHeader label="CFI & Instructors" cols={schools.length} />
              <Row label="Pay Model">
                {schools.map((s) => <Cell key={s.id}>{s.cfi_pay_model ?? "—"}</Cell>)}
              </Row>
              <Row label="Starting Pay">
                {schools.map((s) => <Cell key={s.id}>{s.cfi_starting_pay ? `$${s.cfi_starting_pay}/hr` : "—"}</Cell>)}
              </Row>
              <Row label="Student:CFI Ratio">
                {schools.map((s) => <Cell key={s.id}>{s.student_to_cfi_ratio ? `${s.student_to_cfi_ratio}:1` : "—"}</Cell>)}
              </Row>

              {/* FINANCING */}
              <SectionHeader label="Financing" cols={schools.length} />
              {FINANCING_ROWS.map((f) => (
                <Row key={f.key as string} label={f.label}>
                  {schools.map((s) => (
                    <Cell key={s.id}><BoolCell val={s[f.key] as boolean | null} /></Cell>
                  ))}
                </Row>
              ))}

              {/* REVIEWS */}
              <SectionHeader label="Reviews" cols={schools.length} />
              <Row label="Overall Rating">
                {schools.map((s, i) => (
                  <Cell key={s.id} highlight={i === highestRatingIdx}>
                    {s.aviatorpath_rating ? (
                      <span className="flex items-center justify-center gap-1">
                        <Star size={14} className="text-[hsl(var(--gold))] fill-[hsl(var(--gold))]" />
                        {Number(s.aviatorpath_rating).toFixed(1)}
                      </span>
                    ) : "—"}
                  </Cell>
                ))}
              </Row>
              <Row label="Review Count">
                {schools.map((s) => <Cell key={s.id}>{s.aviatorpath_review_count ?? 0}</Cell>)}
              </Row>

              {/* AWARDS */}
              <SectionHeader label="Awards" cols={schools.length} />
              <Row label="Editor's Pick">
                {schools.map((s) => <Cell key={s.id}><BoolCell val={s.editors_pick} /></Cell>)}
              </Row>
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-3 mt-6">
          <button onClick={shareLink} className="flex items-center gap-2 text-sm border border-border rounded-lg px-4 py-2 hover:bg-muted transition">
            <Share2 size={16} /> Share Comparison
          </button>
          <button onClick={() => toast.info("PDF export is a Pro feature")} className="flex items-center gap-2 text-sm border border-border rounded-lg px-4 py-2 hover:bg-muted transition">
            <FileDown size={16} /> Export PDF
          </button>
          <button
            onClick={() => { clearAll(); }}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition"
          >
            <RotateCcw size={16} /> Start Over
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function SectionHeader({ label, cols }: { label: string; cols: number }) {
  return (
    <tr className="bg-muted/50">
      <td className="sticky left-0 bg-muted/50 z-10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-navy" colSpan={1}>
        {label}
      </td>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} />
      ))}
    </tr>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="border-b border-border/50 hover:bg-muted/30">
      <td className="sticky left-0 bg-card z-10 px-4 py-3 text-sm font-medium text-foreground whitespace-nowrap">
        {label}
      </td>
      {children}
    </tr>
  );
}
