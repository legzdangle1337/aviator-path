import { DollarSign, Star, ShieldCheck } from "lucide-react";

const items = [
  {
    icon: DollarSign,
    title: "Transparent Pricing",
    body: "We show advertised AND true all-in costs. The gap between what schools advertise and what training actually costs can be $20,000-$40,000.",
  },
  {
    icon: Star,
    title: "Verified Reviews",
    body: "Reviews from verified students and CFIs who actually trained there. Plus live Reddit discussions so you see unfiltered community opinions.",
  },
  {
    icon: ShieldCheck,
    title: "We're Not a Lead Farm",
    body: "We don't sell your information to schools. Featured schools pay to enhance their profile — not to hide their problems.",
  },
];

export function TransparencySection() {
  return (
    <section
      className="py-16 px-4"
      style={{
        background: "linear-gradient(135deg, #0A1628 0%, #0d1f3c 50%, #1a3a6e 100%)",
      }}
    >
      <div className="max-w-5xl mx-auto">
        <h2 className="text-2xl md:text-4xl font-bold text-primary-foreground text-center mb-12">
          Finally. Honest Information About Flight Training.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item) => (
            <div key={item.title} className="text-center">
              <item.icon size={32} className="text-gold mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-primary-foreground mb-3">{item.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: "#94a3b8" }}>
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
