import { Link } from "react-router-dom";
import { AlertTriangle, ArrowDown } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ComparisonMatrix } from "@/components/cadet-programs/ComparisonMatrix";
import { ProgramCard } from "@/components/cadet-programs/ProgramCard";
import { useCadetPrograms } from "@/hooks/useCadetPrograms";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from "react-helmet-async";

export default function CadetPrograms() {
  const { data: programs, isLoading } = useCadetPrograms();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Airline Cadet Programs 2026 — Compare All Pathways | Aviator Path</title>
        <meta name="description" content="Compare every airline cadet program side-by-side. Southwest D225, United Aviate, Delta Propel, and more. Find your direct pathway to the airlines." />
      </Helmet>

      <Navbar />

      {/* Header */}
      <div className="bg-[hsl(var(--navy))] text-white">
        <div className="max-w-6xl mx-auto px-4 py-12 md:py-16">
          <Link to="/" className="text-sm text-white/60 hover:text-white/80 mb-4 inline-block">Home › Cadet Programs</Link>
          <h1 className="text-3xl md:text-5xl font-bold leading-tight">Airline Cadet Programs</h1>
          <p className="text-lg text-white/80 mt-3 max-w-2xl">
            Your direct pathway to the airlines — every program compared in one place
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full space-y-12">
        {/* Urgent Callout */}
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-5 md:p-6">
          <div className="flex gap-3">
            <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-bold text-amber-900 text-lg">Industry Alert — 2026</h2>
              <p className="text-amber-800 mt-1 leading-relaxed">
                Aero Crew Solutions reports that it is <strong>"extremely difficult to be hired by a regional airline without being part of a cadet program."</strong> If you are in flight training, apply to multiple programs now.
              </p>
              <p className="text-xs text-amber-600 mt-2">Source: Aero Crew Solutions, January 2026</p>
              <button
                onClick={() => document.getElementById("programs-grid")?.scrollIntoView({ behavior: "smooth" })}
                className="mt-3 inline-flex items-center gap-2 bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors"
              >
                Browse All Programs Below <ArrowDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Comparison Matrix */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">Program Comparison</h2>
          <p className="text-muted-foreground mb-6">All programs at a glance — scroll horizontally to see all metrics</p>
          {isLoading ? (
            <Skeleton className="h-64 w-full rounded-xl" />
          ) : programs && programs.length > 0 ? (
            <ComparisonMatrix programs={programs} />
          ) : (
            <p className="text-muted-foreground">No programs found.</p>
          )}
        </section>

        {/* Program Cards Grid */}
        <section id="programs-grid">
          <h2 className="text-2xl font-bold text-foreground mb-6">All Cadet Programs</h2>
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 9 }).map((_, i) => (
                <Skeleton key={i} className="h-56 rounded-xl" />
              ))}
            </div>
          ) : programs && programs.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((p) => (
                <ProgramCard key={p.id} program={p} />
              ))}
            </div>
          ) : null}
        </section>
      </div>

      <Footer />
    </div>
  );
}
