import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Sparkles, LogOut, TrendingUp, TrendingDown, ArrowRight, Zap,
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
        <h1 className="mt-3 font-display text-[2rem] font-semibold leading-tight md:text-[2.8rem]">{name}, ready for two minutes?</h1>
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

type EvalLite = {
  created_at: string;
  overall_score: number | null;
  clarity_score: number | null;
  logical_consistency_score: number | null;
  confidence_score: number | null;
  originality_score: number | null;
};

function ReadinessHero() {
  const [rows, setRows] = useState<EvalLite[] | null>(null);
  useEffect(() => {
    supabase
      .from("open_ended_responses")
      .select("created_at, overall_score, clarity_score, logical_consistency_score, confidence_score, originality_score")
      .order("created_at", { ascending: false })
      .limit(200)
      .then(({ data }) => setRows((data ?? []) as EvalLite[]));
  }, []);

  const stats = useMemo(() => {
    if (!rows || rows.length === 0) return null;
    const avg = (k: keyof EvalLite) => {
      const v = rows.map(r => Number(r[k] ?? 0)).filter(n => n > 0);
      return v.length ? (v.reduce((a, b) => a + b, 0) / v.length) : 0;
    };
    // scores in DB are 0-10 → convert to 0-100 percent
    const toPct = (n: number) => Math.round(n * 10);
    const dims = [
      { label: "Clarity", value: toPct(avg("clarity_score")) },
      { label: "Structure", value: toPct(avg("logical_consistency_score")) },
      { label: "Confidence", value: toPct(avg("confidence_score")) },
      { label: "Originality", value: toPct(avg("originality_score")) },
    ];
    const overall = Math.round((dims.reduce((a, d) => a + d.value, 0) / dims.length));
    // weekly delta on overall_score
    const now = Date.now();
    const week = 7 * 24 * 60 * 60 * 1000;
    const recent = rows.filter(r => now - new Date(r.created_at).getTime() <= week).map(r => Number(r.overall_score ?? 0)).filter(n => n > 0);
    const prior = rows.filter(r => {
      const t = now - new Date(r.created_at).getTime();
      return t > week && t <= 2 * week;
    }).map(r => Number(r.overall_score ?? 0)).filter(n => n > 0);
    let delta: number | null = null;
    if (rows.length >= 2 && recent.length && prior.length) {
      const a = recent.reduce((x, y) => x + y, 0) / recent.length;
      const b = prior.reduce((x, y) => x + y, 0) / prior.length;
      delta = Math.round((a - b) * 10);
    }
    const max = Math.max(...dims.map(d => d.value));
    return { dims, overall, delta, max };
  }, [rows]);

  if (rows === null) {
    return (
      <div className="min-h-[200px] animate-pulse rounded-[20px] bg-[#4849F8]/10" />
    );
  }

  if (!stats) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="grid min-h-[200px] place-items-center rounded-[20px] p-10"
        style={{ backgroundColor: "#4849F8" }}
      >
        <div className="text-center">
          <div className="font-display text-[4rem] font-semibold leading-none" style={{ color: "#FDFEFF", opacity: 0.3 }}>?</div>
          <p className="mx-auto mt-3 max-w-[260px] text-[0.9rem]" style={{ color: "#FDFEFF", opacity: 0.7 }}>
            Your readiness score builds as you practice.
          </p>
          <Link
            to="/quiz"
            className="mt-6 inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-xs font-semibold"
            style={{ backgroundColor: "#FDFEFF", color: "#0D0D1A" }}
          >
            Start your first session <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05, duration: 0.6 }}
      className="relative flex min-h-[200px] flex-col gap-6 overflow-hidden rounded-[20px] p-10 md:flex-row md:items-center md:gap-0 md:p-10"
      style={{ backgroundColor: "#4849F8" }}
    >
      {/* Left zone */}
      <div className="flex flex-col md:w-[40%] md:pr-10">
        <div className="flex items-center gap-2">
          <IllAnalytics size={16} className="opacity-60" />
          <div className="text-[0.65rem] font-bold uppercase" style={{ color: "#FDFEFF", opacity: 0.6, letterSpacing: "0.12em" }}>
            Interview readiness
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-display text-[5.5rem] font-extrabold leading-none" style={{ color: "#FDFEFF" }}>{stats.overall}</span>
          <span className="text-[1.1rem] font-normal" style={{ color: "#FDFEFF", opacity: 0.45 }}>/ 100</span>
        </div>
        {stats.delta !== null && (
          <div
            className="mt-3 inline-flex w-fit items-center gap-1 rounded-full text-[0.75rem] font-bold"
            style={{ backgroundColor: "#DDF344", color: "#0D0D1A", padding: "0.3rem 0.85rem" }}
          >
            ▲ {stats.delta >= 0 ? "+" : ""}{stats.delta} this week
          </div>
        )}
      </div>
      {/* Divider */}
      <div className="hidden h-[60%] w-px md:block" style={{ backgroundColor: "#FDFEFF", opacity: 0.15 }} />
      {/* Right zone */}
      <div className="flex flex-1 items-center justify-evenly md:pl-10">
        {stats.dims.map((d) => (
          <ColumnBar key={d.label} label={d.label} value={d.value} highlight={d.value === stats.max && stats.max > 0} />
        ))}
      </div>
    </motion.div>
  );
}

function ColumnBar({ label, value, highlight }: { label: string; value: number; highlight: boolean }) {
  const containerH = 120;
  const fillColor = highlight ? "#DDF344" : "rgba(253,254,255,0.85)";
  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 font-display text-[1.1rem] font-bold" style={{ color: "#FDFEFF" }}>{value}</div>
      <div
        className="relative w-[42px] overflow-hidden rounded-full md:w-[52px]"
        style={{
          height: containerH,
          border: "1.5px solid rgba(253,254,255,0.25)",
          backgroundColor: "rgba(253,254,255,0.06)",
        }}
      >
        <motion.div
          initial={{ height: 0 }}
          animate={{ height: `${Math.max(0, Math.min(100, value))}%` }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute bottom-0 left-0 right-0 rounded-full"
          style={{ backgroundColor: fillColor }}
        />
      </div>
      <div
        className="mt-2 text-[0.6rem] font-bold uppercase"
        style={{ color: "#FDFEFF", opacity: 0.55, letterSpacing: "0.08em" }}
      >
        {label}
      </div>
    </div>
  );
}

function QuickActions() {
  const items = [
    { to: "/quiz", Ill: IllQuiz, title: "Quiz Engine",                body: "Pick a category. Sprint in 2 min",      tone: "primary", hero: true },
    { to: "/lab",  Ill: IllInterview,     title: "Adaptive Interview Lab",     body: "Live AI panel that doesn't let go",       tone: "accent" },
    { to: "/grilling", Ill: IllProfile, title: "Profile Grilling Intel", body: "Map your weak surfaces & traps",        tone: "primary" },
    { to: "/affairs",  Ill: IllGlobe,     title: "Current Affairs Terminal", body: "Domain heatmap, trend, insights",     tone: "accent" },
    { to: "/evaluator", Ill: IllAnalytics, title: "AI Evaluation Studio",   body: "5-dimension answer scoring",            tone: "primary" },
    { to: "/archive",   Ill: IllBooks,   title: "Real Interview Archive", body: "Reconstructed IIM panels",              tone: "accent" },
  ] as const;
  const [hero, ...rest] = items;
  return (
    <div className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link to={hero.to} className="glass-card group block rounded-3xl p-8">
          <hero.Ill size={48} className="mb-4" />
          <div className="font-display text-xl font-semibold">{hero.title}</div>
          <div className="mt-1 text-sm text-muted-foreground">{hero.body}</div>
          <div className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary">
            Begin <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
      </motion.div>
      <div className="grid gap-2.5 sm:grid-cols-2 xl:grid-cols-3">
        {rest.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 * i, duration: 0.45 }}
          >
            <Link to={it.to} className="glass-card group block rounded-2xl px-5 py-4">
              <div className="flex items-start gap-4">
                <span className={`grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl ${it.tone === "primary" ? "bg-primary/10" : "bg-accent/20"}`}>
                  <it.Ill size={26} />
                </span>
                <div className="flex-1">
                  <div className="font-display text-sm font-semibold">{it.title}</div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">{it.body}</div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function RecentSessions() {
  const [rows, setRows] = useState<{ t: string; d: string; s: number }[] | null>(null);
  useEffect(() => {
    (async () => {
      const [evals, attempts] = await Promise.all([
        supabase.from("open_ended_responses").select("created_at, question, overall_score").order("created_at", { ascending: false }).limit(5),
        supabase.from("quiz_attempts").select("completed_at, category, accuracy").order("completed_at", { ascending: false }).limit(5),
      ]);
      const merged = [
        ...((evals.data ?? []).map(e => ({
          t: (e.question ?? "Evaluator response").slice(0, 80),
          d: timeAgo(e.created_at),
          s: Math.round(Number(e.overall_score ?? 0) * 10),
          when: new Date(e.created_at).getTime(),
        }))),
        ...((attempts.data ?? []).map(a => ({
          t: `Quiz · ${a.category ?? "Mixed"}`,
          d: timeAgo(a.completed_at),
          s: Math.round(Number(a.accuracy ?? 0)),
          when: new Date(a.completed_at).getTime(),
        }))),
      ].sort((a, b) => b.when - a.when).slice(0, 5);
      setRows(merged);
    })();
  }, []);

  if (rows === null) {
    return <div className="glass-panel min-h-[260px] animate-pulse rounded-3xl" />;
  }

  if (rows.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-8 text-center">
        <div className="font-display text-lg font-semibold">Recent sessions</div>
        <p className="mx-auto mt-3 max-w-sm text-sm text-muted-foreground">
          No sessions yet. Your first one shows you where the gaps are.
        </p>
        <Link to="/lab" className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background">
          Start a session <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="glass-panel min-h-[260px] rounded-3xl p-8"
    >
      <div className="flex items-center justify-between">
        <div className="font-display text-lg font-semibold">Recent sessions</div>
        <span className="text-xs text-muted-foreground">Last 7 days</span>
      </div>
      <div className="mt-5 divide-y divide-border/60">
        {rows.map((r, i) => (
          <motion.div
            key={i}
            whileHover={{ x: 3 }}
            className="flex items-center justify-between gap-3 px-1 py-4"
          >
            <div>
              <div className="text-sm font-medium">{r.t}</div>
              <div className="mt-0.5 text-[11px] text-muted-foreground">{r.d}</div>
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

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / (24 * 3600 * 1000));
  if (d <= 0) return "Today";
  if (d === 1) return "Yesterday";
  if (d < 7) return `${d} days ago`;
  return new Date(iso).toLocaleDateString();
}

function CurrentAffairsPanel() {
  const [bars, setBars] = useState<{ l: string; v: number; n: number }[] | null>(null);
  useEffect(() => {
    supabase.from("quiz_attempts").select("category, accuracy").then(({ data }) => {
      const cats = ["Geopolitics", "Economic policy", "Indian politics", "Global trends", "Opinion drills"];
      const grouped = new Map<string, number[]>();
      (data ?? []).forEach(a => {
        const k = (a.category ?? "").toString();
        if (!grouped.has(k)) grouped.set(k, []);
        grouped.get(k)!.push(Number(a.accuracy ?? 0));
      });
      setBars(cats.map(l => {
        const arr = grouped.get(l) ?? [];
        const v = arr.length ? Math.round(arr.reduce((x, y) => x + y, 0) / arr.length) : 0;
        return { l, v, n: arr.length };
      }));
    });
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.6 }}
      className="glass-panel min-h-[260px] rounded-3xl p-7 md:p-9"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current affairs intelligence</div>
          <div className="font-display text-lg font-semibold">Your domain map</div>
        </div>
        <IllGlobe size={28} />
      </div>
      {bars === null && <div className="mt-6 h-32 animate-pulse rounded-2xl bg-muted/60" />}
      {bars && bars.every(b => b.n === 0) && (
        <div className="mt-6 rounded-2xl border border-dashed border-border p-6 text-center">
          <p className="text-sm text-muted-foreground">Complete some quizzes to see your domain map.</p>
          <Link to="/quiz" className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background">
            Go to Quiz Arena <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      )}
      {bars && bars.some(b => b.n > 0) && (
        <div className="mt-6 space-y-[1.1rem]">
          {bars.map((d, i) => (
            <div key={d.l}>
              <div className="mb-1 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{d.l}</span>
                {d.n === 0
                  ? <span className="text-[0.65rem] text-muted-foreground">No attempts yet</span>
                  : <span className="font-semibold">{d.v}%</span>}
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${d.v}%` }}
                  transition={{ delay: 0.3 + i * 0.08, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}

function StreakCard() {
  const [info, setInfo] = useState<{ days: number[]; active: number } | null>(null);
  useEffect(() => {
    (async () => {
      const [a, b] = await Promise.all([
        supabase.from("quiz_attempts").select("completed_at").gte("completed_at", new Date(Date.now() - 30 * 86400000).toISOString()),
        supabase.from("open_ended_responses").select("created_at").gte("created_at", new Date(Date.now() - 30 * 86400000).toISOString()),
      ]);
      const set = new Set<string>();
      (a.data ?? []).forEach(r => set.add(new Date(r.completed_at).toDateString()));
      (b.data ?? []).forEach(r => set.add(new Date(r.created_at).toDateString()));
      const days: number[] = [];
      for (let i = 11; i >= 0; i--) {
        const d = new Date(Date.now() - i * 86400000).toDateString();
        days.push(set.has(d) ? 1 : 0);
      }
      setInfo({ days, active: set.size });
    })();
  }, []);
  const days = info?.days ?? [0,0,0,0,0,0,0,0,0,0,0,0];
  const active = info?.active ?? 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15, duration: 0.6 }}
      className="glass-panel min-h-[220px] rounded-3xl p-8"
    >
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Active days this month</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-display text-3xl font-semibold">{active}</span>
            <span className="text-xs text-muted-foreground">days</span>
          </div>
          {active === 0 && <div className="mt-1 text-[11px] text-muted-foreground">Start your streak today.</div>}
        </div>
        <motion.div
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-warning/30 to-warning/10"
        >
          <IllFlame size={36} />
        </motion.div>
      </div>
      <div className="mt-6 flex gap-2">
        {days.map((d, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scaleY: 0.4 }}
            animate={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: 0.3 + i * 0.04 }}
            className={`h-[2.8rem] flex-1 rounded-md ${d ? "bg-gradient-to-b from-primary to-primary-glow" : "bg-muted"}`}
          />
        ))}
      </div>
      <div className="mt-4 text-[11px] text-muted-foreground">
        Last 12 days · sessions across quiz and evaluator
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
      className="glass-panel relative overflow-hidden rounded-3xl p-8"
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/30 blur-3xl" aria-hidden />
      <div className="absolute right-5 top-5">
        <IllShield size={28} />
      </div>
      <div className="relative">
        <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary">
          Profile grilling
        </div>
        <h3 className="mt-4 font-display text-lg font-semibold">Predict my weak surfaces</h3>
        <p className="mt-5 text-xs text-muted-foreground">Add your stream, hobbies and SOP. We map the panel's likely focus areas.</p>
        <Link to="/grilling" className="mt-6 flex w-full items-center justify-center gap-1.5 rounded-full bg-foreground px-4 py-3 text-xs font-semibold text-background transition-transform hover:scale-[1.02]">
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
      className="glass-panel relative min-h-[280px] overflow-hidden rounded-3xl p-7 md:p-9"
    >
      <div className="absolute -left-16 -bottom-16 h-56 w-56 rounded-full bg-gradient-to-tr from-accent/20 to-primary/15 blur-3xl" aria-hidden />
      <div className="relative flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <IllAnalytics size={22} /> AI Evaluator intelligence
          </div>
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
        <div className="relative mt-7 grid gap-7 md:grid-cols-[1fr_auto]">
          <div className="space-y-4">
            {stats.dimAverages.map((d, i) => (
              <div key={d.key}>
                <div className="mb-[0.35rem] flex items-center justify-between text-xs">
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
        <div className="relative mt-7 grid gap-3 md:grid-cols-2">
          <InsightChip
            tone="positive"
            icon={<Zap className="h-3.5 w-3.5" />}
            title="Strongest dimensions"
            items={stats.strongest.map(s => `${s.label} · ${s.value.toFixed(1)}`)}
            extras={stats.topStrengths}
          />
          <InsightChip
            tone="warning"
            icon={<IllShield size={14} />}
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
