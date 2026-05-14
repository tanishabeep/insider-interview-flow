
-- position_library
CREATE TABLE public.position_library (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  topic TEXT NOT NULL,
  stance TEXT NOT NULL,
  reasoning TEXT,
  evidence JSONB NOT NULL DEFAULT '[]'::jsonb,
  confidence NUMERIC NOT NULL DEFAULT 0,
  source TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.position_library ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own position select" ON public.position_library FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own position insert" ON public.position_library FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own position update" ON public.position_library FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own position delete" ON public.position_library FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_position_library_user ON public.position_library(user_id);
CREATE TRIGGER position_library_updated_at BEFORE UPDATE ON public.position_library
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- attack_map_profiles
CREATE TABLE public.attack_map_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  profile_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
  hot_zones JSONB NOT NULL DEFAULT '[]'::jsonb,
  weak_spots JSONB NOT NULL DEFAULT '[]'::jsonb,
  predicted_lines JSONB NOT NULL DEFAULT '[]'::jsonb,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.attack_map_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own attack select" ON public.attack_map_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own attack insert" ON public.attack_map_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own attack update" ON public.attack_map_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own attack delete" ON public.attack_map_profiles FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_attack_map_user ON public.attack_map_profiles(user_id);
CREATE TRIGGER attack_map_updated_at BEFORE UPDATE ON public.attack_map_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- interview_dates
CREATE TABLE public.interview_dates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  institute TEXT NOT NULL,
  interview_date DATE NOT NULL,
  panel_notes TEXT,
  status TEXT NOT NULL DEFAULT 'upcoming',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.interview_dates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own date select" ON public.interview_dates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own date insert" ON public.interview_dates FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own date update" ON public.interview_dates FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own date delete" ON public.interview_dates FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_interview_dates_user ON public.interview_dates(user_id);
CREATE TRIGGER interview_dates_updated_at BEFORE UPDATE ON public.interview_dates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- opinion_logs
CREATE TABLE public.opinion_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  topic TEXT NOT NULL,
  position TEXT NOT NULL,
  summary TEXT,
  sentiment TEXT,
  source_attempt_id UUID,
  source_response_id UUID,
  stated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.opinion_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own opinion select" ON public.opinion_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own opinion insert" ON public.opinion_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own opinion update" ON public.opinion_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own opinion delete" ON public.opinion_logs FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_opinion_logs_user_topic ON public.opinion_logs(user_id, topic);
