const steps = [
  {
    num: 1,
    title: "Set Your Goals",
    description:
      "Tell us your budget, location, timeline, and target airline. We'll personalize everything to your situation.",
  },
  {
    num: 2,
    title: "Compare With Real Data",
    description:
      "Side-by-side school comparisons, honest cost breakdowns, verified reviews, and community intelligence — all in one place.",
  },
  {
    num: 3,
    title: "Launch Your Career",
    description:
      "Apply to your chosen school, enroll in cadet programs, secure financing, and start building hours toward your first officer seat.",
  },
];

export function HowItWorks() {
  return (
    <section className="bg-surface py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold text-navy text-center mb-12">
          Your Aviation Career in 3 Steps
        </h2>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Connecting line desktop */}
          <div className="hidden md:block absolute top-6 left-[16.66%] right-[16.66%] h-px border-t-2 border-dashed border-border" />

          {steps.map((step) => (
            <div key={step.num} className="text-center relative">
              <div className="w-12 h-12 rounded-full bg-gold text-gold-foreground font-bold text-lg flex items-center justify-center mx-auto mb-4 relative z-10">
                {step.num}
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
