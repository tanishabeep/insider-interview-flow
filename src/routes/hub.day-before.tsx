import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Calendar, CheckCircle2, Lock, Timer } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { DashShell } from "@/components/dash/Sidebar";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/hub/day-before")({
  component: DayBeforePage,
});

type Iv = { id: string; institute: string; interview_date: string; status: string; panel_notes: string | null };

const STAGES = [
  { key: "consolidate", title: "Consolidation Brief", min: 20, blurb: "Hit your three weakest areas with one perfect drill each." },
  { key: "clearance", title: "Contradiction Clearance", min: 10, blurb: "Lock or set-aside every flagged position." },
  { key: "panel", title: "IIM Panel Briefing", min: 10, blurb: "The three highest-probability grilling zones for your profile." },
  { key: "sim", title: "Final Pressure Simulation", min: 15, blurb: "Seven questions. Strict timer. No pausing." },
] as const;

function DayBeforePage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  useEffect(() => { if (!loading && !user) nav({ to: "/login" }); }, [user, loading, nav]);

  const [dates, setDates] = useState<Iv[]>([]);
  const [institute, setInstitute] = useState("IIM Indore");
  const [date, setDate] = useState("");
  const [done, setDone] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!user) return;
    supabase.from("interview_dates").select("*").order("interview_date", { ascending: true }).then(({ data }) => setDates((data ?? []) as Iv[]));
  }, [user]);

  const upcoming = useMemo(() => dates.find((d) => new Date(d.interview_date).getTime() > Date.now() - 86_400_000) ?? dates[0], [dates]);
  const countdown = useMemo(() => {
    if (!upcoming) return null;
    const ms = new Date(upcoming.interview_date).getTime() - Date.now();
    const days = Math.max(0, Math.floor(ms / 86_400_000));
    const hours = Math.max(0, Math.floor((ms % 86_400_000) / 3_600_000));
    return { ms, days, hours };
  }, [upcoming]);
  const unlocked = !!countdown && countdown.ms <= 3 * 86_400_000;

  if (!user) return null;

  async function setDateNow() {
    if (!date) return;
    const { data, error } = await supabase.from("interview_dates").insert({ user_id: user!.id, institute, interview_date: date, status: "upcoming" }).select().single();
    if (error) { toast.error(error.message); return; }
    setDates((prev) => [...prev, data as Iv].sort((a, b) => a.interview_date.localeCompare(b.interview_date)));
    setDate("");
    toast.success("Interview date locked.");
  }

  return (
    <DashShell>
      <div className="mx-auto max-w-5xl px-6 py-10">
        <header className="flex items-start gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-warning/15 to-accent/20 text-warning">
            <Calendar className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">Day Before Protocol</h1>
            <p className="mt-1 font-mono text-xs text-muted-foreground">Unlocks 72 hours before your interview. Four stages. One purpose: walk in calm.</p>
          </div>
        </header>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="glass-panel rounded-3xl p-6">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Set your interview date</div>
            <select value={institute} onChange={(e) => setInstitute(e.target.value)} className="mt-3 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm">
              {["IIM Ahmedabad","IIM Bangalore","IIM Calcutta","IIM Lucknow","IIM Indore","IIM Kozhikode"].map(i => <option key={i}>{i}</option>)}
            </select>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-2 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm" />
            <button onClick={setDateNow} disabled={!date} className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-primary-glow px-4 py-2 text-xs font-semibold text-primary-foreground disabled:opacity-50">
              Save date
            </button>
          </div>
          <div className="glass-panel rounded-3xl p-6">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Next interview</div>
            {upcoming ? (
              <>
                <div className="mt-2 font-display text-xl font-semibold">{upcoming.institute}</div>
                <div className="text-xs text-muted-foreground">{new Date(upcoming.interview_date).toDateString()}</div>
                {countdown && (
                  <div className="mt-4 flex items-center gap-3">
                    <Timer className="h-5 w-5 text-primary" />
                    <div className="font-display text-3xl font-semibold tabular-nums">{countdown.days}d {countdown.hours}h</div>
                  </div>
                )}
                <div className={`mt-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${unlocked ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"}`}>
                  {unlocked ? <CheckCircle2 className="h-3 w-3" /> : <Lock className="h-3 w-3" />} {unlocked ? "Protocol active" : "Unlocks 72h before"}
                </div>
              </>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">No interview date set yet.</p>
            )}
          </div>
        </div>

        <div className="mt-8 space-y-4">
          {STAGES.map((s, i) => {
            const isDone = !!done[s.key];
            return (
              <motion.div key={s.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`glass-panel rounded-3xl p-6 ${unlocked ? "" : "opacity-60"}`}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Stage {i + 1} · {s.min} min</div>
                    <div className="mt-1 font-display text-lg font-semibold">{s.title}</div>
                    <p className="mt-1 text-xs text-muted-foreground">{s.blurb}</p>
                  </div>
                  <button
                    disabled={!unlocked}
                    onClick={() => setDone((d) => ({ ...d, [s.key]: !d[s.key] }))}
                    className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition ${
                      isDone ? "border-success bg-success/15 text-success" : "border-border bg-card hover:bg-muted"
                    } disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    {isDone ? "Completed" : unlocked ? "Mark done" : "Locked"}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {unlocked && Object.values(done).filter(Boolean).length === STAGES.length && (
          <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="glass-panel mt-8 rounded-3xl p-8 text-center">
            <CheckCircle2 className="mx-auto h-10 w-10 text-success" />
            <p className="mt-3 font-display text-xl font-semibold">You've done everything you can.</p>
            <p className="mt-1 text-sm text-muted-foreground">Walk in and trust your preparation.</p>
            <Link to="/dashboard" className="mt-5 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold hover:bg-muted">Back to dashboard</Link>
          </motion.div>
        )}
      </div>
    </DashShell>
  );
}