import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { IllQuiz, IllInterview, IllProfile } from "@/components/illustrations";

export function RecommendedPath() {
  const [steps, setSteps] = useState<Array<{ to: "/quiz"|"/lab"|"/grilling"; Ill: typeof IllQuiz; eyebrow: string; title: string; note: string; locked: boolean }>>([
    { to: "/quiz", Ill: IllQuiz, eyebrow: "10 min · Opinion drill", title: "Pick your weakest domain", note: "Complete a session to unlock this recommendation.", locked: true },
    { to: "/lab", Ill: IllInterview, eyebrow: "12 min · Stress chain", title: "Defend your weakest score", note: "Complete a session to unlock this recommendation.", locked: true },
    { to: "/grilling", Ill: IllProfile, eyebrow: "5 min · Profile sweep", title: "Map your attack zones", note: "Complete a session to unlock this recommendation.", locked: true },
  ]);

  useEffect(() => {
    (async () => {
      const [attempts, evals] = await Promise.all([
        supabase.from("quiz_attempts").select("category, accuracy"),
        supabase.from("open_ended_responses").select("created_at, overall_score"),
      ]);
      const next = [...steps];
      const grouped = new Map<string, number[]>();
      (attempts.data ?? []).forEach(a => {
        const k = (a.category ?? "Mixed").toString();
        if (!grouped.has(k)) grouped.set(k, []);
        grouped.get(k)!.push(Number(a.accuracy ?? 0));
      });
      if (grouped.size > 0) {
        const sorted = [...grouped.entries()].map(([k, v]) => ({ k, avg: v.reduce((a, b) => a + b, 0) / v.length }))
          .sort((a, b) => a.avg - b.avg);
        const weakest = sorted[0];
        if (weakest) {
          next[0] = { ...next[0], title: weakest.k, note: `Your weakest domain at ${Math.round(weakest.avg)}% accuracy.`, locked: false };
        }
      }
      if ((evals.data ?? []).length > 0) {
        next[1] = { ...next[1], note: "Build the muscle the panel will test first.", locked: false };
      }
      const sessionCount = (attempts.data?.length ?? 0) + (evals.data?.length ?? 0);
      if (sessionCount > 0) {
        next[2] = { ...next[2], note: "Re-check your attack zones this week.", locked: false };
      }
      setSteps(next);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 }}
      className="mb-10"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Today's recommended path
        </div>
        <div className="hidden text-[11px] text-muted-foreground sm:block">~27 min · adaptive</div>
      </div>
      <div className="relative grid gap-6 sm:grid-cols-3">
        <span aria-hidden className="absolute left-0 right-0 top-1/2 hidden -translate-y-1/2 border-t border-dashed border-border-strong/60 sm:block" />
        {steps.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * i, duration: 0.45 }}
            className="relative"
          >
            <Link
              to={s.to}
              className={`group glass-card relative flex h-full flex-col gap-2 overflow-hidden rounded-2xl border-l-[3px] border-l-primary/70 px-7 py-6 ${s.locked ? "opacity-60" : ""}`}
            >
              <div className="flex items-center justify-between">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10">
                  <s.Ill size={22} />
                </span>
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  step {i + 1}
                </span>
              </div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {s.eyebrow}
              </div>
              <div className="font-display text-base font-semibold leading-tight">{s.title}</div>
              <div className="text-xs text-muted-foreground">{s.note}</div>
              <div className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Begin <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
