const stats = [
  { number: "1,100+", label: "Flight Schools Listed" },
  { number: "500+", label: "Active Pilot Jobs" },
  { number: "200+", label: "Scholarships Available" },
  { number: "15", label: "Airline Cadet Programs" },
];

export function StatsBar() {
  return (
    <section className="bg-surface py-10 px-4">
      <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0">
        {stats.map((stat, i) => (
          <div
            key={stat.label}
            className={`text-center px-4 ${
              i < stats.length - 1 ? "md:border-r md:border-border" : ""
            }`}
          >
            <div className="text-3xl font-bold text-navy">{stat.number}</div>
            <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
