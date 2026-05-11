import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Sparkles, Timer, Brain } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/quiz")({
  component: QuizPage,
});

type Q = {
  prompt: string;
  options: string[];
  correct: number;
  followUp: string;
  domain: string;
};

const QUESTIONS: Q[] = [
  {
    domain: "Geopolitics",
    prompt: "Which agreement underpins India's recent strategic energy partnership with the EU?",
    options: ["EU Green Deal", "India–EU Trade & Tech Council", "REPowerEU", "Carbon Border Adjustment"],
    correct: 1,
    followUp: "Now defend the position that India should NOT align with EU climate trade policy. Two reasons.",
  },
  {
    domain: "Economic policy",
    prompt: "An RBI repo-rate hike most directly compresses margins for which segment first?",
    options: ["Large IT exporters", "MSME working-capital borrowers", "Public sector banks", "Sovereign bond holders"],
    correct: 1,
    followUp: "If you were RBI Governor today, would you hike, hold or cut? Justify in 30 seconds.",
  },
  {
    domain: "Profile grilling",
    prompt: "You said you 'enjoy economics'. Which economist do you most disagree with — and why?",
    options: ["Skip — opinion only", "Skip — opinion only", "Skip — opinion only", "Skip — opinion only"],
    correct: 0,
    followUp: "Now name a policy from the last 24 months that economist would have opposed.",
  },
  {
    domain: "Indian politics",
    prompt: "The 'One Nation, One Election' proposal primarily seeks to reform what?",
    options: ["Voter ID system", "Synchronisation of national & state polls", "Electoral bonds", "Anti-defection law"],
    correct: 1,
    followUp: "Argue the federalism objection to this proposal in one sentence.",
  },
  {
    domain: "Global trends",
    prompt: "AI compute restrictions in 2025 are most consequential for which industry shift?",
    options: ["Renewable financing", "Sovereign chip strategies", "Crypto adoption", "Tourism"],
    correct: 1,
    followUp: "How should India position itself between US and Chinese AI compute regimes?",
  },
];

function QuizPage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  useEffect(() => { if (!loading && !user) nav({ to: "/login" }); }, [user, loading, nav]);

  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(120);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [done]);
  useEffect(() => { if (seconds === 0) setDone(true); }, [seconds]);

  const q = QUESTIONS[idx];
  const total = QUESTIONS.length;
  const progress = useMemo(() => (idx / total) * 100, [idx, total]);

  const onPick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.correct) setScore((s) => s + 1);
    setTimeout(() => setShowFollowUp(true), 600);
  };

  const next = () => {
    if (idx + 1 >= total) { setDone(true); return; }
    setIdx(idx + 1);
    setPicked(null);
    setShowFollowUp(false);
  };

  if (!user) return null;

  if (done) return <Results score={score} total={total} onRestart={() => { setIdx(0); setPicked(null); setShowFollowUp(false); setScore(0); setSeconds(120); setDone(false); }} />;

  return (
    <div className="mesh-bg min-h-screen">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Exit sprint
        </Link>
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold tabular-nums">
          <Timer className="h-3.5 w-3.5 text-primary" />
          {String(Math.floor(seconds / 60)).padStart(2, "0")}:{String(seconds % 60).padStart(2, "0")}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-6">
        <div className="mb-6 h-1.5 overflow-hidden rounded-full bg-muted">
          <motion.div
            initial={false}
            animate={{ width: `${progress + (picked !== null ? 100 / total : 0)}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow"
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel rounded-3xl p-7"
          >
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                {q.domain}
              </div>
              <div className="text-[11px] text-muted-foreground">Question {idx + 1} / {total}</div>
            </div>
            <h2 className="mt-5 font-display text-2xl font-semibold leading-snug md:text-3xl">{q.prompt}</h2>
            <div className="mt-7 grid gap-3">
              {q.options.map((opt, i) => {
                const state =
                  picked === null ? "idle"
                  : i === q.correct ? "correct"
                  : picked === i ? "wrong"
                  : "dim";
                return (
                  <motion.button
                    key={i}
                    onClick={() => onPick(i)}
                    whileHover={picked === null ? { x: 4 } : {}}
                    whileTap={picked === null ? { scale: 0.99 } : {}}
                    disabled={picked !== null}
                    className={[
                      "flex items-center justify-between rounded-2xl border bg-card p-4 text-left text-sm transition-all",
                      state === "idle" && "border-border hover:border-primary/40 hover:shadow-md",
                      state === "correct" && "border-success/60 bg-success/5",
                      state === "wrong" && "border-destructive/60 bg-destructive/5",
                      state === "dim" && "opacity-50",
                    ].filter(Boolean).join(" ")}
                  >
                    <span className="flex items-center gap-3">
                      <span className={`grid h-7 w-7 place-items-center rounded-lg text-[11px] font-semibold ${
                        state === "correct" ? "bg-success text-background" :
                        state === "wrong" ? "bg-destructive text-destructive-foreground" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {state === "correct" ? <Check className="h-3.5 w-3.5" /> : String.fromCharCode(65 + i)}
                      </span>
                      <span className="font-medium">{opt}</span>
                    </span>
                  </motion.button>
                );
              })}
            </div>

            <AnimatePresence>
              {showFollowUp && (
                <motion.div
                  initial={{ opacity: 0, y: 12, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.4 }}
                  className="mt-6 overflow-hidden"
                >
                  <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/10 p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-primary">
                      <Brain className="h-3.5 w-3.5" /> Adaptive follow-up
                    </div>
                    <p className="mt-2 text-sm leading-relaxed">{q.followUp}</p>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={next}
                      className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-background transition-transform hover:scale-[1.03]"
                    >
                      Next question <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Results({ score, total, onRestart }: { score: number; total: number; onRestart: () => void }) {
  const pct = Math.round((score / total) * 100);
  return (
    <div className="mesh-bg grid min-h-screen place-items-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-panel w-full max-w-md rounded-3xl p-8 text-center"
      >
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-lg">
          <Sparkles className="h-7 w-7" />
        </div>
        <h2 className="mt-5 font-display text-3xl font-semibold">Sprint complete</h2>
        <p className="mt-1 text-sm text-muted-foreground">Momentum logged. Streak +1.</p>
        <div className="mt-6 grid grid-cols-3 gap-3">
          <Stat v={`${score}/${total}`} l="Correct" />
          <Stat v={`${pct}%`} l="Accuracy" />
          <Stat v="+12 XP" l="Earned" />
        </div>
        <div className="mt-7 flex flex-col gap-2">
          <button onClick={onRestart} className="rounded-full bg-gradient-to-r from-primary to-primary-glow px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-transform hover:scale-[1.02]">
            One more sprint
          </button>
          <Link to="/dashboard" className="rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold transition-colors hover:bg-muted">
            Back to dashboard
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

function Stat({ v, l }: { v: string; l: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="font-display text-lg font-semibold">{v}</div>
      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{l}</div>
    </div>
  );
}
