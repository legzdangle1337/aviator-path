
CREATE TABLE public.flight_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  date DATE NOT NULL,
  flight_type TEXT NOT NULL,
  hours NUMERIC(5,1) NOT NULL,
  aircraft TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.flight_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own flight_logs" ON public.flight_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own flight_logs" ON public.flight_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own flight_logs" ON public.flight_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own flight_logs" ON public.flight_logs FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_flight_logs_user_id ON public.flight_logs(user_id);
CREATE INDEX idx_flight_logs_date ON public.flight_logs(user_id, date);
