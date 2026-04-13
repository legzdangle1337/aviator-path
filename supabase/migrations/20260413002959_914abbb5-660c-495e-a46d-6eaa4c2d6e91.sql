-- Change default so new reviews are hidden until approved
ALTER TABLE public.school_reviews ALTER COLUMN is_hidden SET DEFAULT true;

-- Admin can read all reviews including hidden
CREATE POLICY "Admins can read all reviews"
ON public.school_reviews
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin can update any review (approve/hide)
CREATE POLICY "Admins can update any review"
ON public.school_reviews
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Admin can delete reviews
CREATE POLICY "Admins can delete any review"
ON public.school_reviews
FOR DELETE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));