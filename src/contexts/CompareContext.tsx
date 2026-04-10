import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Tables } from "@/integrations/supabase/types";

type School = Tables<"schools">;

interface CompareContextType {
  schools: School[];
  addSchool: (school: School) => void;
  removeSchool: (id: string) => void;
  isComparing: (id: string) => boolean;
  clearAll: () => void;
}

const CompareContext = createContext<CompareContextType | null>(null);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [schools, setSchools] = useState<School[]>(() => {
    try {
      const stored = localStorage.getItem("compare-schools");
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem("compare-schools", JSON.stringify(schools));
  }, [schools]);

  const addSchool = (school: School) => {
    setSchools((prev) => {
      if (prev.length >= 4 || prev.some((s) => s.id === school.id)) return prev;
      return [...prev, school];
    });
  };

  const removeSchool = (id: string) => setSchools((prev) => prev.filter((s) => s.id !== id));
  const isComparing = (id: string) => schools.some((s) => s.id === id);
  const clearAll = () => setSchools([]);

  return (
    <CompareContext.Provider value={{ schools, addSchool, removeSchool, isComparing, clearAll }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
