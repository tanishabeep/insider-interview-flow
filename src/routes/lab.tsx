import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Brain, Send, Loader2, Sparkles, MessageSquare, Bot, User as UserIcon } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { sfx } from "@/lib/sounds";

export const Route = createFileRoute("/lab")({
  component: LabPage,
});

const SCENARIOS = [
  { id: "stream", label: "Why management?", opener: "You're a strong stream candidate. Why pivot to management — and why now? Be specific. Avoid clichés." },
  { id: "weak", label: "Defend your weakest score", opener: "Your weakest score is staring at us. Walk us through what happened — and what changed because of it." },
  { id: "policy", label: "Policy stance", opener: "Should India's RBI cut the repo rate this quarter? Take a side and defend it for one minute." },
  { id: "ethics", label: "Ethical dilemma", opener: "Your team-lead at an internship asks you to slightly inflate a metric in a deck for a partner. What do you do — and why?" },
  { id: "global", label: "Geopolitics", opener: "Pick one foreign-policy decision India made in the last year and tell us if you'd reverse it." },
];

type Turn =
  | { role: "panel"; text: string }
  | { role: "you"; text: string }
  | { role: "feedback"; eval: { evaluation: string; strengths: string[]; weaknesses: string[]; scores: Record<string, number> } };

function LabPage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  useEffect(() => { if (!loading && !user) nav({ to: "/login" }); }, [user, loading, nav]);

  const [scenario, setScenario] = useState(SCENARIOS[0]);
  const [turns, setTurns] = useState<Turn[]>([{ role: "panel", text: SCENARIOS[0].opener }]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTurns([{ role: "panel", text: scenario.opener }]);
    setInput("");
    sfx.panel();
  }, [scenario]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [turns]);

  async function submit() {
    if (!input.trim() || input.trim().length < 15) {
      toast.error("Give the panel at least a sentence or two."); return;
    }
    const userText = input.trim();
    setInput(""); setBusy(true); sfx.click();

    const lastPanel = [...turns].reverse().find((t) => t.role === "panel") as { role: "panel"; text: string } | undefined;
    setTurns((t) => [...t, { role: "you", text: userText }]);

    try {
      const res = await fetch("/api/evaluate", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: lastPanel?.text ?? scenario.opener, answer: userText, category: scenario.id }),
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      sfx.unlock();
      setTurns((t) => [
        ...t,
        { role: "feedback", eval: { evaluation: data.evaluation, strengths: data.strengths ?? [], weaknesses: data.weaknesses ?? [], scores: data.scores ?? {} } },
        { role: "panel", text: (data.follow_up_questions?.[0]) ?? "Take another angle on what you just said." },
      ]);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Lab error");
    } finally { setBusy(false); }
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-surface">
      <div className="mx-auto max-w-5xl px-6 py-8">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
        <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Brain className="h-3 w-3" /> Adaptive Interview Lab
          </span>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">A live AI panel that doesn't let go.</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Pick a scenario. Answer. Get evaluated and grilled with a real follow-up — chain after chain.</p>
        </motion.header>

        <div className="mt-6 flex flex-wrap gap-2">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              onClick={() => { setScenario(s); }}
              onMouseEnter={() => sfx.hover()}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                scenario.id === s.id ? "border-foreground bg-foreground text-background" : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >{s.label}</button>
          ))}
        </div>

        <div className="glass-panel mt-6 rounded-3xl p-6">
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {turns.map((t, i) => <TurnBubble key={i} t={t} i={i} />)}
            </AnimatePresence>
            {busy && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Panel is deliberating…
              </motion.div>
            )}
            <div ref={endRef} />
          </div>

          <div className="mt-6 flex items-end gap-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows={3}
              placeholder="Answer the panel out loud (well, type it) — don't draft."
              className="flex-1 resize-none rounded-2xl border border-border bg-card/60 p-3 text-sm leading-relaxed outline-none transition-all focus:border-primary/50 focus:bg-card"
            />
            <button
              onClick={submit}
              disabled={busy}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-background hover:scale-[1.03] transition-transform disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TurnBubble({ t, i }: { t: Turn; i: number }) {
  if (t.role === "panel") {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }} className="flex gap-3">
        <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-md">
          <Bot className="h-4 w-4" />
        </div>
        <div className="glass-card rounded-2xl p-4">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Panel</div>
          <p className="mt-1 text-sm leading-relaxed">{t.text}</p>
        </div>
      </motion.div>
    );
  }
  if (t.role === "you") {
    return (
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-row-reverse gap-3">
        <div className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-2xl bg-foreground text-background">
          <UserIcon className="h-4 w-4" />
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">You</div>
          <p className="mt-1 text-sm leading-relaxed">{t.text}</p>
        </div>
      </motion.div>
    );
  }
  const overall = t.eval.scores?.overall ?? 0;
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="ml-12 rounded-2xl border-l-4 border-primary/60 bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-wider text-primary">
          <MessageSquare className="h-3 w-3" /> Panelist's note
        </div>
        <div className="text-xs"><span className="font-display text-base font-semibold gradient-text">{Number(overall).toFixed(1)}</span><span className="text-muted-foreground">/10</span></div>
      </div>
      <p className="mt-2 text-sm leading-relaxed">{t.eval.evaluation}</p>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 inline-flex items-center gap-1"><Sparkles className="h-3 w-3" /> Strengths</div>
          <ul className="mt-1 space-y-1 text-xs">{t.eval.strengths.map((s, i) => <li key={i}>• {s}</li>)}</ul>
        </div>
        <div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-rose-600">Sharpen</div>
          <ul className="mt-1 space-y-1 text-xs">{t.eval.weaknesses.map((s, i) => <li key={i}>• {s}</li>)}</ul>
        </div>
      </div>
    </motion.div>
  );
}