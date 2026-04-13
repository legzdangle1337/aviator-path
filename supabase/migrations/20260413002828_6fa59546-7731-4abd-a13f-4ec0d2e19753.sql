CREATE POLICY "Admins can read all jobs"
ON public.jobs
FOR SELECT
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));