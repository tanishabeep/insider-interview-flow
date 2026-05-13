import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Brain, Layers, ShieldAlert, Target, TrendingUp } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

const FEATURES = [
  {
    n: "01",
    icon: Brain,
    title: "IIM-specific panel intelligence",
    body: [
      "IIM A doesn't ask the same kind of questions as IIM C. Coaching center mocks pretend they do.",
      "Each panel has its own grilling style — first-principles stress, quant ambushes, ethics traps.",
      "We mapped every one from reconstructed interviews so you walk in knowing the room.",
    ],
    example: '"You said you switched from engineering for impact. Define impact in numbers, please." — IIM A panel, Mar 2024.',
    cta: "See your panel",
    to: "/dashboard",
    accent: "from-primary/15 to-primary/5",
    Preview: PanelPreview,
  },
  {
    n: "02",
    icon: Layers,
    title: "Answer memory & contradiction detection",
    body: [
      "Most people give different answers to the same question depending on the framing. The panel notices.",
      "The system logs every position you take, then flags contradictions across sessions before a panelist does.",
    ],
    example: 'In your SOP: "stability matters most." In your last mock: "I want to start up." Pick one — and defend it.',
    cta: "Check my coherence",
    to: "/dashboard",
    accent: "from-warning/20 to-accent/10",
    Preview: MemoryPreview,
  },
  {
    n: "03",
    icon: TrendingUp,
    title: "The Day Before Protocol",
    body: [
      "The day before the interview is where most prep collapses. Anxious revision, no compounding gain.",
      "A focused four-stage sequence — consolidation, contradiction clearance, panel briefing, pressure sim — calibrated to your IIM and your interview date.",
    ],
    example: "Unlocks 72 hours before your interview. Used by 94% of users in the week leading up to their call.",
    cta: "Set my interview date",
    to: "/dashboard",
    accent: "from-primary/10 to-accent/15",
    Preview: ProtocolPreview,
  },
  {
    n: "04",
    icon: Target,
    title: "Profile attack map",
    body: [
      "Your profile has eight to twelve places where a panel will apply real pressure. You probably know two of them.",
      "We map all of them — the CGPA dip, the career switch nobody asks about, the hobby you can't actually defend.",
    ],
    example: '"You scored 8.9, then 7.4, then 8.6. Tell us about the 7.4 year." — every IIM panel, every year.',
    cta: "Build my attack map",
    to: "/grilling",
    accent: "from-destructive/15 to-warning/10",
    Preview: AttackPreview,
  },
  {
    n: "05",
    icon: ShieldAlert,
    title: "Opinion consistency tracker",
    body: [
      "Holding a defensible position on twenty topics is hard. Most aspirants drift without realising it.",
      "Track your stance on every topic you've engaged with, lock the version you'll defend, and run drills that try to break it.",
    ],
    example: "Topics in red are where your last three answers contradicted each other. Fix those before someone else finds them.",
    cta: "Open consistency tracker",
    to: "/dashboard",
    accent: "from-chart-3/20 to-primary/10",
    Preview: ConsistencyPreview,
  },
];

export function FeatureRows() {
  return (
    <section id="practice" className="relative py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease }}
          className="mb-20 max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            What's actually inside
          </div>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-5xl">
            The five things <span className="gradient-text">no one else does properly</span>.
          </h2>
          <p className="mt-5 text-base text-muted-foreground">
            Not features. Things I built because the absence of each one cost me — and most people I know who walked into a panel underprepared without realising it.
          </p>
        </motion.div>

        <div className="space-y-24 md:space-y-32">
          {FEATURES.map((f, i) => (
            <Row key={f.n} f={f} flip={i % 2 === 1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Row({ f, flip }: { f: (typeof FEATURES)[number]; flip: boolean }) {
  const Icon = f.icon;
  const Preview = f.Preview;
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease }}
      className={`relative grid items-center gap-10 md:grid-cols-2 md:gap-14 ${flip ? "md:[&>*:first-child]:order-2" : ""}`}
    >
      <div className="relative">
        <span aria-hidden className="absolute -top-10 -left-2 select-none font-display text-[120px] font-semibold leading-none text-primary/[0.06] md:text-[160px]">
          {f.n}
        </span>
        <div className="relative">
          <span className="inline-grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </span>
          <h3 className="mt-5 font-display text-3xl font-semibold leading-tight md:text-4xl">{f.title}</h3>
          <div className="mt-5 space-y-3 text-[15px] leading-relaxed text-muted-foreground">
            {f.body.map((p) => (<p key={p}>{p}</p>))}
          </div>
          <div className="mt-6 rounded-2xl border-l-2 border-l-primary/40 bg-card/60 p-4">
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Real example</div>
            <p className="mt-1 text-sm italic">{f.example}</p>
          </div>
          <Link to={f.to} className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <span className="border-b border-foreground/30 pb-0.5 transition-colors group-hover:border-foreground">Try this</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>

      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 200, damping: 22 }}
        className={`glass-panel relative overflow-hidden rounded-3xl p-6 md:p-7`}
      >
        <div className={`absolute -right-10 -top-10 h-44 w-44 rounded-full bg-gradient-to-br ${f.accent} blur-3xl`} aria-hidden />
        <div className="relative">
          <Preview />
        </div>
      </motion.div>
    </motion.div>
  );
}

/* — Preview widgets — */
function PanelPreview() {
  const iims = [
    { n: "IIM A", style: "First-principles stress", on: true },
    { n: "IIM B", style: "Strategic depth", on: false },
    { n: "IIM C", style: "Quant + logic", on: false },
    { n: "IIM L", style: "Behavioral", on: false },
  ];
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Panel intelligence</div>
      <div className="mt-3 space-y-1.5">
        {iims.map((i) => (
          <div key={i.n} className={`flex items-center justify-between rounded-xl border px-3 py-2 ${i.on ? "border-primary/30 bg-gradient-to-r from-primary/10 to-transparent" : "border-border bg-card/60"}`}>
            <span className="font-display text-sm font-semibold">{i.n}</span>
            <span className="text-[11px] text-muted-foreground">{i.style}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-xl bg-card/70 p-3 text-xs">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">Signature pattern</div>
        <div className="mt-1">"Why not X instead of Y?" — IIM A's first move.</div>
      </div>
    </div>
  );
}

function MemoryPreview() {
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Position library</div>
      <div className="mt-3 space-y-2">
        <Pos topic="Career motivation" status="Contradiction" tone="destructive" />
        <Pos topic="Repo rate stance" status="Consistent" tone="success" />
        <Pos topic="India–EU FTA" status="Drifted" tone="warning" />
        <Pos topic="Startup vs corporate" status="Locked" tone="primary" />
      </div>
      <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-xs">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-destructive">Panel-detectable</div>
        <div className="mt-1">"You said stability mattered. Last week you said you wanted to start up. Which is true?"</div>
      </div>
    </div>
  );
}
function Pos({ topic, status, tone }: { topic: string; status: string; tone: "destructive" | "warning" | "success" | "primary" }) {
  const map = {
    destructive: "border-destructive/40 text-destructive",
    warning: "border-warning/50 text-warning",
    success: "border-success/40 text-success",
    primary: "border-primary/40 text-primary",
  } as const;
  return (
    <div className={`flex items-center justify-between rounded-xl border-l-2 bg-card/70 p-2.5 text-xs ${map[tone]}`}>
      <span className="font-medium text-foreground">{topic}</span>
      <span className="text-[10px] font-semibold uppercase tracking-wider">{status}</span>
    </div>
  );
}

function ProtocolPreview() {
  const stages = [
    { l: "Consolidation brief", t: "20 min", done: true },
    { l: "Contradiction clearance", t: "10 min", done: true },
    { l: "Panel briefing — IIM A", t: "10 min", done: false, active: true },
    { l: "Final pressure simulation", t: "15 min", done: false },
  ];
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">T–18:42:11</div>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-primary">IIM A · 26 May</div>
      </div>
      <div className="mt-3 space-y-2">
        {stages.map((s, i) => (
          <div key={s.l} className={`flex items-center gap-3 rounded-xl border p-2.5 text-xs ${
            s.active ? "border-primary/40 bg-primary/5" : "border-border bg-card/60"
          }`}>
            <span className={`grid h-6 w-6 place-items-center rounded-md text-[10px] font-bold ${
              s.done ? "bg-success text-background" : s.active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>{i + 1}</span>
            <span className="flex-1 font-medium">{s.l}</span>
            <span className="text-[10px] text-muted-foreground">{s.t}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AttackPreview() {
  const zones = [
    { l: "Career switch motivation gap", lvl: "Critical" },
    { l: "CGPA drop in Y3", lvl: "High" },
    { l: "Hobby depth challenge", lvl: "Medium" },
    { l: "SOP–profile mismatch", lvl: "High" },
  ];
  const tone = (l: string) =>
    l === "Critical" ? "border-destructive text-destructive bg-destructive/5"
    : l === "High" ? "border-warning text-warning bg-warning/5"
    : "border-primary text-primary bg-primary/5";
  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Attack zones · 11 detected</div>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-destructive">3 critical</div>
      </div>
      <div className="mt-3 space-y-2">
        {zones.map((z) => (
          <div key={z.l} className={`flex items-center justify-between rounded-xl border-l-[3px] bg-card/70 p-2.5 text-xs ${tone(z.lvl)}`}>
            <span className="font-medium text-foreground">{z.l}</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider">{z.lvl}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ConsistencyPreview() {
  const topics = [
    { t: "India–China border", v: 82 },
    { t: "AI regulation", v: 47 },
    { t: "Repo rate cut", v: 71 },
    { t: "Career — startup", v: 28 },
  ];
  const color = (v: number) => v >= 70 ? "from-success to-success" : v >= 40 ? "from-warning to-accent" : "from-destructive to-warning";
  return (
    <div>
      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">Topic consistency</div>
      <div className="mt-3 space-y-2.5">
        {topics.map((t) => (
          <div key={t.t}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium">{t.t}</span>
              <span className="font-semibold">{t.v}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${t.v}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease }}
                className={`h-full rounded-full bg-gradient-to-r ${color(t.v)}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
