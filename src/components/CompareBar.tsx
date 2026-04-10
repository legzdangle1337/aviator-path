import { X } from "lucide-react";
import { useCompare } from "@/contexts/CompareContext";
import { useNavigate } from "react-router-dom";

export function CompareBar() {
  const { schools, removeSchool, clearAll } = useCompare();
  const navigate = useNavigate();

  if (schools.length === 0) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[hsl(var(--navy))] text-white h-20 flex items-center px-4 md:px-8 shadow-2xl">
      <span className="text-sm font-semibold shrink-0">
        Comparing ({schools.length} of 4):
      </span>

      <div className="flex-1 flex items-center gap-3 mx-4 overflow-x-auto">
        {schools.map((s) => (
          <span key={s.id} className="flex items-center gap-1.5 bg-white/10 rounded-full px-3 py-1 text-sm whitespace-nowrap">
            {s.name}
            <button onClick={() => removeSchool(s.id)} className="hover:text-red-300">
              <X size={14} />
            </button>
          </span>
        ))}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button onClick={clearAll} className="text-xs text-white/60 hover:text-white underline">
          Clear All
        </button>
        <button
          disabled={schools.length < 2}
          onClick={() => navigate(`/compare?schools=${schools.map((s) => s.slug).join(",")}`)}
          className="bg-[hsl(var(--gold))] text-[hsl(var(--gold-foreground))] font-semibold text-sm px-5 py-2 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition"
        >
          Compare Now
        </button>
      </div>
    </div>
  );
}
