import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, UserSearch, Sparkles, Loader2, Target, AlertTriangle, Shield, Flame, ChevronDown } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { sfx } from "@/lib/sounds";
import { DashShell } from "@/components/dash/Sidebar";

export const Route = createFileRoute("/grilling")({
  component: GrillingPage,
});

type Brief = {
  attack_zones: { title: string; why: string; questions: string[] }[];
  contradiction_traps: string[];
  weak_points: string[];
  strongest_anchors: string[];
  expected_followup_chains: { opener: string; chain: string[] }[];
};

function GrillingPage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  useEffect(() => { if (!loading && !user) nav({ to: "/login" }); }, [user, loading, nav]);

  const [form, setForm] = useState({ stream: "", hobbies: "", achievements: "", internships: "", background: "", sop: "" });
  const [busy, setBusy] = useState(false);
  const [brief, setBrief] = useState<Brief | null>(null);

  const completeness = (() => {
    const fields = Object.values(form);
    const filled = fields.filter((v) => v.trim().length > 0).length;
    return Math.round((filled / fields.length) * 100);
  })();

  async function generate() {
    if (!form.stream.trim() && !form.sop.trim()) {
      toast.error("Add at least your stream and a line on your interests.");
      return;
    }
    setBusy(true); setBrief(null); sfx.click();
    try {
      const res = await fetch("/api/grilling", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as Brief;
      setBrief(data); sfx.unlock();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
    } finally { setBusy(false); }
  }

  if (!user) return null;

  return (
    <DashShell><div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-8">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>

        <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
                <UserSearch className="h-3 w-3" /> Profile Grilling Intelligence
              </span>
              <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">Where will the panel cut you?</h1>
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Feed in your profile. We map every weak surface, contradiction trap, and follow-up chain a real panel would pursue.</p>
            </div>
            <div className="min-w-[200px]">
              <div className="mb-1 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                <span>Profile completeness</span>
                <span className="text-foreground">{completeness}%</span>
              </div>
              <div className={`h-2 w-full overflow-hidden rounded-full bg-muted ${completeness < 60 ? "animate-pulse-glow" : ""}`}>
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow transition-[width] duration-500"
                  style={{ width: `${completeness}%` }}
                />
              </div>
            </div>
          </div>
        </motion.header>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
          <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="glass-panel rounded-3xl p-6">
            <div className="font-display text-lg font-semibold">Your profile</div>
            <div className="mt-5 space-y-4">
              {([
                ["stream", "Stream / degree", "B.Tech CSE, 2nd year"],
                ["hobbies", "Hobbies", "Chess, distance running, fiction"],
                ["achievements", "Achievements", "State-level chess, hackathon winner"],
                ["internships", "Internships / work", "ML intern at a fintech"],
                ["background", "Background / city", "Tier-2 city, first-gen MBA aspirant"],
                ["sop", "SOP / future interests", "Want to start up in agritech logistics"],
              ] as const).map(([k, label, ph]) => (
                <div key={k}>
                  <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
                  <textarea
                    value={form[k]}
                    onChange={(e) => setForm({ ...form, [k]: e.target.value })}
                    placeholder={ph}
                    rows={k === "sop" ? 3 : 2}
                    className="w-full resize-none rounded-2xl border border-border bg-card/60 p-3 text-sm leading-relaxed outline-none transition-all focus:border-primary/50 focus:bg-card"
                  />
                </div>
              ))}
              <button
                onClick={generate}
                disabled={busy}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-glow px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-transform hover:scale-[1.02] disabled:opacity-60"
              >
                {busy ? <><Loader2 className="h-4 w-4 animate-spin" /> Building brief…</> : <><Sparkles className="h-4 w-4" /> Generate grilling brief</>}
              </button>
            </div>
          </motion.div>

          <div className="space-y-5">
            {!brief && !busy && <Empty />}
            {busy && <Loading />}
            <AnimatePresence>
              {brief && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-5"
                >
                  <Block icon={<Target className="h-4 w-4 text-rose-500" />} title="Attack zones">
                    <div className="space-y-3">
                      {brief.attack_zones.map((z, i) => <AttackZone key={i} z={z} i={i} />)}
                    </div>
                  </Block>

                  <Block icon={<AlertTriangle className="h-4 w-4 text-amber-500" />} title="Contradiction traps">
                    <ul className="space-y-2">
                      {brief.contradiction_traps.map((t, i) => (
                        <li key={i} className="flex gap-3 rounded-2xl border border-amber-200/40 bg-amber-50/40 p-3 text-sm">
                          <span className="font-mono text-xs text-amber-600">T{i + 1}</span>{t}
                        </li>
                      ))}
                    </ul>
                  </Block>

                  <div className="grid gap-5 md:grid-cols-2">
                    <Block icon={<Shield className="h-4 w-4 text-rose-500" />} title="Weak points">
                      <ul className="space-y-2 text-sm">{brief.weak_points.map((w, i) => <li key={i} className="flex gap-2"><span className="text-rose-500">•</span>{w}</li>)}</ul>
                    </Block>
                    <Block icon={<Flame className="h-4 w-4 text-emerald-500" />} title="Strongest anchors">
                      <ul className="space-y-2 text-sm">{brief.strongest_anchors.map((w, i) => <li key={i} className="flex gap-2"><span className="text-emerald-500">•</span>{w}</li>)}</ul>
                    </Block>
                  </div>

                  <Block icon={<Sparkles className="h-4 w-4 text-primary" />} title="Expected follow-up chains">
                    <div className="space-y-3">
                      {brief.expected_followup_chains.map((c, i) => <Chain key={i} c={c} />)}
                    </div>
                  </Block>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div></DashShell>
  );
}

function Empty() {
  return (
    <div className="glass-panel grid place-items-center rounded-3xl p-10 text-center">
      <UserSearch className="h-8 w-8 text-muted-foreground/60" />
      <p className="mt-3 text-sm text-muted-foreground">Fill the profile on the left. We'll generate an intelligence brief. Exactly what a panel would aim for.</p>
    </div>
  );
}
function Loading() {
  return (
    <div className="glass-panel grid place-items-center rounded-3xl p-10 text-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-3 text-sm text-muted-foreground">Reading between the lines of your profile…</p>
    </div>
  );
}
function Block({ icon, title, children }: { icon: React.ReactNode; title: string; children: React.ReactNode }) {
  return (
    <div className="glass-panel rounded-3xl p-6">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{icon}{title}</div>
      <div className="mt-4">{children}</div>
    </div>
  );
}
function AttackZone({ z, i }: { z: Brief["attack_zones"][number]; i: number }) {
  const [open, setOpen] = useState(i === 0);
  return (
    <motion.div layout className="glass-card overflow-hidden rounded-2xl">
      <button onClick={() => { setOpen(!open); sfx.panel(); }} className="flex w-full items-start justify-between gap-3 px-4 py-3 text-left">
        <div>
          <div className="font-display text-sm font-semibold">{z.title}</div>
          <div className="mt-0.5 text-xs text-muted-foreground">{z.why}</div>
        </div>
        <ChevronDown className={`mt-1 h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
            <ul className="space-y-2 px-4 pb-4">
              {z.questions.map((q, qi) => (
                <li key={qi} className="flex gap-3 rounded-xl border border-border bg-card/60 p-3 text-sm">
                  <span className="font-mono text-xs text-muted-foreground">Q{qi + 1}</span>{q}
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
function Chain({ c }: { c: Brief["expected_followup_chains"][number] }) {
  return (
    <div className="glass-card rounded-2xl p-4">
      <div className="text-sm font-semibold">{c.opener}</div>
      <ol className="mt-3 space-y-2">
        {c.chain.map((q, i) => (
          <li key={i} className="flex gap-3 text-sm">
            <span className="grid h-6 w-6 flex-shrink-0 place-items-center rounded-md bg-primary/10 text-[10px] font-bold text-primary">{i + 1}</span>
            <span>{q}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}