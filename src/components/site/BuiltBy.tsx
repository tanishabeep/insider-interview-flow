import { motion } from "framer-motion";
import { GraduationCap, Quote } from "lucide-react";

export function BuiltBy() {
  return (
    <section id="built-by" className="relative py-28">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-10 md:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
              <GraduationCap className="h-3.5 w-3.5" /> Insider perspective
            </div>
            <h2 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-5xl">
              Built by an <span className="gradient-text">IIM student</span>.
            </h2>
            <p className="mt-5 max-w-md text-base text-muted-foreground">
              <span className="font-semibold text-foreground">Built from inside the panel room.</span>
              <br />Patterns, silences, cross-questions. The things that actually decide it.
            </p>
            <div className="mt-7 grid grid-cols-3 gap-4">
              {[
                { v: "12+", l: "Real interview formats" },
                { v: "300+", l: "Curated grilling chains" },
                { v: "Daily", l: "Current affairs sprints" },
              ].map((s) => (
                <div key={s.l} className="glass-card rounded-xl p-3">
                  <div className="font-display text-xl font-semibold">{s.v}</div>
                  <div className="text-[11px] text-muted-foreground">{s.l}</div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="glass-panel relative rounded-3xl p-8">
              <Quote className="absolute -top-4 -left-3 h-10 w-10 rounded-2xl bg-gradient-to-br from-primary to-primary-glow p-2.5 text-primary-foreground shadow-lg" />
              <p className="font-display text-xl leading-relaxed md:text-[1.4rem]">
                "Most aspirants aren't unprepared. They're prepared for the wrong interview."
              </p>
              <div className="mt-7 flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-glow font-display text-base font-semibold text-primary-foreground">
                  IA
                </div>
                <div>
                  <div className="text-sm font-semibold">Founder · IIM student</div>
                  <div className="text-xs text-muted-foreground">PGP candidate, MBA interview cohort</div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -right-3 hidden md:block">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="glass-card rounded-2xl px-4 py-3"
              >
                <div className="text-[10px] uppercase tracking-wide text-muted-foreground">Approach</div>
                <div className="text-xs font-semibold">Realism &gt; Marketing</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
