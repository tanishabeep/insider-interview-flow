import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Brain, Lock, AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { DashShell } from "@/components/dash/Sidebar";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/hub/memory")({
  component: MemoryPage,
});

type Position = {
  id: string;
  topic: string;
  stance: string;
  reasoning: string | null;
  confidence: number;
  source: string | null;
  tags: string[] | null;
  updated_at: string;
};

type OpinionLog = {
  id: string;
  topic: string;
  position: string;
  summary: string | null;
  sentiment: string | null;
  stated_at: string;
};

function MemoryPage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  useEffect(() => { if (!loading && !user) nav({ to: "/login" }); }, [user, loading, nav]);

  const [positions, setPositions] = useState<Position[]>([]);
  const [logs, setLogs] = useState<OpinionLog[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const [topic, setTopic] = useState("");
  const [stance, setStance] = useState("");
  const [reasoning, setReasoning] = useState("");

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: p }, { data: l }] = await Promise.all([
        supabase.from("position_library").select("*").order("updated_at", { ascending: false }),
        supabase.from("opinion_logs").select("*").order("stated_at", { ascending: false }).limit(50),
      ]);
      setPositions((p ?? []) as Position[]);
      setLogs((l ?? []) as OpinionLog[]);
      if (p && p.length && !activeId) setActiveId(p[0].id);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  if (!user) return null;

  const active = positions.find((p) => p.id === activeId);
  const activeLogs = active ? logs.filter((l) => l.topic.toLowerCase() === active.topic.toLowerCase()) : [];
  const contradicts = active && activeLogs.some((l) => l.position.toLowerCase() !== active.stance.toLowerCase());

  async function lockPosition() {
    if (!user || !topic.trim() || !stance.trim()) return;
    setBusy(true);
    const { data, error } = await supabase
      .from("position_library")
      .insert({ user_id: user.id, topic: topic.trim(), stance: stance.trim(), reasoning: reasoning.trim() || null, confidence: 80 })
      .select()
      .single();
    setBusy(false);
    if (error) { toast.error(error.message); return; }
    setPositions((prev) => [data as Position, ...prev]);
    setActiveId((data as Position).id);
    setTopic(""); setStance(""); setReasoning("");
    toast.success("Position locked.");
  }

  return (
    <DashShell>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <header className="flex items-start gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/20 text-primary">
            <Brain className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">Memory & Coherence</h1>
            <p className="mt-1 font-mono text-xs text-muted-foreground">Every position you take is logged. Contradictions get flagged before the panel finds them.</p>
          </div>
        </header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.36fr_1fr]">
          {/* Left: Position Library */}
          <div className="space-y-3">
            <div className="glass-panel rounded-3xl p-5">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Lock a position</div>
              <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Topic (e.g. UBI in India)" className="mt-3 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm" />
              <input value={stance} onChange={(e) => setStance(e.target.value)} placeholder="Your stance" className="mt-2 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm" />
              <textarea value={reasoning} onChange={(e) => setReasoning(e.target.value)} placeholder="Reasoning (optional)" rows={2} className="mt-2 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm" />
              <button disabled={busy || !topic || !stance} onClick={lockPosition} className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-primary-glow px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50">
                <Lock className="h-3 w-3" /> {busy ? "Saving…" : "Lock position"}
              </button>
            </div>

            <div className="space-y-2">
              {positions.length === 0 && (
                <div className="glass-panel rounded-3xl p-8 text-center text-sm text-muted-foreground">
                  No positions yet. The longer you practice here, the smarter this gets.
                </div>
              )}
              {positions.map((p) => {
                const isActive = p.id === activeId;
                const c = logs.some((l) => l.topic.toLowerCase() === p.topic.toLowerCase() && l.position.toLowerCase() !== p.stance.toLowerCase());
                return (
                  <button key={p.id} onClick={() => setActiveId(p.id)} className={`w-full rounded-2xl border-l-[3px] bg-card p-3 text-left transition-all ${
                    isActive ? "border-l-primary bg-secondary/40" : c ? "border-l-destructive/70" : "border-l-success/70"
                  }`}>
                    <div className="flex items-center gap-2">
                      <Lock className="h-3 w-3 text-muted-foreground" />
                      <div className="font-display text-sm font-semibold">{p.topic}</div>
                    </div>
                    <div className="mt-0.5 truncate text-xs text-muted-foreground">{p.stance}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Analysis */}
          <div className="space-y-5">
            {!active && (
              <div className="glass-panel rounded-3xl p-10 text-center">
                <Brain className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-3 text-sm text-muted-foreground">Lock a position on the left to see its coherence over time.</p>
              </div>
            )}
            {active && (
              <>
                <motion.div key={active.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-3xl p-6">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Locked position</div>
                  <div className="mt-2 font-display text-xl font-semibold">{active.topic}</div>
                  <p className="mt-2 text-sm">{active.stance}</p>
                  {active.reasoning && <p className="mt-2 text-xs text-muted-foreground">{active.reasoning}</p>}
                </motion.div>

                <div className="glass-panel rounded-3xl p-6">
                  <div className="flex items-center gap-2">
                    {contradicts ? <AlertTriangle className="h-4 w-4 text-destructive" /> : <CheckCircle2 className="h-4 w-4 text-success" />}
                    <div className="font-display text-sm font-semibold">{contradicts ? "Panel-detectable inconsistency" : "Consistent across sessions"}</div>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                    <div className={`h-full rounded-full ${contradicts ? "bg-destructive" : "bg-success"}`} style={{ width: contradicts ? "85%" : "20%" }} />
                  </div>
                  {contradicts && (
                    <blockquote className="mt-4 rounded-xl border-l-2 border-l-destructive bg-muted/60 p-3 font-mono text-[11px] leading-relaxed">
                      “You said {active.stance.toLowerCase()} on {active.topic}. In an earlier session you took the opposite line. Which is true, and why should we believe you?”
                    </blockquote>
                  )}
                </div>

                <div className="glass-panel rounded-3xl p-6">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Opinion trajectory</div>
                  {activeLogs.length === 0 ? (
                    <p className="mt-3 text-xs text-muted-foreground">No prior statements logged for this topic yet.</p>
                  ) : (
                    <ol className="mt-3 space-y-2">
                      {activeLogs.map((l) => {
                        const conflict = l.position.toLowerCase() !== active.stance.toLowerCase();
                        return (
                          <li key={l.id} className={`rounded-xl border-l-2 bg-card/70 p-3 text-xs ${conflict ? "border-l-destructive" : "border-l-primary"}`}>
                            <div className="text-muted-foreground">{new Date(l.stated_at).toLocaleString()}</div>
                            <div className="mt-0.5 font-medium">{l.position}</div>
                            {l.summary && <div className="mt-0.5 text-muted-foreground">{l.summary}</div>}
                          </li>
                        );
                      })}
                    </ol>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </DashShell>
  );
}