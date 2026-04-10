import { useEffect, useState } from "react";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "partnerships", label: "Programs" },
  { id: "fleet", label: "Fleet" },
  { id: "reviews", label: "Reviews" },
  { id: "location", label: "Location" },
  { id: "contact", label: "Contact" },
];

export function SchoolStickyNav() {
  const [active, setActive] = useState("overview");
  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setSticky(window.scrollY > 500);
      for (const tab of [...TABS].reverse()) {
        const el = document.getElementById(tab.id);
        if (el && el.getBoundingClientRect().top <= 120) {
          setActive(tab.id);
          break;
        }
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!sticky) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-background border-b shadow-sm">
      <div className="max-w-6xl mx-auto px-4 flex gap-0 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => scrollTo(tab.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              active === tab.id
                ? "border-accent text-accent"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
