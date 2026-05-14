import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Globe2, TrendingUp, TrendingDown, Activity, Newspaper, Flame } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/affairs")({
  component: AffairsPage,
});

const DOMAINS = [
  { key: "Geopolitics",     base: 86, weak: ["Quad cohesion", "India-EU FTA"] },
  { key: "Economic policy", base: 48, weak: ["RBI repo cycle", "GST collections"] },
  { key: "Indian politics", base: 71, weak: ["UCC framing", "Federal tensions"] },
  { key: "Global trends",   base: 64, weak: ["AI compute regimes", "Climate finance"] },
  { key: "Opinion drills",  base: 39, weak: ["Reservation defence", "Free electricity"] },
];

function AffairsPage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  useEffect(() => { if (!loading && !user) nav({ to: "/login" }); }, [user, loading, nav]);

  const [stats, setStats] = useState<typeof DOMAINS>(DOMAINS);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("current_affairs_domain_stats")
      .select("domain,accuracy,weak_areas")
      .eq("user_id", user.id)
      .then(({ data }) => {
        if (!data?.length) return;
        const merged = DOMAINS.map((d) => {
          const row = data.find((r) => (r.domain ?? "").toLowerCase() === d.key.toLowerCase());
          return row ? { ...d, base: Math.round(Number(row.accuracy) || d.base), weak: (row.weak_areas as string[]) || d.weak } : d;
        });
        setStats(merged);
      });
  }, [user]);

  const insights = useMemo(() => {
    const sorted = [...stats].sort((a, b) => a.base - b.base);
    return {
      weakest: sorted[0],
      strongest: sorted[sorted.length - 1],
      avg: Math.round(stats.reduce((a, b) => a + b.base, 0) / stats.length),
    };
  }, [stats]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
        <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Globe2 className="h-3 w-3" /> Current Affairs Intelligence
          </span>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">Your domain terminal.</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Where you're sharp, where you wobble, and what the panel is most likely to weaponise.</p>
        </motion.header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-6">
            <div className="glass-panel rounded-3xl p-6">
              <div className="flex items-center justify-between">
                <div className="font-display text-lg font-semibold">Domain accuracy heatmap</div>
                <span className="text-xs text-muted-foreground">Avg {insights.avg}%</span>
              </div>
              <div className="mt-5 space-y-4">
                {stats.map((d, i) => <DomainRow key={d.key} d={d} i={i} />)}
              </div>
            </div>

            <div className="glass-panel rounded-3xl p-6">
              <div className="font-display text-lg font-semibold">Trend movement (7-day)</div>
              <Sparkline points={[42, 51, 47, 55, 60, 58, insights.avg]} />
            </div>
          </div>

          <div className="space-y-6">
            <InsightCard
              tone="rose"
              icon={<TrendingDown className="h-4 w-4" />}
              title="Weakest domain"
              body={`You stumble in ${insights.weakest.key} (${insights.weakest.base}%).`}
              tags={insights.weakest.weak}
            />
            <InsightCard
              tone="emerald"
              icon={<TrendingUp className="h-4 w-4" />}
              title="Strongest domain"
              body={`You consistently lead in ${insights.strongest.key} (${insights.strongest.base}%).`}
              tags={insights.strongest.weak}
            />
            <div className="glass-panel rounded-3xl p-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Flame className="h-3 w-3 text-primary" /> Panel-style insights
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                <li>• You avoid taking nuanced positions on policy.</li>
                <li>• Your geopolitics retention is above peer cohort.</li>
                <li>• You crumble on opinion-drill follow-ups.</li>
              </ul>
              <Link to="/quiz" search={{ c: "opinion" }} className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background hover:scale-[1.03] transition-transform">
                Drill opinion-defence now →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DomainRow({ d, i }: { d: typeof DOMAINS[number]; i: number }) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <span className="font-medium">{d.key}</span>
        <span className="font-semibold tabular-nums">{d.base}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${d.base}%` }}
          transition={{ duration: 1.1, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow"
        />
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {d.weak.map((w) => (
          <span key={w} className="rounded-full border border-border bg-card px-2 py-0.5 text-[10px] text-muted-foreground">{w}</span>
        ))}
      </div>
    </div>
  );
}

function Sparkline({ points }: { points: number[] }) {
  const w = 600, h = 120, max = Math.max(...points, 100), min = 0;
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const ys = points.map((p) => h - ((p - min) / (max - min)) * h);
  const path = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="mt-4 w-full">
      <defs>
        <linearGradient id="trendg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ABC4FF" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#ABC4FF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path d={`${path} L${w},${h} L0,${h} Z`} fill="url(#trendg)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }} />
      <motion.path d={path} fill="none" stroke="#4849F8" strokeWidth="2.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }} />
      {xs.map((x, i) => (
        <circle key={i} cx={x} cy={ys[i]} r="3" fill="#4849F8" />
      ))}
    </svg>
  );
}

function InsightCard({ tone, icon, title, body, tags }: {
  tone: "rose" | "emerald"; icon: React.ReactNode; title: string; body: string; tags: string[];
}) {
  const border = tone === "emerald" ? "border-emerald-400/40" : "border-rose-400/40";
  const text = tone === "emerald" ? "text-emerald-600" : "text-rose-600";
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`glass-card rounded-3xl border-l-4 ${border} p-5`}>
      <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${text}`}>{icon}{title}</div>
      <p className="mt-2 text-sm">{body}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {tags.map((t) => <span key={t} className="rounded-full border border-border bg-card px-2 py-0.5 text-[10px] text-muted-foreground">{t}</span>)}
      </div>
    </motion.div>
  );
}