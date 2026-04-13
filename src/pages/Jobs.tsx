import { useState } from "react";
import { Link } from "react-router-dom";
import { SlidersHorizontal, ChevronLeft, ChevronRight, Briefcase, X, Bell, ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JobFiltersSidebar } from "@/components/jobs/JobFiltersSidebar";
import { JobCard, JobCardSkeleton } from "@/components/jobs/JobCard";
import { JobAlertModal } from "@/components/jobs/JobAlertModal";
import { useJobFilters } from "@/hooks/useJobFilters";
import { useJobs, useJobStats } from "@/hooks/useJobs";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Helmet } from "react-helmet-async";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "salary_high", label: "Highest Salary" },
  { value: "salary_low", label: "Lowest Salary" },
];

export default function JobsPage() {
  const { filters, setFilters, activeFilterCount, clearFilters } = useJobFilters();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [alertModalOpen, setAlertModalOpen] = useState(false);

  // Get user's hours for qualification filter
  const { data: profile } = useQuery({
    queryKey: ["profile-hours", user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase.from("profiles").select("total_hours").eq("id", user.id).single();
      return data;
    },
    enabled: !!user,
  });

  const { data, isLoading } = useJobs(filters, profile?.total_hours);
  const { data: stats } = useJobStats();
  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 0;

  // Saved jobs
  const { data: savedJobIds } = useQuery({
    queryKey: ["saved_jobs", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase.from("saved_jobs").select("job_id").eq("user_id", user.id);
      return data?.map((s) => s.job_id) ?? [];
    },
    enabled: !!user,
  });

  const toggleSave = async (jobId: string) => {
    if (!user) {
      toast.error("Sign in to save jobs", { action: { label: "Sign In", onClick: () => window.location.href = "/login" } });
      return;
    }
    const isSaved = savedJobIds?.includes(jobId);
    if (isSaved) {
      await supabase.from("saved_jobs").delete().eq("user_id", user.id).eq("job_id", jobId);
    } else {
      await supabase.from("saved_jobs").insert({ user_id: user.id, job_id: jobId });
    }
    queryClient.invalidateQueries({ queryKey: ["saved_jobs"] });
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <Navbar />

      {/* Header */}
      <div className="bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 py-6">
          <div className="text-sm text-muted-foreground mb-3">
            <Link to="/" className="hover:text-foreground">Home</Link>
            <span className="mx-2">›</span>
            <span className="text-foreground">Jobs</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-[40px] font-bold text-navy leading-tight">Pilot Jobs Board</h1>
              <p className="text-muted-foreground mt-1">Updated daily from airline career pages, flight schools, and direct employers</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                {stats?.lastUpdated && (
                  <span>Updated {formatDistanceToNow(new Date(stats.lastUpdated), { addSuffix: true })}</span>
                )}
                {stats && (
                  <>
                    <span className="font-medium text-foreground">{stats.total} active jobs</span>
                    <span className="font-medium text-emerald-600">{stats.newThisWeek} new this week</span>
                  </>
                )}
              </div>
            </div>
            <Link
              to="/jobs/post"
              className="text-sm font-semibold bg-navy text-navy-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </div>

      {/* Job Alert Bar */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 w-full">
        <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 mt-6 mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-accent flex-shrink-0" />
            <span className="text-sm font-medium text-foreground">
              Get instant alerts when new jobs match your hours →
            </span>
          </div>
          <button
            onClick={() => setAlertModalOpen(true)}
            className="text-sm font-semibold bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            Create Alert <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-0 pb-6 flex-1 w-full">
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-[280px] flex-shrink-0">
            <div className="sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto pr-2 scrollbar-thin">
              <JobFiltersSidebar filters={filters} setFilters={setFilters} activeCount={activeFilterCount} clearFilters={clearFilters} />
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0">
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
                  {isLoading ? "Loading..." : `Showing ${data?.total ?? 0} jobs`}
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

            {isLoading ? (
              <div className="flex flex-col gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <JobCardSkeleton key={i} />
                ))}
              </div>
            ) : data && data.jobs.length > 0 ? (
              <>
                <div className="flex flex-col gap-4">
                  {data.jobs.map((job) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      isSaved={savedJobIds?.includes(job.id)}
                      onSave={() => toggleSave(job.id)}
                    />
                  ))}
                </div>

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
                      if (totalPages <= 5) pageNum = i + 1;
                      else if (filters.page <= 3) pageNum = i + 1;
                      else if (filters.page >= totalPages - 2) pageNum = totalPages - 4 + i;
                      else pageNum = filters.page - 2 + i;
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
              <div className="text-center mt-20">
                <Briefcase size={64} className="mx-auto text-border mb-6" />
                <h2 className="text-xl font-bold text-foreground mb-2">No jobs match your filters</h2>
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
              <JobFiltersSidebar filters={filters} setFilters={setFilters} activeCount={activeFilterCount} clearFilters={clearFilters} />
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

      <JobAlertModal open={alertModalOpen} onClose={() => setAlertModalOpen(false)} />
      <Footer />
    </div>
  );
}
