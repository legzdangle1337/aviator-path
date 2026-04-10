import { useParams } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { useSchool, useSchoolReviews, useSimilarSchools } from "@/hooks/useSchool";
import { SchoolHero } from "@/components/school-profile/SchoolHero";
import { SchoolQuickStats } from "@/components/school-profile/SchoolQuickStats";
import { SchoolStickyNav } from "@/components/school-profile/SchoolStickyNav";
import { SchoolOverview } from "@/components/school-profile/SchoolOverview";
import { SchoolFleet } from "@/components/school-profile/SchoolFleet";
import { SchoolPrograms } from "@/components/school-profile/SchoolPrograms";
import { SchoolPartnerships } from "@/components/school-profile/SchoolPartnerships";
import { SchoolFinancing } from "@/components/school-profile/SchoolFinancing";
import { SchoolReviews } from "@/components/school-profile/SchoolReviews";
import { SchoolLocation } from "@/components/school-profile/SchoolLocation";
import { SchoolContact } from "@/components/school-profile/SchoolContact";
import { SchoolSimilar } from "@/components/school-profile/SchoolSimilar";
import { SchoolClaimCta } from "@/components/school-profile/SchoolClaimCta";
import { Skeleton } from "@/components/ui/skeleton";
import { Helmet } from "react-helmet-async";

export default function SchoolProfile() {
  const { slug } = useParams<{ slug: string }>();
  const { data: school, isLoading, error } = useSchool(slug);
  const { data: reviews = [] } = useSchoolReviews(school?.id);
  const { data: similarSchools = [] } = useSimilarSchools(school?.state, school?.id);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <Skeleton className="w-full h-[400px]" />
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
          <Skeleton className="h-8 w-1/2" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">School Not Found</h1>
          <p className="text-muted-foreground">The school you're looking for doesn't exist or has been removed.</p>
        </div>
        <Footer />
      </div>
    );
  }

  const costMin = school.true_cost_min ?? school.advertised_cost_min;
  const costMax = school.true_cost_max ?? school.advertised_cost_max;
  const costStr = costMin && costMax
    ? `$${Math.round(costMin / 1000)}K - $${Math.round(costMax / 1000)}K`
    : costMin ? `From $${Math.round(costMin / 1000)}K` : "Contact for pricing";

  const schemaData = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "EducationalOrganization"],
    name: school.name,
    address: {
      "@type": "PostalAddress",
      addressLocality: school.city,
      addressRegion: school.state,
      streetAddress: school.address,
      postalCode: school.zip,
    },
    telephone: school.phone,
    url: school.website,
    ...(school.aviatorpath_rating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: school.aviatorpath_rating,
        reviewCount: school.aviatorpath_review_count || 0,
        bestRating: 5,
      },
    }),
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>{`${school.name} Review & Information 2026 | Aviator Path`}</title>
        <meta
          name="description"
          content={`Complete info on ${school.name} in ${school.city}, ${school.state}. True costs: ${costStr}. ${school.aviatorpath_review_count || 0} reviews, fleet details, and airline partnerships on AviatorPath.`}
        />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      <Navbar />

      {school.editors_pick && (
        <div className="w-full bg-accent text-accent-foreground text-center py-2 text-sm font-semibold">
          ✈ Editor's Pick
        </div>
      )}

      <SchoolHero school={school} />
      <SchoolQuickStats school={school} />
      <SchoolStickyNav />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-16">
        <SchoolOverview school={school} />
        <SchoolPartnerships school={school} />
        <SchoolFleet school={school} />
        <SchoolPrograms school={school} />
        <SchoolFinancing school={school} />
        <SchoolReviews school={school} reviews={reviews} />
        <SchoolLocation school={school} />
        <SchoolSimilar schools={similarSchools} />
        <SchoolContact school={school} />
        {!school.is_claimed && <SchoolClaimCta school={school} />}
      </div>

      <Footer />
    </div>
  );
}
