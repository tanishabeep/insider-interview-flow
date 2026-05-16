import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Activity, Brain, Flame, TrendingUp } from "lucide-react";
import { InterviewDateStrip } from "@/components/site/InterviewDateStrip";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 pb-24">
      <div className="absolute inset-0 mesh-bg" aria-hidden />
      <div className="absolute inset-0 grid-pattern" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
              </span>
              Built from inside the panel room
            </div>
            <h1 className="mt-6 font-display text-[2.6rem] font-semibold leading-[1.05] tracking-tight md:text-[3.4rem] lg:text-[3.8rem]">
              <span className="gradient-text">I got into IIM at 18.</span>
              <br />
              <span className="gradient-text">I know exactly how that panel thinks.</span>
              <br />
              <span className="font-normal text-foreground/80">I built this so you do too.</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-[17px]">
              The panel watches how you think, not what you've memorised. That gap is what this is built for.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                to="/signup"
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-foreground px-6 py-3.5 text-sm font-semibold text-background shadow-[0_20px_60px_-20px_oklch(0.18_0.04_265/0.55)] transition-transform hover:scale-[1.03]"
              >
                <span>See what they'll actually ask you</span>
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </Link>
              <Link to="/archive" className="group inline-flex items-center gap-1.5 text-sm font-semibold text-foreground/80 hover:text-foreground">
                <span className="border-b border-foreground/20 pb-0.5 transition-colors group-hover:border-foreground/60">Read a real interview first</span>
              </Link>
            </div>

            <InterviewDateStrip />

            <FounderByline />
          </motion.div>

          <HeroVisual />
        </div>
      </div>
    </section>
  );
}

function FounderByline() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35, duration: 0.6, ease }}
      className="mt-10 flex items-center gap-4 border-t border-border pt-6"
    >
      <div className="relative">
        <span className="absolute inset-0 -m-[3px] rounded-full bg-gradient-to-br from-primary via-primary-glow to-accent" aria-hidden />
        <div className="relative grid h-12 w-12 place-items-center rounded-full bg-foreground font-display text-sm font-semibold text-background">
          IA
        </div>
      </div>
      <div className="text-xs leading-relaxed">
        <div className="font-semibold text-foreground">Ishaan Arora · IIM Indore, IPM 2027 batch</div>
        <div className="mt-0.5 text-muted-foreground">
          Built this after realising every mock platform was preparing people for an interview that doesn't actually happen.
        </div>
      </div>
    </motion.div>
  );
}

function HeroVisual() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotateX: 8 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay: 0.25, duration: 0.9, ease }}
      style={{ perspective: 1200 }}
      className="relative"
    >
      <div className="glass-panel relative overflow-hidden rounded-3xl p-5 md:p-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
            <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
            <span className="ml-3 font-mono text-[10px] text-muted-foreground">simulator / panel-room</span>
          </div>
          <div className="rounded-full bg-success/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-success">live</div>
        </div>

        <div className="mt-5 space-y-3">
          <FloatingCard delay={0.3}>
            <Header icon={<Brain className="h-3.5 w-3.5" />} label="Profile grilling" tone="primary" />
            <p className="mt-2 font-display text-[15px] font-medium leading-snug">
              "You said you enjoy economics. Name an economist you disagree with."
            </p>
            <div className="mt-3 flex gap-1.5">
              {[1, 2, 3, 4].map((i) => (
                <span key={i} className={`h-1 flex-1 rounded-full ${i <= 3 ? "bg-primary" : "bg-border"}`} />
              ))}
            </div>
            <div className="mt-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
              Follow-up depth · 3 / 4
            </div>
          </FloatingCard>

          <div className="grid gap-3 md:grid-cols-2">
            <FloatingCard delay={0.45}>
              <Header icon={<Activity className="h-3.5 w-3.5" />} label="Live evaluation" tone="success" />
              <Score label="Clarity" value={82} />
              <Score label="Originality" value={91} />
            </FloatingCard>

            <FloatingCard delay={0.6}>
              <Header icon={<TrendingUp className="h-3.5 w-3.5" />} label="Current affairs" tone="accent" />
              <SparklineMock />
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <div className="font-display text-xl font-semibold">87<span className="text-xs text-muted-foreground">%</span></div>
                  <div className="text-[9px] uppercase tracking-wide text-muted-foreground">7-day accuracy</div>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-warning/10 px-2 py-0.5 text-[10px] font-semibold text-warning">
                  <Flame className="h-3 w-3" /> 12d
                </div>
              </div>
            </FloatingCard>
          </div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.85, duration: 0.7, ease }}
        className="absolute -left-4 top-1/3 hidden md:block animate-float"
      >
        <div className="glass-card rounded-2xl px-3 py-2.5">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">
              <Brain className="h-3.5 w-3.5" />
            </span>
            <div>
              <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Adaptive engine</div>
              <div className="text-xs font-semibold">Cross-questioning ON</div>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.95, duration: 0.7, ease }}
        className="absolute -right-3 -bottom-5 hidden md:block animate-float"
        style={{ animationDelay: "1.5s" }}
      >
        <div className="glass-card rounded-2xl px-3 py-2.5">
          <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Readiness</div>
          <div className="mt-0.5 flex items-baseline gap-1">
            <span className="font-display text-lg font-semibold gradient-text">73</span>
            <span className="text-[10px] text-muted-foreground">/ 100</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function FloatingCard({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease }}
      whileHover={{ y: -3 }}
      className="glass-card rounded-2xl p-4"
    >
      {children}
    </motion.div>
  );
}

function Header({ icon, label, tone }: { icon: React.ReactNode; label: string; tone: "primary" | "success" | "accent" }) {
  const map = {
    primary: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    accent: "bg-accent/20 text-accent-foreground",
  };
  return (
    <div className="flex items-center gap-2">
      <span className={`grid h-5 w-5 place-items-center rounded-md ${map[tone]}`}>{icon}</span>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
    </div>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div className="mt-2.5 first:mt-3">
      <div className="mb-1 flex items-center justify-between text-[11px]">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ delay: 0.7, duration: 1.1, ease }}
          className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow"
        />
      </div>
    </div>
  );
}

function SparklineMock() {
  const points = [12, 28, 22, 38, 32, 50, 46, 64, 58, 72];
  const max = 80;
  const path = points.map((p, i) => `${i === 0 ? "M" : "L"} ${(i / (points.length - 1)) * 100} ${100 - (p / max) * 100}`).join(" ");
  return (
    <div className="mt-3 h-12 w-full">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full">
        <defs>
          <linearGradient id="sparkFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.78 0.18 75)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="oklch(0.78 0.18 75)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.path
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.8, duration: 1.4, ease }}
          d={path}
          fill="none"
          stroke="oklch(0.78 0.18 75)"
          strokeWidth="2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        <path d={`${path} L 100 100 L 0 100 Z`} fill="url(#sparkFill)" />
      </svg>
    </div>
  );
}
