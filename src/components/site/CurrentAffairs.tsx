import { motion } from "framer-motion";
import { Newspaper, BarChart3, Globe2, Repeat, Brain, Target } from "lucide-react";

const ease = [0.22, 1, 0.36, 1] as const;

export function CurrentAffairs() {
  return (
    <section id="current-affairs" className="relative py-28">
      <div className="absolute inset-0 mesh-bg opacity-50" aria-hidden />
      <div className="relative mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Newspaper className="h-3.5 w-3.5" /> Current affairs intelligence
          </div>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight md:text-5xl">
            Two minutes a day. <span className="accent-text">Compounding edge.</span>
          </h2>
          <p className="mt-5 text-base text-muted-foreground">
            Most aspirants struggle with consistency, retention, and forming opinions worth defending.
            We rebuild that muscle through micro-sprints, opinion drills, and adaptive cross-questioning.
          </p>
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-border bg-card/70 px-4 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground backdrop-blur">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" />
            47 panel reconstructions indexed
            <span className="text-border-strong">·</span>
            Last added: IIM A stress interview, March 2024
            <span className="text-border-strong">·</span>
            Next: IIM C finance grilling chain
          </div>
        </motion.div>

        <div className="mt-16 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease }}
            className="glass-panel rounded-3xl p-7"
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Today's sprint</div>
                <div className="font-display text-2xl font-semibold">Geopolitics · India-EU FTA</div>
              </div>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">2 min</span>
            </div>

            <div className="mt-6 grid gap-3">
              {[
                { q: "What's your stance on India's stricter FDI screening?", tag: "Opinion" },
                { q: "Defend the opposite side of the Agnipath debate.", tag: "Counter-take" },
                { q: "How does the new repo rate hike affect MSMEs?", tag: "Application" },
              ].map((row, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.5, ease }}
                  whileHover={{ x: 4 }}
                  className="group flex items-center justify-between rounded-2xl border border-border bg-card/70 p-4 transition-all hover:border-border-strong hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <div className="text-sm font-medium">{row.q}</div>
                      <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{row.tag}</div>
                    </div>
                  </div>
                  <div className="opacity-0 transition-opacity group-hover:opacity-100">
                    <span className="text-xs font-semibold text-primary">Open →</span>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 flex items-center gap-4 rounded-2xl bg-gradient-to-r from-primary/5 via-accent/10 to-transparent p-4">
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-7 w-7 rounded-full border-2 border-card bg-gradient-to-br from-primary to-primary-glow" />
                ))}
              </div>
              <div className="text-xs text-muted-foreground">
                <span className="font-semibold text-foreground">2,847 aspirants</span> already finished today's sprint.
              </div>
            </div>
          </motion.div>

          <div className="grid gap-4">
            <Insight icon={<BarChart3 className="h-4 w-4" />} title="Trend analytics" body="Track which domains move your readiness needle the most." color="primary" />
            <Insight icon={<Brain className="h-4 w-4" />} title="Opinion drills" body="Practice defending both sides. The panel will probe both." color="accent" />
            <div className="grid grid-cols-2 gap-4">
              <Mini icon={<Globe2 className="h-4 w-4" />} stat="86%" label="Geopolitics accuracy" />
              <Mini icon={<Repeat className="h-4 w-4" />} stat="14d" label="Consistency streak" />
              <Mini icon={<Target className="h-4 w-4" />} stat="62%" label="Opinion drills" />
              <Mini icon={<BarChart3 className="h-4 w-4" />} stat="+18%" label="7-day momentum" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Insight({ icon, title, body, color }: { icon: React.ReactNode; title: string; body: string; color: "primary" | "accent" }) {
  const tone = color === "primary" ? "bg-primary/10 text-primary" : "bg-accent/20 text-accent-foreground";
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease }}
      whileHover={{ y: -3 }}
      className="glass-card rounded-2xl p-5"
    >
      <div className="flex items-center gap-3">
        <span className={`grid h-9 w-9 place-items-center rounded-xl ${tone}`}>{icon}</span>
        <div className="font-display text-base font-semibold">{title}</div>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">{body}</p>
    </motion.div>
  );
}

function Mini({ icon, stat, label }: { icon: React.ReactNode; stat: string; label: string }) {
  return (
    <motion.div whileHover={{ y: -3 }} className="glass-card rounded-2xl p-4">
      <div className="text-muted-foreground">{icon}</div>
      <div className="mt-2 font-display text-xl font-semibold">{stat}</div>
      <div className="text-[11px] text-muted-foreground">{label}</div>
    </motion.div>
  );
}
