
-- =============== PROFILES ===============
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  stream TEXT,
  hobbies TEXT[],
  sop_interests TEXT,
  streak INT NOT NULL DEFAULT 0,
  xp INT NOT NULL DEFAULT 0,
  readiness_score NUMERIC NOT NULL DEFAULT 0,
  current_affairs_score NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile select" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "own profile delete" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER profiles_updated BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', NEW.email));
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============== QUIZ ATTEMPTS ===============
CREATE TABLE public.quiz_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_type TEXT NOT NULL,
  category TEXT,
  score INT NOT NULL DEFAULT 0,
  accuracy NUMERIC NOT NULL DEFAULT 0,
  time_taken INT NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own attempts select" ON public.quiz_attempts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own attempts insert" ON public.quiz_attempts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own attempts update" ON public.quiz_attempts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own attempts delete" ON public.quiz_attempts FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_quiz_attempts_user ON public.quiz_attempts(user_id, completed_at DESC);

-- =============== DOMAIN STATS ===============
CREATE TABLE public.current_affairs_domain_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  attempts INT NOT NULL DEFAULT 0,
  accuracy NUMERIC NOT NULL DEFAULT 0,
  consistency NUMERIC NOT NULL DEFAULT 0,
  retention NUMERIC NOT NULL DEFAULT 0,
  weak_areas TEXT[],
  trend NUMERIC NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, domain)
);
ALTER TABLE public.current_affairs_domain_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own domain select" ON public.current_affairs_domain_stats FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own domain insert" ON public.current_affairs_domain_stats FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own domain update" ON public.current_affairs_domain_stats FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own domain delete" ON public.current_affairs_domain_stats FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER domain_stats_updated BEFORE UPDATE ON public.current_affairs_domain_stats
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============== STREAKS ===============
CREATE TABLE public.streaks (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INT NOT NULL DEFAULT 0,
  longest_streak INT NOT NULL DEFAULT 0,
  quiz_frequency NUMERIC NOT NULL DEFAULT 0,
  history JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own streak select" ON public.streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own streak insert" ON public.streaks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own streak update" ON public.streaks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own streak delete" ON public.streaks FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER streaks_updated BEFORE UPDATE ON public.streaks
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============== XP PROGRESS ===============
CREATE TABLE public.xp_progress (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  xp INT NOT NULL DEFAULT 0,
  level INT NOT NULL DEFAULT 1,
  milestones JSONB NOT NULL DEFAULT '[]'::jsonb,
  achievements JSONB NOT NULL DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.xp_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own xp select" ON public.xp_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own xp insert" ON public.xp_progress FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own xp update" ON public.xp_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own xp delete" ON public.xp_progress FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER xp_updated BEFORE UPDATE ON public.xp_progress
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============== OPEN-ENDED RESPONSES ===============
CREATE TABLE public.open_ended_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,
  evaluation TEXT,
  confidence_score NUMERIC,
  communication_score NUMERIC,
  clarity_score NUMERIC,
  originality_score NUMERIC,
  logical_consistency_score NUMERIC,
  overall_score NUMERIC,
  strengths TEXT[],
  weaknesses TEXT[],
  follow_up_questions TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.open_ended_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own resp select" ON public.open_ended_responses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own resp insert" ON public.open_ended_responses FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own resp update" ON public.open_ended_responses FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own resp delete" ON public.open_ended_responses FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_open_ended_user ON public.open_ended_responses(user_id, created_at DESC);

-- =============== REAL INTERVIEW ARCHIVE (PUBLIC READ) ===============
CREATE TABLE public.real_interview_archive (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  panel_type TEXT,
  candidate_background TEXT,
  interview_flow JSONB NOT NULL DEFAULT '[]'::jsonb,
  grilling_themes TEXT[],
  stress_moments JSONB NOT NULL DEFAULT '[]'::jsonb,
  best_answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  weak_answers JSONB NOT NULL DEFAULT '[]'::jsonb,
  lessons_learned TEXT[],
  tags TEXT[],
  difficulty TEXT,
  duration_minutes INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.real_interview_archive ENABLE ROW LEVEL SECURITY;
CREATE POLICY "archive public read" ON public.real_interview_archive FOR SELECT USING (true);
CREATE TRIGGER archive_updated BEFORE UPDATE ON public.real_interview_archive
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
