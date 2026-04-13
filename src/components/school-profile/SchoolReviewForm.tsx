import { useState } from "react";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const reviewSchema = z.object({
  title: z.string().max(120).optional(),
  body: z.string().min(50, "Review must be at least 50 characters").max(5000),
  pilotStage: z.string().optional(),
  attendedYear: z.coerce.number().int().min(2000).max(new Date().getFullYear()).optional().or(z.literal("")),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

const PILOT_STAGES = [
  "Researching",
  "Student Pilot",
  "Private Pilot",
  "Instrument Rated",
  "Commercial Pilot",
  "CFI / CFII",
  "ATP",
];

function StarSelector({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          onClick={() => onChange(star)}
          className="p-0.5 transition-transform hover:scale-110"
        >
          <Star
            className={`w-7 h-7 transition-colors ${
              star <= (hover || value)
                ? "fill-accent text-accent"
                : "text-border"
            }`}
          />
        </button>
      ))}
      {value > 0 && (
        <span className="ml-2 text-sm text-muted-foreground self-center">
          {value === 1 ? "Poor" : value === 2 ? "Fair" : value === 3 ? "Good" : value === 4 ? "Great" : "Excellent"}
        </span>
      )}
    </div>
  );
}

export function SchoolReviewForm({ schoolId }: { schoolId: string }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
  });

  const onSubmit = async (data: ReviewFormData) => {
    if (!user) return;
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("school_reviews").insert({
        school_id: schoolId,
        user_id: user.id,
        overall_rating: rating,
        review_title: data.title || null,
        review_text: data.body,
        certificate_trained_for: data.pilotStage || null,
        training_start_date: data.attendedYear ? `${data.attendedYear}-01-01` : null,
      });

      if (error) throw error;

      toast.success("Thanks! Your review is pending approval.");
      reset();
      setRating(0);
      queryClient.invalidateQueries({ queryKey: ["school-reviews"] });
    } catch {
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1999 }, (_, i) => currentYear - i);

  return (
    <div className="border rounded-xl p-6 bg-card">
      <h3 className="text-lg font-bold text-foreground mb-4">Write a Review</h3>

      {!user ? (
        <div className="text-center py-6">
          <p className="text-muted-foreground mb-3">Share your experience to help other student pilots</p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-gold text-gold-foreground font-semibold px-5 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
          >
            Sign in to write a review
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Overall Rating <span className="text-destructive">*</span>
            </label>
            <StarSelector value={rating} onChange={setRating} />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">Review Title</label>
            <Input
              placeholder="Summarize your experience"
              {...register("title")}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Your Review <span className="text-destructive">*</span>
            </label>
            <Textarea
              placeholder="Share details about your training experience, instructors, aircraft, and value (minimum 50 characters)"
              rows={5}
              {...register("body")}
            />
            {errors.body && (
              <p className="text-xs text-destructive mt-1">{errors.body.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Pilot Stage</label>
              <select
                {...register("pilotStage")}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm outline-none"
              >
                <option value="">Select...</option>
                {PILOT_STAGES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Year Attended</label>
              <select
                {...register("attendedYear")}
                className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm outline-none"
              >
                <option value="">Select...</option>
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-gold-foreground hover:opacity-90"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            Reviews are moderated before appearing publicly.
          </p>
        </form>
      )}
    </div>
  );
}
