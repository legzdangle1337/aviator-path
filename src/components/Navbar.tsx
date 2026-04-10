import { useState } from "react";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinks = [
  { label: "Schools", href: "/schools" },
  { label: "Jobs", href: "/jobs" },
  { label: "Cadet Programs", href: "/cadet-programs" },
  { label: "Scholarships", href: "/scholarships" },
  { label: "Financing", href: "/financing" },
  { label: "Community", href: "#community" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, signOut } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["navbar-profile", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("first_name, last_name, avatar_url, pilot_stage")
        .eq("id", user!.id)
        .single();
      return data;
    },
    enabled: !!user,
  });

  const initials = profile
    ? `${(profile.first_name || "")[0] || ""}${(profile.last_name || "")[0] || ""}`.toUpperCase() || "U"
    : "U";

  const displayName = profile?.first_name
    ? `${profile.first_name}${profile.last_name ? ` ${profile.last_name[0]}.` : ""}`
    : "Pilot";

  return (
    <nav className="sticky top-0 z-50 h-16 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto h-full flex items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-1 text-xl font-bold tracking-tight">
          <span className="text-[hsl(var(--gold))]">✈</span>
          <span className="text-[hsl(var(--navy))]">Aviator Path</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA / User menu */}
        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger className="flex items-center gap-2 hover:opacity-80 transition-opacity outline-none">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-[hsl(var(--navy))] text-primary-foreground text-xs">{initials}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-foreground">{displayName}</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard" className="cursor-pointer">Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/progress" className="cursor-pointer">My Progress</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard/settings" className="cursor-pointer">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-[hsl(var(--navy))] hover:opacity-80 transition-opacity">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-sm font-semibold bg-[hsl(var(--gold))] text-[hsl(var(--gold-foreground))] px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden p-2 text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 top-16 z-40">
          <div className="absolute inset-0 bg-foreground/20" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-72 bg-background shadow-xl p-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-base font-medium text-foreground py-2 border-b border-border"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 flex flex-col gap-3">
              {user ? (
                <>
                  <div className="flex items-center gap-3 pb-3 border-b border-border">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={profile?.avatar_url || undefined} />
                      <AvatarFallback className="bg-[hsl(var(--navy))] text-primary-foreground text-xs">{initials}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-semibold">{displayName}</span>
                  </div>
                  <Link to="/dashboard" onClick={() => setOpen(false)} className="text-sm font-medium">Dashboard</Link>
                  <Link to="/dashboard/settings" onClick={() => setOpen(false)} className="text-sm font-medium">Settings</Link>
                  <button onClick={() => { signOut(); setOpen(false); }} className="text-sm font-medium text-destructive text-left">Sign Out</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium text-[hsl(var(--navy))]" onClick={() => setOpen(false)}>Sign In</Link>
                  <Link
                    to="/signup"
                    className="text-sm font-semibold bg-[hsl(var(--gold))] text-[hsl(var(--gold-foreground))] px-4 py-2 rounded-lg text-center"
                    onClick={() => setOpen(false)}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
