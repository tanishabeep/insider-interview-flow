import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, Sparkles, Timer, Brain, Volume2, VolumeX, Zap } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { CATEGORY_META, getBank, QUIZ_BANKS, type QuizCategory, type QuizQuestion } from "@/lib/quiz-banks";
import { sfx, isSoundOn, setSound } from "@/lib/sounds";

type Search = { c?: QuizCategory };

export const Route = createFileRoute("/quiz")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    c: (s.c as QuizCategory) && (s.c as string) in QUIZ_BANKS ? (s.c as QuizCategory) : undefined,
  }),
  component: QuizPage,
});

function QuizPage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const { c } = Route.useSearch();

  useEffect(() => { if (!loading && !user) nav({ to: "/login" }); }, [user, loading, nav]);

  if (!user) return null;
  if (!c) return <CategoryPicker />;
  return <Sprint category={c} userId={user.id} />;
}

function CategoryPicker() {
  const cats = Object.entries(CATEGORY_META) as [QuizCategory, typeof CATEGORY_META[QuizCategory]][];
  return (
    <div className="mesh-bg min-h-screen">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <Link to="/dashboard" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Dashboard
        </Link>
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="mt-6 font-display text-4xl font-semibold tracking-tight">Pick your battlefield.</h1>
          <p className="mt-2 text-sm text-muted-foreground">Each category has its own curated bank, themes, and follow-up traps.</p>
        </motion.div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map(([key, meta], i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -6 }}
              onMouseEnter={() => sfx.hover()}
            >
              <Link
                to="/quiz"
                search={{ c: key }}
                onClick={() => sfx.click()}
                className="glass-card group relative block overflow-hidden rounded-3xl p-6"
              >
                <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${meta.tone} opacity-20 blur-2xl transition-opacity group-hover:opacity-40`} />
                <div className="relative">
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{meta.tag}</div>
                  <div className="mt-1 font-display text-xl font-semibold">{meta.label}</div>
                  <p className="mt-2 text-xs text-muted-foreground">{meta.blurb}</p>
                  <div className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-foreground transition-transform group-hover:translate-x-1">
                    Begin sprint <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Sprint({ category, userId }: { category: QuizCategory; userId: string }) {
  const meta = CATEGORY_META[category];
  const bank = useMemo(() => getBank(category), [category]);
  const [stage, setStage] = useState<"intro" | "play" | "done">("intro");
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const [score, setScore] = useState(0);
  const [seconds, setSeconds] = useState(120);
  const [soundOn, setSoundOnState] = useState(isSoundOn());
  const [introCount, setIntroCount] = useState(3);

  // Cinematic intro countdown
  useEffect(() => {
    if (stage !== "intro") return;
    if (introCount === 0) { setStage("play"); sfx.unlock(); return; }
    const t = setTimeout(() => { sfx.tick(); setIntroCount((n) => n - 1); }, 700);
    return () => clearTimeout(t);
  }, [stage, introCount]);

  // Timer
  useEffect(() => {
    if (stage !== "play") return;
    const t = setInterval(() => setSeconds((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [stage]);
  useEffect(() => { if (seconds === 0 && stage === "play") finish(); }, [seconds, stage]);

  const q: QuizQuestion | undefined = bank[idx];
  const total = bank.length;

  function finish() {
    setStage("done");
    sfx.streak();
    void supabase.from("quiz_attempts").insert({
      user_id: userId,
      quiz_type: "sprint",
      category,
      score,
      accuracy: total ? (score / total) * 100 : 0,
      time_taken: 120 - seconds,
    });
  }

  function pick(i: number) {
    if (picked !== null || !q) return;
    setPicked(i);
    if (i === q.correct) { setScore((s) => s + 1); sfx.correct(); } else { sfx.wrong(); }
    setTimeout(() => setShowFollowUp(true), 600);
  }

  function next() {
    sfx.panel();
    if (idx + 1 >= total) { finish(); return; }
    setIdx(idx + 1);
    setPicked(null);
    setShowFollowUp(false);
  }

  function toggleSound() {
    const v = !soundOn;
    setSound(v);
    setSoundOnState(v);
    if (v) sfx.click();
  }

  if (stage === "done") {
    return <Results category={category} score={score} total={total} onRestart={() => location.reload()} />;
  }

  if (stage === "intro") {
    return (
      <div className="mesh-bg grid min-h-screen place-items-center px-6">
        <div className="text-center">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">{meta.tag}</motion.div>
          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-3 font-display text-4xl font-semibold md:text-5xl">{meta.label}</motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-2 text-sm text-muted-foreground">{meta.blurb}</motion.p>
          <AnimatePresence mode="wait">
            <motion.div
              key={introCount}
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="mx-auto mt-10 grid h-32 w-32 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-glow font-display text-6xl font-bold text-primary-foreground shadow-[0_30px_80px_-20px_oklch(0.55_0.22_270/0.5)]"
            >
              {introCount === 0 ? <Zap className="h-12 w-12" /> : introCount}
            </motion.div>
          </AnimatePresence>
          <p className="mt-8 text-xs text-muted-foreground">Two minutes. {total} questions. Adaptive follow-ups after each.</p>
        </div>
      </div>
    );
  }

  if (!q) return null;
  const progress = (idx / total) * 100;
  const lowTime = seconds <= 20;

  return (
    <div className="mesh-bg min-h-screen">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
        <Link to="/quiz" search={{}} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Exit sprint
        </Link>
        <div className="flex items-center gap-2">
          <button onClick={toggleSound} className="rounded-full border border-border bg-card p-1.5 text-muted-foreground hover:text-foreground" aria-label="toggle sound">
            {soundOn ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
          </button>
          <TimerRing seconds={seconds} total={120} low={lowTime} />
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
                {meta.tag}
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
                    onClick={() => pick(i)}
                    onMouseEnter={() => picked === null && sfx.hover()}
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
                  <div className="mt-4 flex items-center justify-between">
                    <Link to="/lab" className="text-xs font-semibold text-primary hover:underline">Open in Adaptive Lab →</Link>
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

function TimerRing({ seconds, total, low }: { seconds: number; total: number; low: boolean }) {
  const r = 14, c = 2 * Math.PI * r;
  const offset = c - (seconds / total) * c;
  return (
    <div className={`relative grid h-9 w-9 place-items-center rounded-full ${low ? "animate-pulse" : ""}`}>
      <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90">
        <circle cx="18" cy="18" r={r} stroke="oklch(0.92 0.01 270)" strokeWidth="3" fill="none" />
        <circle cx="18" cy="18" r={r} stroke={low ? "oklch(0.6 0.22 25)" : "oklch(0.55 0.22 270)"} strokeWidth="3" fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={offset} />
      </svg>
      <span className={`relative text-[10px] font-semibold tabular-nums ${low ? "text-destructive" : ""}`}>{seconds}</span>
    </div>
  );
}

function Results({ category, score, total, onRestart }: { category: QuizCategory; score: number; total: number; onRestart: () => void }) {
  const pct = Math.round((score / total) * 100);
  return (
    <div className="mesh-bg grid min-h-screen place-items-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="glass-panel w-full max-w-md rounded-3xl p-8 text-center"
      >
        <motion.div
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
          className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-[0_20px_60px_-20px_oklch(0.55_0.22_270/0.6)]"
        >
          <Sparkles className="h-7 w-7" />
        </motion.div>
        <h2 className="mt-5 font-display text-3xl font-semibold">Sprint complete</h2>
        <p className="mt-1 text-sm text-muted-foreground">{CATEGORY_META[category].label} · Streak +1</p>
        <div className="mt-6 grid grid-cols-3 gap-3">
          <Stat v={`${score}/${total}`} l="Correct" />
          <Stat v={`${pct}%`} l="Accuracy" />
          <Stat v="+12 XP" l="Earned" />
        </div>
        <div className="mt-7 flex flex-col gap-2">
          <button onClick={onRestart} className="rounded-full bg-gradient-to-r from-primary to-primary-glow px-5 py-3 text-sm font-semibold text-primary-foreground shadow-md transition-transform hover:scale-[1.02]">
            One more sprint
          </button>
          <Link to="/quiz" search={{}} className="rounded-full border border-border bg-card px-5 py-3 text-sm font-semibold transition-colors hover:bg-muted">
            Pick another category
          </Link>
          <Link to="/dashboard" className="text-xs text-muted-foreground hover:text-foreground">← Back to dashboard</Link>
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