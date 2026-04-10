import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { Tables } from "@/integrations/supabase/types";

type School = Tables<"schools">;
type Review = Tables<"school_reviews">;

function RatingBar({ label, value }: { label: string; value: number | null }) {
  const v = value ?? 0;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-28 text-muted-foreground">{label}</span>
      <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-accent rounded-full" style={{ width: `${(v / 5) * 100}%` }} />
      </div>
      <span className="w-8 text-right font-medium text-foreground">{v.toFixed(1)}</span>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="border rounded-xl p-5 bg-card space-y-3">
      <div className="flex items-center gap-2">
        <div className="flex text-accent">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < (review.overall_rating ?? 0) ? "fill-current" : "opacity-30"}`} />
          ))}
        </div>
        {review.is_verified && <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Verified</span>}
      </div>
      {review.review_title && <p className="font-semibold text-foreground">{review.review_title}</p>}
      <p className="text-sm text-muted-foreground leading-relaxed">{review.review_text}</p>
      {review.certificate_trained_for && (
        <p className="text-xs text-muted-foreground">Trained for: {review.certificate_trained_for}</p>
      )}
      <div className="flex gap-4 text-xs text-muted-foreground pt-2">
        <button className="flex items-center gap-1 hover:text-foreground"><ThumbsUp className="w-3 h-3" /> {review.helpful_count || 0}</button>
        <button className="flex items-center gap-1 hover:text-foreground"><ThumbsDown className="w-3 h-3" /> {review.not_helpful_count || 0}</button>
      </div>
      {review.school_response && (
        <div className="ml-4 mt-2 bg-muted rounded-lg p-3 text-sm">
          <p className="text-xs font-semibold text-foreground mb-1">Response from School</p>
          <p className="text-muted-foreground">{review.school_response}</p>
        </div>
      )}
    </div>
  );
}

export function SchoolReviews({ school, reviews }: { school: School; reviews: Review[] }) {
  const [sort, setSort] = useState<string>("recent");

  const sorted = [...reviews].sort((a, b) => {
    if (sort === "helpful") return (b.helpful_count ?? 0) - (a.helpful_count ?? 0);
    if (sort === "highest") return (b.overall_rating ?? 0) - (a.overall_rating ?? 0);
    if (sort === "lowest") return (a.overall_rating ?? 0) - (b.overall_rating ?? 0);
    return new Date(b.created_at ?? "").getTime() - new Date(a.created_at ?? "").getTime();
  });

  const avgRating = reviews.length > 0
    ? reviews.reduce((s, r) => s + (r.overall_rating ?? 0), 0) / reviews.length
    : 0;
  const avgInstructor = reviews.length > 0 ? reviews.reduce((s, r) => s + (r.instructor_rating ?? 0), 0) / reviews.length : 0;
  const avgAircraft = reviews.length > 0 ? reviews.reduce((s, r) => s + (r.aircraft_rating ?? 0), 0) / reviews.length : 0;
  const avgOrg = reviews.length > 0 ? reviews.reduce((s, r) => s + (r.organization_rating ?? 0), 0) / reviews.length : 0;
  const avgValue = reviews.length > 0 ? reviews.reduce((s, r) => s + (r.value_rating ?? 0), 0) / reviews.length : 0;
  const recommendPct = reviews.length > 0 ? Math.round((reviews.filter(r => r.would_recommend).length / reviews.length) * 100) : 0;

  return (
    <section id="reviews" className="scroll-mt-20">
      <h2 className="text-2xl font-bold text-foreground mb-6">Student & CFI Reviews</h2>

      {reviews.length > 0 ? (
        <>
          <div className="border rounded-xl p-6 bg-card mb-6 grid md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center justify-center">
              <span className="text-5xl font-bold text-foreground">{avgRating.toFixed(1)}</span>
              <div className="flex text-accent mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < Math.round(avgRating) ? "fill-current" : "opacity-30"}`} />
                ))}
              </div>
              <span className="text-sm text-muted-foreground mt-1">{reviews.length} reviews</span>
            </div>
            <div className="space-y-2">
              <RatingBar label="Instructors" value={avgInstructor} />
              <RatingBar label="Aircraft" value={avgAircraft} />
              <RatingBar label="Organization" value={avgOrg} />
              <RatingBar label="Value" value={avgValue} />
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-foreground">{recommendPct}%</span>
              <span className="text-sm text-muted-foreground">Would Recommend</span>
            </div>
          </div>

          <div className="flex gap-2 mb-4 flex-wrap">
            {[
              { key: "recent", label: "Most Recent" },
              { key: "helpful", label: "Most Helpful" },
              { key: "highest", label: "Highest" },
              { key: "lowest", label: "Lowest" },
            ].map(s => (
              <Button key={s.key} variant={sort === s.key ? "default" : "outline"} size="sm" onClick={() => setSort(s.key)}>
                {s.label}
              </Button>
            ))}
          </div>

          <div className="space-y-4">
            {sorted.map(r => <ReviewCard key={r.id} review={r} />)}
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg mb-2">No reviews yet</p>
          <p className="text-sm">Be the first to share your experience at {school.name}.</p>
        </div>
      )}
    </section>
  );
}
