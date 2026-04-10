
-- Add missing columns to cadet_programs
ALTER TABLE public.cadet_programs
  ADD COLUMN IF NOT EXISTS steps_json jsonb DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS requirements_must text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS requirements_preferred text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS interview_questions text[] DEFAULT '{}'::text[],
  ADD COLUMN IF NOT EXISTS hero_image_url text;

-- Create experiences table
CREATE TABLE public.cadet_program_experiences (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  program_id uuid NOT NULL REFERENCES public.cadet_programs(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  username text,
  year integer,
  outcome text NOT NULL CHECK (outcome IN ('accepted', 'waitlisted', 'rejected')),
  experience_text text NOT NULL,
  is_hidden boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.cadet_program_experiences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read visible experiences"
  ON public.cadet_program_experiences FOR SELECT
  USING (is_hidden = false);

CREATE POLICY "Authenticated users can insert own experiences"
  ON public.cadet_program_experiences FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own experiences"
  ON public.cadet_program_experiences FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own experiences"
  ON public.cadet_program_experiences FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
