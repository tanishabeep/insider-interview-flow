import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles, LogOut, Brain, Newspaper, Library, UserSearch,
  TrendingUp, TrendingDown, Activity, Target, ArrowRight, BarChart3, Globe2,
  Zap,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { DashShell } from "@/components/dash/Sidebar";
import { RecommendedPath } from "@/components/dash/RecommendedPath";
import {
  IllQuiz, IllInterview, IllProfile, IllGlobe, IllBooks, IllAnalytics,
  IllFlame, IllShield,
} from "@/components/illustrations";

export const Route = createFileRoute("/dashboard")({
  component: Dashboard,
});

function Dashboard() {
  const { user, loading, signOut } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!loading && !user) nav({ to: "/login" });
  }, [user, loading, nav]);

  if (loading || !user) {
    return (
      <div className="mesh-bg grid min-h-screen place-items-center">
        <div className="glass-panel rounded-2xl px-6 py-4 text-sm text-muted-foreground">Loading your command center…</div>
      </div>
    );
  }

  const firstName = (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ?? "Aspirant";

  return (
    <DashShell>
      <DashHeader name={firstName} onSignOut={() => signOut().then(() => nav({ to: "/" }))} />

      <div className="mx-auto max-w-7xl px-6 md:px-12 xl:px-16 pb-24 pt-8">
        <Greeting name={firstName} />
        <div className="mt-12">
          <RecommendedPath />
        </div>
        <div className="mt-10 grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <div className="space-y-8">
            <ReadinessHero />
            <EvaluatorInsights />
            <QuickActions />
            <RecentSessions />
          </div>
          <div className="space-y-8">
            <CurrentAffairsPanel />
            <StreakCard />
            <ProfileGrillingTeaser />
          </div>
        </div>
      </div>
    </DashShell>
  );
}

function DashHeader({ name, onSignOut }: { name: string; onSignOut: () => void }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 font-display font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          IPM Ace
        </Link>
        <div className="flex items-center gap-3">
          <div className="hidden rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground sm:block">
            Welcome, <span className="font-semibold text-foreground">{name}</span>
          </div>
          <button
            onClick={onSignOut}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </div>
    </header>
  );
}

function Greeting({ name }: { name: string }) {
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-wrap items-end justify-between gap-4"
    >
      <div>
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{greet}</div>
        <h1 className="mt-1 font-display text-3xl font-semibold md:text-4xl">{name}, ready for two minutes?</h1>
      </div>
      <Link
        to="/quiz"
        className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-glow px-5 py-3 text-sm font-semibold text-primary-foreground shadow-[0_16px_40px_-16px_oklch(0.55_0.22_270/0.55)] transition-transform hover:scale-[1.03]"
      >
        Start today's sprint
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </motion.div>
  );
}

function ReadinessHero() {
  const score = 73;
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05, duration: 0.6 }}
      className="glass-panel relative overflow-hidden rounded-3xl p-7"
    >
      <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-primary/15 to-accent/20 blur-3xl" aria-hidden />
      <div className="relative grid gap-6 md:grid-cols-[auto_1fr]">
        <div className="flex items-center gap-5">
          <RadialMeter value={score} />
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Interview readiness</div>
            <div className="mt-1 font-display text-3xl font-semibold">{score}<span className="text-base text-muted-foreground"> / 100</span></div>
            <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
              <TrendingUp className="h-3 w-3" /> +6 this week
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Mini icon={<Activity className="h-3.5 w-3.5" />} v="82" l="Clarity" />
          <Mini icon={<Brain className="h-3.5 w-3.5" />} v="74" l="Structure" />
          <Mini icon={<Target className="h-3.5 w-3.5" />} v="68" l="Confidence" />
          <Mini icon={<BarChart3 className="h-3.5 w-3.5" />} v="91" l="Originality" />
        </div>
      </div>
    </motion.div>
  );
}

function RadialMeter({ value }: { value: number }) {
  const r = 38;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative h-24 w-24">
      <svg viewBox="0 0 100 100" className="-rotate-90">
        <circle cx="50" cy="50" r={r} stroke="oklch(0.92 0.01 270)" strokeWidth="8" fill="none" />
        <motion.circle
          cx="50" cy="50" r={r}
          stroke="url(#g1)" strokeWidth="8" fill="none" strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        />
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.45 0.22 270)" />
            <stop offset="100%" stopColor="oklch(0.62 0.24 285)" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

function Mini({ icon, v, l }: { icon: React.ReactNode; v: string; l: string }) {
  return (
    <motion.div whileHover={{ y: -3 }} className="rounded-2xl border border-border bg-card/70 p-3">
      <div className="text-muted-foreground">{icon}</div>
      <div className="mt-1 font-display text-lg font-semibold">{v}</div>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{l}</div>
    </motion.div>
  );
}

function QuickActions() {
  const items = [
    { to: "/quiz", icon: Newspaper, title: "Quiz Engine",                body: "Pick a category. Sprint in 2 min",      tone: "primary" },
    { to: "/lab",  icon: Brain,     title: "Adaptive Interview Lab",     body: "Live AI panel that doesn't let go",       tone: "accent" },
    { to: "/grilling", icon: UserSearch, title: "Profile Grilling Intel", body: "Map your weak surfaces & traps",        tone: "primary" },
    { to: "/affairs",  icon: Globe2,     title: "Current Affairs Terminal", body: "Domain heatmap, trend, insights",     tone: "accent" },
    { to: "/evaluator", icon: BarChart3, title: "AI Evaluation Studio",   body: "5-dimension answer scoring",            tone: "primary" },
    { to: "/archive",   icon: Library,   title: "Real Interview Archive", body: "Reconstructed IIM panels",              tone: "accent" },
  ] as const;
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((it, i) => (
        <motion.div
          key={it.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 * i, duration: 0.5 }}
        >
          <Link to={it.to} className="glass-card group block rounded-2xl p-5">
            <div className="flex items-start gap-4">
              <span className={`grid h-10 w-10 place-items-center rounded-xl ${it.tone === "primary" ? "bg-primary/10 text-primary" : "bg-accent/20 text-accent-foreground"}`}>
                <it.icon className="h-4.5 w-4.5" />
              </span>
              <div className="flex-1">
                <div className="font-display text-base font-semibold">{it.title}</div>
                <div className="mt-0.5 text-xs text-muted-foreground">{it.body}</div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

function RecentSessions() {
  const rows = [
    { t: "Profile grilling. Why management at this age?", d: "Yesterday · 8 questions", s: 78 },
    { t: "Current affairs. India-EU FTA debate", d: "2 days ago · 6 questions", s: 84 },
    { t: "Stress drill. Defend your weakest score", d: "3 days ago · 5 questions", s: 62 },
  ];
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="glass-panel rounded-3xl p-6"
    >
      <div className="flex items-center justify-between">
        <div className="font-display text-lg font-semibold">Recent sessions</div>
        <span className="text-xs text-muted-foreground">Last 7 days</span>
      </div>
      <div className="mt-4 space-y-2">
        {rows.map((r, i) => (
          <motion.div
            key={i}
            whileHover={{ x: 3 }}
            className="flex items-center justify-between rounded-2xl border border-border bg-card/70 p-4"
          >
            <div>
              <div className="text-sm font-medium">{r.t}</div>
              <div className="text-[11px] text-muted-foreground">{r.d}</div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-1.5 w-24 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow" style={{ width: `${r.s}%` }} />
              </div>
              <span className="font-display text-sm font-semibold">{r.s}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function CurrentAffairsPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.6 }}
      className="glass-panel rounded-3xl p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current affairs intelligence</div>
          <div className="font-display text-lg font-semibold">Your domain map</div>
        </div>
        <Newspaper className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="mt-5 space-y-3">
        {[
          { l: "Geopolitics", v: 86, c: "from-primary to-primary-glow" },
          { l: "Economic policy", v: 48, c: "from-destructive/70 to-warning" },
          { l: "Indian politics", v: 71, c: "from-chart-3 to-primary" },
          { l: "Global trends", v: 64, c: "from-accent to-primary-glow" },
          { l: "Opinion drills", v: 39, c: "from-warning to-destructive/70" },
        ].map((d, i) => (
          <div key={d.l}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">{d.l}</span>
              <span className="font-semibold">{d.v}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${d.v}%` }}
                transition={{ delay: 0.3 + i * 0.08, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className={`h-full rounded-full bg-gradient-to-r ${d.c}`}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 rounded-2xl border border-border bg-gradient-to-br from-primary/5 via-transparent to-accent/5 p-4">
        <div className="flex items-start gap-2">
          <Globe2 className="mt-0.5 h-4 w-4 text-primary" />
          <div>
            <div className="text-xs font-semibold">Insight</div>
            <p className="mt-0.5 text-xs text-muted-foreground">
              You consistently struggle with <span className="font-semibold text-foreground">economic policy discussions</span> and
              <span className="font-semibold text-foreground"> opinion-based answering</span>. Add 2 opinion drills per day this week.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function StreakCard() {
  const days = [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1];
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.6 }}
      className="glass-panel rounded-3xl p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Streak</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-display text-3xl font-semibold">12</span>
            <span className="text-xs text-muted-foreground">days</span>
          </div>
        </div>
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-warning/30 to-warning/10 text-warning"
        >
          <Flame className="h-6 w-6" />
        </motion.div>
      </div>
      <div className="mt-5 flex gap-1.5">
        {days.map((d, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scaleY: 0.4 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: 0.3 + i * 0.04 }}
            className={`h-8 flex-1 rounded-md ${d ? "bg-gradient-to-b from-primary to-primary-glow" : "bg-muted"}`}
          />
        ))}
      </div>
    </motion.div>
  );
}

function ProfileGrillingTeaser() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.6 }}
      className="glass-panel relative overflow-hidden rounded-3xl p-6"
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/30 blur-3xl" aria-hidden />
      <div className="relative">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Profile grilling</div>
        <h3 className="mt-1 font-display text-lg font-semibold">Predict my weak surfaces</h3>
        <p className="mt-2 text-xs text-muted-foreground">Add your stream, hobbies and SOP. We map the panel's likely focus areas.</p>
        <Link to="/grilling" className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background transition-transform hover:scale-[1.03]">
          Build my profile <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </motion.div>
  );
}

type EvalRow = {
  id: string;
  created_at: string;
  category: string | null;
  question: string;
  overall_score: number | null;
  confidence_score: number | null;
  communication_score: number | null;
  clarity_score: number | null;
  originality_score: number | null;
  logical_consistency_score: number | null;
  strengths: string[] | null;
  weaknesses: string[] | null;
};

function EvaluatorInsights() {
  const [rows, setRows] = useState<EvalRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    supabase
      .from("open_ended_responses")
      .select("id,created_at,category,question,overall_score,confidence_score,communication_score,clarity_score,originality_score,logical_consistency_score,strengths,weaknesses")
      .order("created_at", { ascending: true })
      .limit(50)
      .then(({ data, error }) => {
        if (!alive) return;
        if (error) setError(error.message);
        else setRows((data ?? []) as EvalRow[]);
      });
    return () => { alive = false; };
  }, []);

  const stats = useMemo(() => {
    if (!rows || rows.length === 0) return null;
    const dims = ["confidence_score","communication_score","clarity_score","originality_score","logical_consistency_score"] as const;
    const labels: Record<string, string> = {
      confidence_score: "Confidence",
      communication_score: "Communication",
      clarity_score: "Clarity",
      originality_score: "Originality",
      logical_consistency_score: "Logic",
    };
    const avg = (k: typeof dims[number]) => {
      const vals = rows.map(r => Number(r[k] ?? 0)).filter(v => v > 0);
      return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
    };
    const dimAverages = dims.map(k => ({ key: k, label: labels[k], value: avg(k) }));
    const sorted = [...dimAverages].sort((a, b) => b.value - a.value);
    const strongest = sorted.slice(0, 2);
    const weakest = sorted.slice(-2).reverse();

    const trend = rows
      .map(r => Number(r.overall_score ?? 0))
      .filter(v => v > 0);
    const trendDelta = trend.length >= 2
      ? trend[trend.length - 1] - trend[0]
      : 0;

    const strengthsBag = new Map<string, number>();
    const weaknessBag = new Map<string, number>();
    rows.forEach(r => {
      (r.strengths ?? []).forEach(s => strengthsBag.set(s, (strengthsBag.get(s) ?? 0) + 1));
      (r.weaknesses ?? []).forEach(s => weaknessBag.set(s, (weaknessBag.get(s) ?? 0) + 1));
    });
    const topStrengths = [...strengthsBag.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]);
    const topWeaknesses = [...weaknessBag.entries()].sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]);

    return { dimAverages, strongest, weakest, trend, trendDelta, topStrengths, topWeaknesses };
  }, [rows]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08, duration: 0.6 }}
      className="glass-panel relative overflow-hidden rounded-3xl p-7"
    >
      <div className="absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-gradient-to-tr from-accent/20 to-primary/15 blur-3xl" aria-hidden />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">AI Evaluator intelligence</div>
          <div className="font-display text-lg font-semibold">Strengths, weaknesses & trend</div>
        </div>
        <Link to="/evaluator" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-semibold text-muted-foreground transition-colors hover:text-foreground">
          Open evaluator <ArrowRight className="h-3 w-3" />
        </Link>
      </div>

      {error && <div className="relative mt-4 text-xs text-destructive">{error}</div>}

      {!rows && !error && (
        <div className="relative mt-6 h-24 animate-pulse rounded-2xl bg-muted/60" />
      )}

      {rows && rows.length === 0 && (
        <div className="relative mt-6 rounded-2xl border border-dashed border-border p-6 text-center">
          <p className="text-sm text-muted-foreground">No evaluator runs yet. Drop your first answer in the AI evaluator and it will appear here. Strengths, weaknesses, and your trend over time.</p>
          <Link to="/evaluator" className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-primary-glow px-4 py-2 text-xs font-semibold text-primary-foreground transition-transform hover:scale-[1.03]">
            Try the evaluator <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}

      {stats && (
        <div className="relative mt-5 grid gap-5 md:grid-cols-[1fr_auto]">
          <div className="space-y-3">
            {stats.dimAverages.map((d, i) => (
              <div key={d.key}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{d.label}</span>
                  <span className="font-semibold">{d.value.toFixed(1)}<span className="text-muted-foreground">/10</span></span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(d.value / 10) * 100}%` }}
                    transition={{ delay: 0.2 + i * 0.07, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow"
                  />
                </div>
              </div>
            ))}
          </div>
          <TrendSpark values={stats.trend} delta={stats.trendDelta} />
        </div>
      )}

      {stats && (
        <div className="relative mt-5 grid gap-3 md:grid-cols-2">
          <InsightChip
            tone="positive"
            icon={<Zap className="h-3.5 w-3.5" />}
            title="Strongest dimensions"
            items={stats.strongest.map(s => `${s.label} · ${s.value.toFixed(1)}`)}
            extras={stats.topStrengths}
          />
          <InsightChip
            tone="warning"
            icon={<ShieldAlert className="h-3.5 w-3.5" />}
            title="Areas to drill"
            items={stats.weakest.map(s => `${s.label} · ${s.value.toFixed(1)}`)}
            extras={stats.topWeaknesses}
          />
        </div>
      )}
    </motion.div>
  );
}

function TrendSpark({ values, delta }: { values: number[]; delta: number }) {
  if (values.length < 2) {
    return (
      <div className="flex w-36 flex-col items-end justify-center rounded-2xl border border-border bg-card/70 p-3 text-right">
        <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Trend</div>
        <div className="font-display text-base font-semibold">Building…</div>
      </div>
    );
  }
  const w = 140, h = 60, pad = 6;
  const min = Math.min(...values), max = Math.max(...values);
  const range = max - min || 1;
  const points = values.map((v, i) => {
    const x = pad + (i * (w - pad * 2)) / (values.length - 1);
    const y = h - pad - ((v - min) / range) * (h - pad * 2);
    return `${x},${y}`;
  }).join(" ");
  const positive = delta >= 0;
  return (
    <div className="flex w-40 flex-col items-end rounded-2xl border border-border bg-card/70 p-3">
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Overall trend</div>
      <svg viewBox={`0 0 ${w} ${h}`} className="mt-1 w-full">
        <motion.polyline
          fill="none"
          stroke="url(#trendGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        />
        <defs>
          <linearGradient id="trendGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="oklch(0.45 0.22 270)" />
            <stop offset="100%" stopColor="oklch(0.62 0.24 285)" />
          </linearGradient>
        </defs>
      </svg>
      <div className={`mt-1 inline-flex items-center gap-1 text-[11px] font-semibold ${positive ? "text-success" : "text-destructive"}`}>
        {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {positive ? "+" : ""}{delta.toFixed(1)} pts
      </div>
    </div>
  );
}

function InsightChip({
  tone, icon, title, items, extras,
}: {
  tone: "positive" | "warning";
  icon: React.ReactNode;
  title: string;
  items: string[];
  extras: string[];
}) {
  const ring = tone === "positive" ? "from-success/15 to-success/5" : "from-warning/15 to-warning/5";
  const dot = tone === "positive" ? "bg-success" : "bg-warning";
  return (
    <motion.div whileHover={{ y: -2 }} className={`rounded-2xl border border-border bg-gradient-to-br ${ring} p-4`}>
      <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-foreground/80">
        {icon} {title}
      </div>
      <div className="mt-2 space-y-1">
        {items.map((i) => (
          <div key={i} className="text-xs font-medium">{i}</div>
        ))}
      </div>
      {extras.length > 0 && (
        <div className="mt-3 space-y-1 border-t border-border/60 pt-2">
          {extras.map((e) => (
            <div key={e} className="flex items-start gap-1.5 text-[11px] text-muted-foreground">
              <span className={`mt-1 inline-block h-1 w-1 rounded-full ${dot}`} />
              <span>{e}</span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
