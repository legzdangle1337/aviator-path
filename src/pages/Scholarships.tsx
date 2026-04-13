import { useState } from "react";
import { Link } from "react-router-dom";
import { SlidersHorizontal, ChevronLeft, ChevronRight, GraduationCap, X, Search } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScholarshipFiltersSidebar } from "@/components/scholarships/ScholarshipFiltersSidebar";
import { ScholarshipCard, ScholarshipCardSkeleton } from "@/components/scholarships/ScholarshipCard";
import { useScholarshipFilters } from "@/hooks/useScholarshipFilters";
import { useScholarships, useNextDeadline } from "@/hooks/useScholarships";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";

const SORT_OPTIONS = [
  { value: "deadline_soonest", label: "Deadline Soonest" },
  { value: "highest_amount", label: "Highest Amount" },
  { value: "lowest_amount", label: "Lowest Amount" },
  { value: "recently_added", label: "Recently Added" },
];

export default function ScholarshipsPage() {
  const { filters, setFilters, activeFilterCount, clearFilters } = useScholarshipFilters();
  const { data, isLoading } = useScholarships(filters);
  const { data: nextDeadline } = useNextDeadline();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [searchInput, setSearchInput] = useState(filters.search);

  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 0;

  const { data: savedIds } = useQuery({
    queryKey: ["saved_scholarships", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase.from("saved_scholarships").select("scholarship_id").eq("user_id", user.id);
      return data?.map((s) => s.scholarship_id) ?? [];
    },
    enabled: !!user,
  });

  const toggleSave = async (id: string) => {
    if (!user) {
      toast.error("Sign in to save scholarships", { action: { label: "Sign In", onClick: () => (window.location.href = "/login") } });
      return;
    }
    const isSaved = savedIds?.includes(id);
    if (isSaved) {
      await supabase.from("saved_scholarships").delete().eq("user_id", user.id).eq("scholarship_id", id);
    } else {
      await supabase.from("saved_scholarships").insert({ user_id: user.id, scholarship_id: id });
    }
    queryClient.invalidateQueries({ queryKey: ["saved_scholarships"] });
  };

  const daysUntilDeadline = nextDeadline?.deadline
    ? Math.ceil((new Date(nextDeadline.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
    : null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setFilters({ search: searchInput });
  };

  // Identify featured: highest amount, soonest deadline, easy
  const featured = data?.scholarships.slice(0, 3) ?? [];

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Helmet>
        <title>Aviation Scholarships | Find Funding for Flight Training | Aviator Path</title>
        <meta name="description" content="Discover aviation scholarships and grants for student pilots. Filter by eligibility, award amount, and upcoming deadlines." />
        <link rel="canonical" href="https://aviatorpath.com/scholarships" />
      </Helmet>
      <Navbar />

      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
          <div className="text-sm text-muted-foreground mb-3">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-foreground">Scholarships</span>
          </div>
          <h1 className="text-3xl md:text-[40px] font-bold text-navy leading-tight">Aviation Scholarships</h1>
          <p className="text-muted-foreground mt-1">200+ scholarships for aspiring pilots — most go unclaimed because students don't know they exist</p>
        </div>
      </div>

      {/* Deadline Alert */}
      {nextDeadline && daysUntilDeadline !== null && daysUntilDeadline > 0 && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-7xl mx-auto px-4 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-amber-900 font-medium">
              ⏰ <strong>{nextDeadline.name}</strong> closes in {daysUntilDeadline} days
            </p>
            <Link to={`/scholarships/${nextDeadline.slug}`} className="text-sm font-semibold text-amber-800 hover:text-amber-900 underline">
              Don't miss the deadline → Apply here
            </Link>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6 flex-1 w-full">
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-[280px] flex-shrink-0">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2 scrollbar-thin">
              <ScholarshipFiltersSidebar filters={filters} setFilters={setFilters} activeCount={activeFilterCount} clearFilters={clearFilters} />
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0">
            {/* Search + sort bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => setMobileFiltersOpen(true)}
                  className="lg:hidden flex items-center gap-2 text-sm font-medium border border-border rounded-lg px-3 py-2 text-foreground"
                >
                  <SlidersHorizontal size={16} />
                  Filters{activeFilterCount > 0 && ` (${activeFilterCount})`}
                </button>
                <form onSubmit={handleSearch} className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search scholarships..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="h-9 pl-9 pr-3 w-56 rounded-lg border border-input bg-background text-sm outline-none"
                  />
                </form>
                <span className="text-sm text-muted-foreground">
                  {isLoading ? "Loading..." : `${data?.total ?? 0} scholarships`}
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ScholarshipCardSkeleton key={i} />
                ))}
              </div>
            ) : data && data.scholarships.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.scholarships.map((s, i) => (
                    <ScholarshipCard
                      key={s.id}
                      scholarship={s}
                      isSaved={savedIds?.includes(s.id)}
                      onSave={() => toggleSave(s.id)}
                      featured={filters.page === 1 && i < 3}
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
                      let p: number;
                      if (totalPages <= 5) p = i + 1;
                      else if (filters.page <= 3) p = i + 1;
                      else if (filters.page >= totalPages - 2) p = totalPages - 4 + i;
                      else p = filters.page - 2 + i;
                      return (
                        <button
                          key={p}
                          onClick={() => setFilters({ page: p })}
                          className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${filters.page === p ? "bg-navy text-navy-foreground" : "border border-border text-foreground hover:bg-muted"}`}
                        >
                          {p}
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
              <div className="text-center mt-20">
                <GraduationCap size={64} className="mx-auto text-border mb-6" />
                <h2 className="text-xl font-bold text-foreground mb-2">No scholarships match your filters</h2>
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
              <ScholarshipFiltersSidebar filters={filters} setFilters={setFilters} activeCount={activeFilterCount} clearFilters={clearFilters} />
              <button onClick={() => setMobileFiltersOpen(false)} className="w-full mt-6 bg-gold text-gold-foreground font-semibold py-3 rounded-lg">
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
