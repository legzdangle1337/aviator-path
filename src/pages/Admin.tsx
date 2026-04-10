import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SchoolEditModal } from "@/components/admin/SchoolEditModal";
import { JobEditModal } from "@/components/admin/JobEditModal";
import { Pencil, Plus, Search } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";
import { Helmet } from "react-helmet-async";

type School = Tables<"schools">;
type Job = Tables<"jobs">;

export default function Admin() {
  const [schoolSearch, setSchoolSearch] = useState("");
  const [jobSearch, setJobSearch] = useState("");
  const [editSchool, setEditSchool] = useState<School | null>(null);
  const [editJob, setEditJob] = useState<Job | null>(null);
  const [newJob, setNewJob] = useState(false);

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
      // Admin needs to see all jobs including inactive, but RLS only returns is_active=true
      // We'll show what RLS returns for now
      const { data } = await supabase.from("jobs").select("*").order("posted_date", { ascending: false });
      return data ?? [];
    },
  });

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
