import { useParams, Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useCadetProgram } from "@/hooks/useCadetPrograms";
import { ProgramHero } from "@/components/cadet-programs/ProgramHero";
import { ProgramMetrics } from "@/components/cadet-programs/ProgramMetrics";
import { ProgramSteps } from "@/components/cadet-programs/ProgramSteps";
import { ProgramRequirements } from "@/components/cadet-programs/ProgramRequirements";
import { ProgramPartnerSchools } from "@/components/cadet-programs/ProgramPartnerSchools";
import { ProgramExperiences } from "@/components/cadet-programs/ProgramExperiences";
import { InterviewPrep } from "@/components/cadet-programs/InterviewPrep";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from "react-helmet-async";

export default function CadetProgramDetail() {
  const { slug } = useParams<{ slug: string }>();
  const { data: program, isLoading, error } = useCadetProgram(slug);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <Skeleton className="w-full h-[300px]" />
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !program) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Program Not Found</h1>
          <p className="text-muted-foreground mb-4">The cadet program you're looking for doesn't exist.</p>
          <Link to="/cadet-programs" className="text-primary hover:underline">← Back to all programs</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{`${program.airline_name} ${program.program_name} Review 2026 | Aviator Path`}</title>
        <meta
          name="description"
          content={`Complete guide to ${program.airline_name}'s ${program.program_name}. ${program.conditional_job_offer ? "Conditional Job Offer included." : ""} Requirements, interview prep, and pilot experiences.`}
        />
        <link rel="canonical" href={`https://aviatorpath.com/cadet-programs/${program.slug}`} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://aviatorpath.com/" },
            { "@type": "ListItem", "position": 2, "name": "Cadet Programs", "item": "https://aviatorpath.com/cadet-programs" },
            { "@type": "ListItem", "position": 3, "name": program.program_name, "item": `https://aviatorpath.com/cadet-programs/${program.slug}` }
          ]
        })}</script>
      </Helmet>

      <Navbar />

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <div className="text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">›</span>
          <Link to="/cadet-programs" className="hover:text-foreground">Cadet Programs</Link>
          <span className="mx-2">›</span>
          <span className="text-foreground">{program.program_name}</span>
        </div>
      </div>

      <ProgramHero program={program} />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
        <ProgramMetrics program={program} />

        {/* About */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-4">About This Program</h2>
          <div className="text-muted-foreground leading-relaxed whitespace-pre-line">
            {program.long_description || program.description || "No description available."}
          </div>
          {program.what_happens_after && (
            <div className="mt-6 border-l-4 border-primary pl-4">
              <h3 className="font-semibold text-foreground mb-1">What Happens After?</h3>
              <p className="text-sm text-muted-foreground">{program.what_happens_after}</p>
            </div>
          )}
        </section>

        <ProgramSteps program={program} />
        <ProgramRequirements program={program} />
        <ProgramPartnerSchools program={program} />
        <ProgramExperiences program={program} />
        <InterviewPrep program={program} />
      </div>

      <Footer />
    </div>
  );
}
