import { useState } from "react";
import { Link } from "react-router-dom";
import { SlidersHorizontal, ChevronLeft, ChevronRight, Plane, X, LayoutGrid, Map } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SchoolFiltersSidebar } from "@/components/schools/SchoolFiltersSidebar";
import { SchoolCard, SchoolCardSkeleton } from "@/components/schools/SchoolCard";
import { useSchoolFilters } from "@/hooks/useSchoolFilters";
import { useSchools } from "@/hooks/useSchools";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";

const SORT_OPTIONS = [
  { value: "best_match", label: "Best Match" },
  { value: "highest_rated", label: "Highest Rated" },
  { value: "lowest_cost", label: "Lowest Cost" },
  { value: "most_reviews", label: "Most Reviews" },
  { value: "recently_updated", label: "Recently Updated" },
  { value: "featured_first", label: "Featured First" },
];

export default function SchoolsPage() {
  const { filters, setFilters, activeFilterCount, clearFilters } = useSchoolFilters();
  const { data, isLoading } = useSchools(filters);
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [view, setView] = useState<"card" | "map">("card");

  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 0;

  // Saved schools
  const { data: savedSchoolIds } = useQuery({
    queryKey: ["saved_schools", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase.from("saved_schools").select("school_id").eq("user_id", user.id);
      return data?.map((s) => s.school_id) ?? [];
    },
    enabled: !!user,
  });

  const toggleSave = async (schoolId: string) => {
    if (!user) {
      toast.error("Sign in to save schools", { action: { label: "Sign In", onClick: () => window.location.href = "/login" } });
      return;
    }
    const isSaved = savedSchoolIds?.includes(schoolId);
    if (isSaved) {
      await supabase.from("saved_schools").delete().eq("user_id", user.id).eq("school_id", schoolId);
    } else {
      await supabase.from("saved_schools").insert({ user_id: user.id, school_id: schoolId });
    }
    queryClient.invalidateQueries({ queryKey: ["saved_schools"] });
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Helmet>
        <title>Compare Flight Schools | Costs, Reviews & Airline Partnerships | Aviator Path</title>
        <meta name="description" content="Compare 1,100+ flight schools by cost, airline partnerships, fleet, and student reviews. Find the best flight school for your pilot career path." />
        <link rel="canonical" href="https://aviatorpath.com/schools" />
      </Helmet>
      <Navbar />

      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
          <div className="text-sm text-muted-foreground mb-3">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-foreground">Schools</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-[40px] font-bold text-navy leading-tight">Find Your Flight School</h1>
              <p className="text-muted-foreground mt-1">Compare 1,100+ FAA-certified flight schools across the United States</p>
            </div>
            <div className="flex gap-1 bg-muted rounded-lg p-1">
              <button
                onClick={() => setView("card")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === "card" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
              >
                <LayoutGrid size={16} /> Card View
              </button>
              <button
                onClick={() => setView("map")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${view === "map" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground"}`}
              >
                <Map size={16} /> Map View
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 flex-1 w-full">
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-[280px] flex-shrink-0">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2 scrollbar-thin">
              <SchoolFiltersSidebar filters={filters} setFilters={setFilters} activeCount={activeFilterCount} clearFilters={clearFilters} />
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0">
            {/* Mobile filter button + sort bar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 text-sm font-medium border border-border rounded-lg px-3 py-2 text-foreground"
                >
                  <SlidersHorizontal size={16} />
                  Filters{activeFilterCount > 0 && ` (${activeFilterCount})`}
                </button>
                <span className="text-sm text-muted-foreground">
                  {isLoading ? "Loading..." : `Showing ${data?.total ?? 0} schools`}
                </span>
              </div>

              <select
                value={filters.sort}
                onChange={(e) => setFilters({ sort: e.target.value })}
                className="text-sm h-9 px-3 rounded-lg border border-input bg-background outline-none"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Results */}
            {isLoading ? (
              <div className="flex flex-col gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SchoolCardSkeleton key={i} />
                ))}
              </div>
            ) : data && data.schools.length > 0 ? (
              <>
                <div className="flex flex-col gap-4">
                  {data.schools.map((school) => (
                    <SchoolCard
                      key={school.id}
                      school={school}
                      isSaved={savedSchoolIds?.includes(school.id)}
                      onSave={() => toggleSave(school.id)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      onClick={() => setFilters({ page: Math.max(1, filters.page - 1) })}
                      disabled={filters.page <= 1}
                      className="p-2 rounded-lg border border-border text-foreground disabled:opacity-30"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum: number;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (filters.page <= 3) {
                        pageNum = i + 1;
                      } else if (filters.page >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = filters.page - 2 + i;
                      }
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setFilters({ page: pageNum })}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
                            filters.page === pageNum
                              ? "bg-navy text-navy-foreground"
                              : "border border-border text-foreground hover:bg-muted"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setFilters({ page: Math.min(totalPages, filters.page + 1) })}
                      disabled={filters.page >= totalPages}
                      className="p-2 rounded-lg border border-border text-foreground disabled:opacity-30"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Empty state */
              <div className="text-center mt-20">
                <Plane size={64} className="mx-auto text-border mb-6" />
                <h2 className="text-xl font-bold text-foreground mb-2">No schools match your filters</h2>
                <p className="text-muted-foreground mb-6">Try adjusting your search criteria</p>
                <button onClick={clearFilters} className="bg-gold text-gold-foreground font-semibold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity">
                  Clear All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-foreground/30" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-background shadow-xl overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold text-foreground">Filters</h3>
              <button onClick={() => setMobileFiltersOpen(false)}><X size={20} /></button>
            </div>
            <div className="p-4">
              <SchoolFiltersSidebar filters={filters} setFilters={setFilters} activeCount={activeFilterCount} clearFilters={clearFilters} />
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full mt-6 bg-gold text-gold-foreground font-semibold py-3 rounded-lg"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
