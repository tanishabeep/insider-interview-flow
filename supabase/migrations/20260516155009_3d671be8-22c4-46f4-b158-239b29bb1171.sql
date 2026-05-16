CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  stream text,
  iim text,
  sop_worry text,
  source text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  converted boolean NOT NULL DEFAULT false
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public insert leads" ON public.leads FOR INSERT TO anon, authenticated WITH CHECK (true);