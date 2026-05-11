import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, Sparkles, Send, Loader2, ChevronRight, Target,
  MessageSquare, Lightbulb, TrendingUp, Wand2, RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/site/Navbar";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/evaluator")({
  component: Evaluator,
});

const SEED_QUESTIONS: { category: string; question: string }[] = [
  { category: "Profile", question: "Walk us through your strongest extracurricular and what it taught you about leadership." },
  { category: "Economics", question: "Should the RBI cut the repo rate this quarter? Defend your stance." },
  { category: "Geopolitics", question: "What's your view on India's stance on the Russia–Ukraine conflict?" },
  { category: "Ethics", question: "A close friend cheated in an exam. They scored higher than you. What do you do?" },
  { category: "Stream", question: "Why management after your stream? Be specific, avoid clichés." },
  { category: "Self-awareness", question: "What's the worst feedback you've received this year, and what changed because of it?" },
];

type Scores = {
  confidence: number;
  communication: number;
  clarity: number;
  originality: number;
  logical_consistency: number;
  overall: number;
};

type Evaluation = {
  scores: Scores;
  evaluation: string;
  strengths: string[];
  weaknesses: string[];
  follow_up_questions: string[];
};

function Evaluator() {
  const { user, loading } = useAuth();
  const nav = useNavigate();

  useEffect(() => {
    if (!loading && !user) nav({ to: "/login" });
  }, [user, loading, nav]);

  const [seed, setSeed] = useState(SEED_QUESTIONS[0]);
  const [customQ, setCustomQ] = useState("");
  const [answer, setAnswer] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<Evaluation | null>(null);

  const activeQuestion = customQ.trim() || seed.question;
  const activeCategory = customQ.trim() ? "custom" : seed.category;

  async function evaluate() {
    if (!answer.trim() || answer.trim().length < 20) {
      toast.error("Write at least a couple of sentences before submitting.");
      return;
    }
    setSubmitting(true);
    setResult(null);
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: activeQuestion, answer, category: activeCategory }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Evaluation failed");
      }
      const data = (await res.json()) as Evaluation;
      setResult(data);

      // Persist
      if (user) {
        await supabase.from("open_ended_responses").insert({
          user_id: user.id,
          question: activeQuestion,
          answer,
          category: activeCategory,
          evaluation: data.evaluation,
          confidence_score: data.scores.confidence,
          communication_score: data.scores.communication,
          clarity_score: data.scores.clarity,
          originality_score: data.scores.originality,
          logical_consistency_score: data.scores.logical_consistency,
          overall_score: data.scores.overall,
          strengths: data.strengths,
          weaknesses: data.weaknesses,
          follow_up_questions: data.follow_up_questions,
        });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  function pickFollowUp(q: string) {
    setCustomQ(q);
    setAnswer("");
    setResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="mx-auto max-w-5xl px-6 pt-12 pb-24">
        <motion.header initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Brain className="h-3 w-3" /> AI Interview Evaluator
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Answer like a real panel. <span className="gradient-text">Get evaluated like one too.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Pick a question, write your answer, and get five-dimension feedback plus adaptive follow-ups — exactly how an IIM panel would drill deeper.
          </p>
        </motion.header>

        {/* Question selector */}
        <div className="mt-8">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Pick a question</div>
          <div className="mt-3 flex flex-wrap gap-2">
            {SEED_QUESTIONS.map((q) => (
              <button
                key={q.question}
                onClick={() => { setSeed(q); setCustomQ(""); setResult(null); }}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                  seed.question === q.question && !customQ
                    ? "border-foreground bg-foreground text-background"
                    : "border-border bg-card text-muted-foreground hover:text-foreground"
                }`}
              >
                {q.category}
              </button>
            ))}
          </div>
        </div>

        {/* Active question card */}
        <motion.div
          key={activeQuestion}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="glass-panel mt-5 rounded-3xl p-6"
        >
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <Target className="h-3 w-3" /> Question
          </div>
          <p className="mt-2 font-display text-lg font-semibold">{activeQuestion}</p>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={7}
            placeholder="Speak (well, type) like you're in front of three professors. Don't draft — answer."
            className="mt-5 w-full resize-none rounded-2xl border border-border bg-card/60 p-4 text-sm leading-relaxed outline-none transition-all focus:border-primary/50 focus:bg-card"
          />
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{answer.trim().split(/\s+/).filter(Boolean).length} words</span>
            <button
              onClick={evaluate}
              disabled={submitting}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background shadow-md transition-all hover:scale-[1.03] disabled:opacity-50"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {submitting ? "Evaluating…" : "Evaluate my answer"}
            </button>
          </div>
        </motion.div>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="mt-10 space-y-6"
            >
              <ScoreGrid scores={result.scores} />
              <FeedbackCard text={result.evaluation} />
              <div className="grid gap-5 md:grid-cols-2">
                <ListCard
                  title="Strengths"
                  icon={<Sparkles className="h-4 w-4 text-emerald-500" />}
                  items={result.strengths}
                  tone="emerald"
                />
                <ListCard
                  title="What to sharpen"
                  icon={<TrendingUp className="h-4 w-4 text-rose-500" />}
                  items={result.weaknesses}
                  tone="rose"
                />
              </div>
              <FollowUps items={result.follow_up_questions} onPick={pickFollowUp} />
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}

function ScoreGrid({ scores }: { scores: Scores }) {
  const dims: { key: keyof Scores; label: string }[] = [
    { key: "confidence", label: "Confidence" },
    { key: "communication", label: "Communication" },
    { key: "clarity", label: "Clarity" },
    { key: "originality", label: "Originality" },
    { key: "logical_consistency", label: "Logic" },
  ];
  return (
    <div className="glass-panel rounded-3xl p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Wand2 className="h-3 w-3" /> AI Panel Evaluation
        </div>
        <div className="text-right">
          <div className="text-xs text-muted-foreground">Overall</div>
          <div className="font-display text-3xl font-bold gradient-text">{scores.overall.toFixed(1)}</div>
        </div>
      </div>
      <div className="mt-5 grid gap-3 md:grid-cols-5">
        {dims.map((d, i) => (
          <ScoreBar key={d.key} label={d.label} value={scores[d.key]} delay={i * 0.07} />
        ))}
      </div>
    </div>
  );
}

function ScoreBar({ label, value, delay }: { label: string; value: number; delay: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <span className="font-display text-base font-bold">{value.toFixed(1)}</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-foreground/10">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${(value / 10) * 100}%` }}
          transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow"
        />
      </div>
    </div>
  );
}

function FeedbackCard({ text }: { text: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
      className="glass-card rounded-3xl border-l-4 border-primary/60 p-6"
    >
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <MessageSquare className="h-3 w-3" /> Panelist's note
      </div>
      <p className="mt-2 text-base leading-relaxed">{text}</p>
    </motion.div>
  );
}

function ListCard({
  title, icon, items, tone,
}: { title: string; icon: React.ReactNode; items: string[]; tone: "emerald" | "rose" }) {
  const border = tone === "emerald" ? "border-emerald-400/40" : "border-rose-400/40";
  return (
    <div className={`glass-card rounded-2xl border-l-4 ${border} p-5`}>
      <div className="flex items-center gap-2 text-sm font-semibold">{icon} {title}</div>
      <ul className="mt-3 space-y-2">
        {items.map((s, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className="flex gap-2 text-sm"
          >
            <ChevronRight className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <span>{s}</span>
          </motion.li>
        ))}
      </ul>
    </div>
  );
}

function FollowUps({ items, onPick }: { items: string[]; onPick: (q: string) => void }) {
  return (
    <div className="glass-panel rounded-3xl p-6">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Lightbulb className="h-3 w-3 text-primary" /> Adaptive follow-ups the panel would ask next
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {items.map((q, i) => (
          <motion.button
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.07 }}
            whileHover={{ y: -3 }}
            onClick={() => onPick(q)}
            className="group glass-card rounded-2xl p-4 text-left"
          >
            <p className="text-sm font-medium leading-snug">{q}</p>
            <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
              Answer this <RefreshCw className="h-3 w-3" />
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}