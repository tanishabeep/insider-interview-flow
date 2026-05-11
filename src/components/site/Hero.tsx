import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight, Activity, Brain, Flame, TrendingUp } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-32">
      <div className="absolute inset-0 mesh-bg" aria-hidden />
      <div className="absolute inset-0 grid-pattern" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
            </span>
            Built by an IIM student — for IIM aspirants
          </div>
          <h1 className="mt-6 font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-7xl">
            Prepare for your <span className="gradient-text">IIM interviews</span>
            <br />with confidence.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
            An adaptive interview simulator with profile grilling, current-affairs cross-questioning,
            and 2-minute sprints designed to build interview-day instinct.
          </p>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6, ease }}
            className="mt-10 flex justify-center"
          >
            <Link
              to="/signup"
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-primary to-primary-glow px-7 py-4 text-sm font-semibold text-primary-foreground shadow-[0_20px_60px_-20px_oklch(0.55_0.22_270/0.6)] transition-transform hover:scale-[1.03]"
            >
              <span>Join Now</span>
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            </Link>
          </motion.div>
        </motion.div>

        <HeroVisual />
      </div>
    </section>
  );
}

function HeroVisual() {
  return (
    <div className="relative mx-auto mt-20 max-w-5xl">
      <motion.div
        initial={{ opacity: 0, y: 30, rotateX: 8 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ delay: 0.4, duration: 0.9, ease }}
        style={{ perspective: 1200 }}
        className="relative"
      >
        <div className="glass-panel relative overflow-hidden rounded-3xl p-6 md:p-8">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-warning/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-success/70" />
              <span className="ml-3 font-mono text-xs text-muted-foreground">simulator / panel-room</span>
            </div>
            <div className="rounded-full bg-success/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-success">live</div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <FloatingCard delay={0.5}>
              <Header icon={<Brain className="h-3.5 w-3.5" />} label="Profile grilling" tone="primary" />
              <p className="mt-3 font-display text-lg font-medium leading-snug">
                "You said you enjoy economics — name an economist you disagree with."
              </p>
              <div className="mt-4 flex gap-1.5">
                {[1, 2, 3, 4].map((i) => (
                  <span key={i} className={`h-1 flex-1 rounded-full ${i <= 3 ? "bg-primary" : "bg-border"}`} />
                ))}
              </div>
              <div className="mt-2 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                Follow-up depth · 3 / 4
              </div>
            </FloatingCard>

            <FloatingCard delay={0.65}>
              <Header icon={<Activity className="h-3.5 w-3.5" />} label="Live evaluation" tone="success" />
              <Score label="Clarity" value={82} />
              <Score label="Structure" value={74} />
              <Score label="Confidence" value={68} />
              <Score label="Originality" value={91} />
            </FloatingCard>

            <FloatingCard delay={0.8}>
              <Header icon={<TrendingUp className="h-3.5 w-3.5" />} label="Current affairs" tone="accent" />
              <SparklineMock />
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <div className="font-display text-2xl font-semibold">87<span className="text-sm text-muted-foreground">%</span></div>
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground">7-day accuracy</div>
                </div>
                <div className="flex items-center gap-1 rounded-full bg-warning/10 px-2 py-1 text-[10px] font-semibold text-warning">
                  <Flame className="h-3 w-3" /> 12-day streak
                </div>
              </div>
            </FloatingCard>
          </div>
        </div>

        {/* floating side widgets */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.0, duration: 0.7, ease }}
          className="absolute -left-6 top-1/3 hidden md:block animate-float"
        >
          <div className="glass-card rounded-2xl px-4 py-3">
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
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.1, duration: 0.7, ease }}
          className="absolute -right-4 -bottom-6 hidden md:block animate-float"
          style={{ animationDelay: "1.5s" }}
        >
          <div className="glass-card rounded-2xl px-4 py-3">
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Readiness</div>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="font-display text-xl font-semibold gradient-text">73</span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

function FloatingCard({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease }}
      whileHover={{ y: -4 }}
      className="glass-card rounded-2xl p-5"
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
      <span className={`grid h-6 w-6 place-items-center rounded-md ${map[tone]}`}>{icon}</span>
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
    </div>
  );
}

function Score({ label, value }: { label: string; value: number }) {
  return (
    <div className="mt-3 first:mt-4">
      <div className="mb-1 flex items-center justify-between text-[11px]">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-muted">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ delay: 0.9, duration: 1.1, ease }}
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
    <div className="mt-4 h-16 w-full">
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
          transition={{ delay: 1, duration: 1.4, ease }}
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
