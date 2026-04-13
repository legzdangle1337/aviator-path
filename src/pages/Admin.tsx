import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SchoolEditModal } from "@/components/admin/SchoolEditModal";
import { JobEditModal } from "@/components/admin/JobEditModal";
import { Check, Pencil, Plus, Search, Star, Trash2 } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { Helmet } from "react-helmet-async";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

type School = Tables<"schools">;
type Job = Tables<"jobs">;
type Review = Tables<"school_reviews">;

export default function Admin() {
  const [schoolSearch, setSchoolSearch] = useState("");
  const [jobSearch, setJobSearch] = useState("");
  const [editSchool, setEditSchool] = useState<School | null>(null);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [newJob, setNewJob] = useState(false);
  const queryClient = useQueryClient();

  const { data: schools = [] } = useQuery({
    queryKey: ["admin-schools"],
    queryFn: async () => {
      const { data } = await supabase.from("schools").select("*").order("name");
      return data ?? [];
    },
  });

  const { data: jobs = [] } = useQuery({
    queryKey: ["admin-jobs"],
    queryFn: async () => {
      const { data } = await supabase.from("jobs").select("*").order("posted_date", { ascending: false });
      return data ?? [];
    },
  });

  const { data: pendingReviews = [] } = useQuery({
    queryKey: ["admin-pending-reviews"],
    queryFn: async () => {
      const { data } = await supabase
        .from("school_reviews")
        .select("*, schools!school_reviews_school_id_fkey(name, slug)")
        .eq("is_hidden", true)
        .order("created_at", { ascending: false });
      return (data ?? []) as (Review & { schools: { name: string; slug: string } | null })[];
    },
  });

  const approveReview = async (id: string) => {
    const { error } = await supabase.from("school_reviews").update({ is_hidden: false }).eq("id", id);
    if (error) {
      toast.error("Failed to approve review");
    } else {
      toast.success("Review approved");
      queryClient.invalidateQueries({ queryKey: ["admin-pending-reviews"] });
    }
  };

  const deleteReview = async (id: string) => {
    const { error } = await supabase.from("school_reviews").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete review");
    } else {
      toast.success("Review deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-pending-reviews"] });
    }
  };

  const filteredSchools = schools.filter(s =>
    s.name.toLowerCase().includes(schoolSearch.toLowerCase()) ||
    s.city.toLowerCase().includes(schoolSearch.toLowerCase()) ||
    s.state.toLowerCase().includes(schoolSearch.toLowerCase())
  );

  const filteredJobs = jobs.filter(j =>
    j.job_title.toLowerCase().includes(jobSearch.toLowerCase()) ||
    j.company_name.toLowerCase().includes(jobSearch.toLowerCase())
  );

  const formatCost = (min?: number | null, max?: number | null) => {
    if (!min && !max) return "—";
    if (min && max) return `$${(min/1000).toFixed(0)}K–$${(max/1000).toFixed(0)}K`;
    if (min) return `From $${(min/1000).toFixed(0)}K`;
    return `Up to $${(max!/1000).toFixed(0)}K`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet><title>Admin Dashboard | AviatorPath</title></Helmet>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-6">Admin Dashboard</h1>

        <Tabs defaultValue="schools">
          <TabsList>
            <TabsTrigger value="schools">Schools ({schools.length})</TabsTrigger>
            <TabsTrigger value="jobs">Jobs ({jobs.length})</TabsTrigger>
            <TabsTrigger value="reviews">Reviews ({pendingReviews.length} pending)</TabsTrigger>
          </TabsList>

          <TabsContent value="schools" className="mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search schools…" value={schoolSearch} onChange={e => setSchoolSearch(e.target.value)} className="pl-9" />
              </div>
            </div>
            <div className="border rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Part</TableHead>
                    <TableHead>Cost Range</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSchools.map(school => (
                    <TableRow key={school.id} className="cursor-pointer" onClick={() => setEditSchool(school)}>
                      <TableCell className="font-medium">{school.name}</TableCell>
                      <TableCell>{school.city}, {school.state}</TableCell>
                      <TableCell>{school.part_type ?? "—"}</TableCell>
                      <TableCell>{formatCost(school.true_cost_min ?? school.advertised_cost_min, school.true_cost_max ?? school.advertised_cost_max)}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${school.is_active !== false ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {school.is_active !== false ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-3.5 w-3.5" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="mt-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search jobs…" value={jobSearch} onChange={e => setJobSearch(e.target.value)} className="pl-9" />
              </div>
              <Button onClick={() => setNewJob(true)} className="gap-1.5">
                <Plus className="h-4 w-4" /> Add Job
              </Button>
            </div>
            <div className="border rounded-xl overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Company</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredJobs.map(job => (
                    <TableRow key={job.id} className="cursor-pointer" onClick={() => setEditJob(job)}>
                      <TableCell className="font-medium">{job.job_title}</TableCell>
                      <TableCell>{job.company_name}</TableCell>
                      <TableCell>{job.location ?? "—"}</TableCell>
                      <TableCell>{job.job_type ?? "—"}</TableCell>
                      <TableCell>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${job.is_active !== false ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                          {job.is_active !== false ? "Active" : "Inactive"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" className="h-7 w-7"><Pencil className="h-3.5 w-3.5" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            {pendingReviews.length === 0 ? (
              <div className="text-center py-16 text-muted-foreground">
                <Check className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-lg font-medium">No pending reviews</p>
                <p className="text-sm">All reviews have been moderated.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingReviews.map((review) => (
                  <div key={review.id} className="border rounded-xl p-5 bg-card">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex text-accent">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} className={`w-4 h-4 ${i < (review.overall_rating ?? 0) ? "fill-current" : "opacity-30"}`} />
                            ))}
                          </div>
                          {review.schools && (
                            <span className="text-xs text-muted-foreground">
                              for <span className="font-medium text-foreground">{review.schools.name}</span>
                            </span>
                          )}
                        </div>
                        {review.review_title && (
                          <p className="font-semibold text-foreground">{review.review_title}</p>
                        )}
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{review.review_text}</p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          {review.certificate_trained_for && (
                            <span className="bg-muted px-2 py-0.5 rounded-full">{review.certificate_trained_for}</span>
                          )}
                          {review.created_at && (
                            <span>{formatDistanceToNow(new Date(review.created_at), { addSuffix: true })}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          onClick={() => approveReview(review.id)}
                          className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          <Check className="h-3.5 w-3.5" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteReview(review.id)}
                          className="gap-1.5 text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="h-3.5 w-3.5" /> Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {editSchool && (
        <SchoolEditModal school={editSchool} open={!!editSchool} onOpenChange={open => !open && setEditSchool(null)} />
      )}
      {editJob && (
        <JobEditModal job={editJob} open={!!editJob} onOpenChange={open => !open && setEditJob(null)} />
      )}
      {newJob && (
        <JobEditModal open={newJob} onOpenChange={setNewJob} isNew />
      )}
    </div>
  );
}
