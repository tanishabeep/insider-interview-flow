import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { GitCompare, Search } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { DashShell } from "@/components/dash/Sidebar";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/hub/consistency")({
  component: ConsistencyPage,
});

type Log = { id: string; topic: string; position: string; summary: string | null; stated_at: string };

function scoreFor(logs: Log[]): number {
  if (logs.length < 2) return logs.length === 1 ? 70 : 50;
  const positions = new Set(logs.map((l) => l.position.toLowerCase().trim()));
  if (positions.size === 1) return 95;
  if (positions.size === 2) return 55;
  return 30;
}

function ConsistencyPage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  useEffect(() => { if (!loading && !user) nav({ to: "/login" }); }, [user, loading, nav]);

  const [logs, setLogs] = useState<Log[]>([]);
  const [q, setQ] = useState("");
  const [activeTopic, setActiveTopic] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    supabase.from("opinion_logs").select("*").order("stated_at", { ascending: false }).limit(200).then(({ data }) => {
      setLogs((data ?? []) as Log[]);
      if (data && data.length && !activeTopic) setActiveTopic(data[0].topic);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const grouped = useMemo(() => {
    const map = new Map<string, Log[]>();
    for (const l of logs) {
      const key = l.topic.trim();
      const arr = map.get(key) ?? [];
      arr.push(l);
      map.set(key, arr);
    }
    return [...map.entries()]
      .map(([topic, items]) => ({ topic, items, score: scoreFor(items) }))
      .filter((t) => !q || t.topic.toLowerCase().includes(q.toLowerCase()))
      .sort((a, b) => a.score - b.score);
  }, [logs, q]);

  const active = grouped.find((g) => g.topic === activeTopic);

  if (!user) return null;

  const totals = {
    topics: grouped.length,
    contradictions: grouped.filter((g) => g.score < 40).length,
    avg: grouped.length ? Math.round(grouped.reduce((a, b) => a + b.score, 0) / grouped.length) : 0,
  };

  return (
    <DashShell>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <header className="flex items-start gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/20 text-primary">
            <GitCompare className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">Opinion Consistency Tracker</h1>
            <p className="mt-1 font-mono text-xs text-muted-foreground">Defensible positions, topic by topic. The longer you practice, the sharper this gets.</p>
          </div>
        </header>

        <div className="mt-6 grid gap-3 md:grid-cols-3">
          <Stat label="Topics tracked" value={totals.topics} />
          <Stat label="Active contradictions" value={totals.contradictions} tone="destructive" />
          <Stat label="Consistency readiness" value={totals.avg} suffix="%" />
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[0.36fr_1fr]">
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search topics" className="w-full rounded-full border border-border bg-card py-2 pl-9 pr-3 text-sm" />
            </div>
            {grouped.length === 0 && (
              <div className="glass-panel rounded-3xl p-8 text-center text-sm text-muted-foreground">No opinions logged yet. Take a quiz or run a session.</div>
            )}
            <div className="space-y-2">
              {grouped.map((g) => {
                const isActive = g.topic === activeTopic;
                const tone = g.score >= 70 ? "bg-success" : g.score >= 40 ? "bg-warning" : "bg-destructive";
                return (
                  <button key={g.topic} onClick={() => setActiveTopic(g.topic)} className={`flex w-full items-center justify-between gap-3 rounded-2xl border p-3 text-left transition ${isActive ? "border-primary bg-secondary/40" : "border-border bg-card hover:bg-muted"}`}>
                    <div className="min-w-0">
                      <div className="truncate font-display text-sm font-semibold">{g.topic}</div>
                      <div className="text-[11px] text-muted-foreground">{g.items.length} statement{g.items.length === 1 ? "" : "s"}</div>
                    </div>
                    <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${tone}/15`}>
                      <span className={`text-[11px] font-semibold ${g.score >= 70 ? "text-success" : g.score >= 40 ? "text-warning" : "text-destructive"}`}>{g.score}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-5">
            {!active ? (
              <div className="glass-panel rounded-3xl p-10 text-center text-sm text-muted-foreground">Pick a topic to inspect your trajectory.</div>
            ) : (
              <>
                <motion.div key={active.topic} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-3xl p-6">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Consistency</div>
                  <div className="mt-1 font-display text-xl font-semibold">{active.topic}</div>
                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-muted">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${active.score}%` }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className={`h-full rounded-full ${active.score >= 70 ? "bg-success" : active.score >= 40 ? "bg-warning" : "bg-destructive"}`} />
                  </div>
                  <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{active.score < 40 ? "Panel risk" : active.score < 70 ? "Developing" : "Defensible"}</span>
                    <span className="font-semibold tabular-nums">{active.score}/100</span>
                  </div>
                </motion.div>

                <div className="glass-panel rounded-3xl p-6">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Your opinion trajectory</div>
                  <ol className="mt-4 space-y-2">
                    {active.items.map((l, idx) => {
                      const prev = active.items[idx + 1];
                      const conflict = prev && prev.position.toLowerCase().trim() !== l.position.toLowerCase().trim();
                      return (
                        <li key={l.id} className={`rounded-xl border-l-2 bg-card/70 p-3 text-xs ${conflict ? "border-l-warning" : "border-l-primary"}`}>
                          <div className="text-muted-foreground">{new Date(l.stated_at).toLocaleString()}</div>
                          <div className="mt-0.5 font-medium">{l.position}</div>
                          {l.summary && <div className="mt-0.5 text-muted-foreground">{l.summary}</div>}
                        </li>
                      );
                    })}
                  </ol>
                </div>

                {active.score < 70 && (
                  <div className="glass-panel rounded-3xl p-6">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">What a panel does with this</div>
                    <blockquote className="mt-3 rounded-xl bg-muted/60 p-3 font-mono text-[11px] leading-relaxed">
                      “On {active.topic}, you've taken more than one position across your sessions. Tell me which one is yours, and why the others were wrong.”
                    </blockquote>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </DashShell>
  );
}

function Stat({ label, value, tone, suffix }: { label: string; value: number; tone?: "destructive"; suffix?: string }) {
  const c = tone === "destructive" ? "text-destructive" : "text-foreground";
  return (
    <div className="glass-panel rounded-2xl p-4">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 font-display text-2xl font-semibold tabular-nums ${c}`}>{value}{suffix ?? ""}</div>
    </div>
  );
}