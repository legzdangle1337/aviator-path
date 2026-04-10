import { School, Calculator, Briefcase, GraduationCap, Award, DollarSign } from "lucide-react";

const features = [
  {
    icon: School,
    iconColor: "text-navy",
    title: "Flight School Directory",
    description:
      "Compare 1,100+ FAA-certified schools by real cost, fleet quality, airline partnerships, and student reviews.",
    cta: "Browse Schools →",
  },
  {
    icon: Calculator,
    iconColor: "text-gold",
    title: "True Cost Calculator",
    description:
      "See what flight training actually costs — not just the advertised price. We show the real all-in number including hidden fees.",
    cta: "Calculate Costs →",
  },
  {
    icon: Briefcase,
    iconColor: "text-navy",
    title: "Pilot Jobs Board",
    description:
      "Updated daily from airline career pages. Every listing shows exact minimum hour requirements — no guessing.",
    cta: "Find Jobs →",
  },
  {
    icon: GraduationCap,
    iconColor: "text-gold",
    title: "Cadet Programs Hub",
    description:
      "Every airline pathway program compared. SkyWest Elite, United Aviate, Southwest D225, Delta Propel — all in one place.",
    cta: "Explore Programs →",
  },
  {
    icon: Award,
    iconColor: "text-sky",
    title: "Scholarship Directory",
    description:
      "200+ aviation scholarships with deadline reminders. Most aspiring pilots only know about 5 of them.",
    cta: "Find Scholarships →",
  },
  {
    icon: DollarSign,
    iconColor: "text-green-600",
    title: "Training Financing",
    description:
      "Compare every flight training lender side by side. Plus: our Pilot ROI Calculator shows your 20-year career earnings.",
    cta: "Compare Financing →",
  },
];

export function FeaturesGrid() {
  return (
    <section className="bg-background py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-gold text-center mb-4">
          Everything in One Place
        </p>
        <h2 className="text-2xl md:text-4xl font-bold text-navy text-center mb-4">
          Stop searching 15 different websites
        </h2>
        <p className="text-muted-foreground text-center max-w-[600px] mx-auto mb-12">
          AviatorPath brings together every resource a career-track pilot needs to make informed decisions.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-card rounded-xl p-6 border border-border hover:shadow-md transition-all"
            >
              <f.icon size={28} className={`${f.iconColor} mb-4`} />
              <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{f.description}</p>
              <a href="#" className="text-sm font-medium text-sky hover:underline">
                {f.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
