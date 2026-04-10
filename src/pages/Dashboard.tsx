import { Routes, Route, Navigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, Plane, GraduationCap, Briefcase, School, Settings, Crown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import DashboardOverview from "@/components/dashboard/DashboardOverview";
import DashboardProgress from "@/components/dashboard/DashboardProgress";
import DashboardSavedSchools from "@/components/dashboard/DashboardSavedSchools";
import DashboardSavedJobs from "@/components/dashboard/DashboardSavedJobs";
import DashboardSavedScholarships from "@/components/dashboard/DashboardSavedScholarships";
import DashboardSettings from "@/components/dashboard/DashboardSettings";

const NAV_ITEMS = [
  { label: "Overview", icon: BarChart3, path: "" },
  { label: "My Progress", icon: Plane, path: "progress" },
  { label: "Saved Schools", icon: School, path: "schools" },
  { label: "Saved Jobs", icon: Briefcase, path: "jobs" },
  { label: "Saved Scholarships", icon: GraduationCap, path: "scholarships" },
  { label: "Settings", icon: Settings, path: "settings" },
];

const MOBILE_TABS = [
  { label: "Home", icon: BarChart3, path: "" },
  { label: "Progress", icon: Plane, path: "progress" },
  { label: "Schools", icon: School, path: "schools" },
  { label: "Jobs", icon: Briefcase, path: "jobs" },
  { label: "Settings", icon: Settings, path: "settings" },
];

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase.from("profiles").select("*").eq("id", user!.id).single();
      return data;
    },
    enabled: !!user,
  });

  const currentPath = location.pathname.replace("/dashboard", "").replace(/^\//, "");

  const initials = profile
    ? `${(profile.first_name || "")[0] || ""}${(profile.last_name || "")[0] || ""}`.toUpperCase() || "U"
    : "U";

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      {/* Top header */}
      <header className="h-14 bg-background border-b border-border flex items-center justify-between px-4 lg:px-8 shrink-0 z-30">
        <Link to="/" className="flex items-center gap-1 text-xl font-bold">
          <span className="text-[hsl(var(--gold))]">✈</span>
          <span className="text-[hsl(var(--navy))]">Aviator Path</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
          <button onClick={signOut} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Sign Out
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex flex-col w-60 bg-background border-r border-border shrink-0">
          <div className="p-5 border-b border-border">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={profile?.avatar_url || undefined} />
                <AvatarFallback className="bg-[hsl(var(--navy))] text-primary-foreground text-sm">{initials}</AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-sm font-semibold truncate">{profile?.first_name || "Pilot"} {profile?.last_name || ""}</p>
                {profile?.pilot_stage && (
                  <Badge variant="secondary" className="text-xs mt-0.5">{profile.pilot_stage}</Badge>
                )}
              </div>
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const active = currentPath === item.path;
              return (
                <Link
                  key={item.path}
                  to={`/dashboard${item.path ? `/${item.path}` : ""}`}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    active
                      ? "bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-border">
            {profile?.is_pro ? (
              <div className="flex items-center gap-2 px-3 py-2 text-sm">
                <Crown className="h-4 w-4 text-[hsl(var(--gold))]" />
                <span className="font-medium text-[hsl(var(--gold))]">You're Pro</span>
              </div>
            ) : (
              <Link
                to="/dashboard/settings"
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium bg-[hsl(var(--gold))]/10 text-[hsl(var(--gold))] hover:bg-[hsl(var(--gold))]/20 transition-colors"
              >
                <Crown className="h-4 w-4" />
                Upgrade to Pro
              </Link>
            )}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="max-w-5xl mx-auto px-4 lg:px-8 py-6">
            <Routes>
              <Route index element={<DashboardOverview profile={profile} />} />
              <Route path="progress" element={<DashboardProgress profile={profile} />} />
              <Route path="schools" element={<DashboardSavedSchools />} />
              <Route path="jobs" element={<DashboardSavedJobs />} />
              <Route path="scholarships" element={<DashboardSavedScholarships />} />
              <Route path="settings" element={<DashboardSettings profile={profile} />} />
            </Routes>
          </div>
        </main>
      </div>

      {/* Mobile bottom tabs */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border flex z-30">
        {MOBILE_TABS.map((item) => {
          const active = currentPath === item.path;
          return (
            <Link
              key={item.path}
              to={`/dashboard${item.path ? `/${item.path}` : ""}`}
              className={cn(
                "flex-1 flex flex-col items-center gap-1 py-2 text-xs font-medium transition-colors",
                active ? "text-[hsl(var(--primary))]" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
