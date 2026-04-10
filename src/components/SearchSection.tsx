import { Search } from "lucide-react";

const popularSearches = [
  "ATP Flight School",
  "FLT Academy",
  "Epic Flight",
  "Florida Schools",
  "SkyWest Elite Partners",
];

export function SearchSection() {
  return (
    <section className="bg-background py-12 px-4">
      <div className="max-w-[700px] mx-auto">
        <p className="text-sm text-muted-foreground mb-3 text-center">Find your flight school</p>

        {/* Search bar */}
        <div className="flex h-14 rounded-xl border border-border overflow-hidden shadow-sm">
          <div className="flex items-center pl-4">
            <Search size={20} className="text-muted-foreground" />
          </div>
          <input
            type="text"
            placeholder="Search by school name, city, or state..."
            className="flex-1 px-3 text-sm bg-transparent outline-none text-foreground placeholder:text-muted-foreground"
          />
          <button className="bg-navy text-navy-foreground px-6 font-semibold text-sm hover:opacity-90 transition-opacity">
            Search
          </button>
        </div>

        {/* Popular searches */}
        <div className="flex flex-wrap justify-center gap-2 mt-4">
          {popularSearches.map((s) => (
            <button
              key={s}
              className="border border-border rounded-full px-3 py-1 text-sm text-foreground/70 hover:border-sky hover:text-sky transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
