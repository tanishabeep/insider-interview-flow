import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Newspaper, UserSearch } from "lucide-react";

const STEPS = [
  {
    to: "/quiz",
    icon: Newspaper,
    eyebrow: "10 min · Opinion drill",
    title: "Economic policy",
    note: "Your weakest domain. Consistency 34%.",
  },
  {
    to: "/lab",
    icon: Brain,
    eyebrow: "12 min · Stress chain",
    title: "Defend your weakest score",
    note: "Build the muscle the panel will test first.",
  },
  {
    to: "/grilling",
    icon: UserSearch,
    eyebrow: "5 min · Profile sweep",
    title: "Re-check attack zones",
    note: "Two new contradictions detected this week.",
  },
];

export function RecommendedPath() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.05 }}
      className="mt-6"
    >
      <div className="mb-3 flex items-center justify-between">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Today's recommended path
        </div>
        <div className="hidden text-[11px] text-muted-foreground sm:block">~27 min · adaptive</div>
      </div>
      <div className="relative grid gap-3 sm:grid-cols-3">
        <span aria-hidden className="absolute left-0 right-0 top-1/2 hidden -translate-y-1/2 border-t border-dashed border-border-strong/60 sm:block" />
        {STEPS.map((s, i) => (
          <motion.div
            key={s.title}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 * i, duration: 0.45 }}
            className="relative"
          >
            <Link
              to={s.to}
              className="group glass-card relative flex h-full flex-col gap-2 overflow-hidden rounded-2xl border-l-[3px] border-l-primary/70 p-4"
            >
              <div className="flex items-center justify-between">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                  <s.icon className="h-4 w-4" />
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
