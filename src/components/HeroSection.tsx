import { Link } from "react-router-dom";

export function HeroSection() {
  return (
    <section
      className="relative flex items-center justify-center min-h-[85vh] overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0A1628 0%, #0d1f3c 50%, #1a3a6e 100%)",
      }}
    >
      {/* Subtle diagonal pattern */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="diag" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="40" stroke="white" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#diag)" />
      </svg>

      <div className="relative z-10 max-w-[800px] mx-auto px-4 py-20 text-center">
        <p className="text-[hsl(var(--gold))] text-xs font-semibold uppercase tracking-[0.1em] mb-6">
          The #1 Resource for Aspiring Airline Pilots
        </p>

        <h1 className="text-4xl md:text-[64px] font-extrabold leading-tight text-primary-foreground mb-6">
          Your Path to the Flight Deck
        </h1>

        <p className="text-base md:text-xl max-w-[600px] mx-auto mb-8 text-primary-foreground/60">
          Compare 1,100+ flight schools, find pilot jobs, discover scholarships, and navigate your
          zero-to-ATP journey — all in one free resource.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
          <Link
            to="/schools"
            className="bg-[hsl(var(--gold))] text-[hsl(var(--gold-foreground))] font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
          >
            Explore Flight Schools
          </Link>
          <Link
            to="/jobs"
            className="border border-primary-foreground text-primary-foreground font-semibold px-6 py-3 rounded-lg hover:bg-primary-foreground hover:text-[hsl(var(--navy))] transition-colors"
          >
            Browse Pilot Jobs
          </Link>
        </div>

        <div className="flex items-center justify-center gap-3 mt-6">
          <div className="flex -space-x-2">
            {["JM", "KS", "AT"].map((initials) => (
              <div
                key={initials}
                className="w-8 h-8 rounded-full bg-[hsl(var(--sky))] flex items-center justify-center text-xs font-bold text-[hsl(var(--sky-foreground))] ring-2 ring-[hsl(var(--navy))]"
              >
                {initials}
              </div>
            ))}
          </div>
          <span className="text-sm text-primary-foreground/50">
            Join 2,400+ aspiring pilots
          </span>
        </div>
      </div>
    </section>
  );
}
