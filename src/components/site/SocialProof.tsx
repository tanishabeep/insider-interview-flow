import { motion } from "framer-motion";

export function SocialProof() {
  return (
    <section className="relative border-y border-border bg-gradient-to-r from-transparent via-primary/[0.03] to-transparent">
      <div className="absolute inset-0 mesh-bg opacity-30" aria-hidden />
      <div className="relative mx-auto flex max-w-6xl flex-col items-stretch gap-3 px-6 py-5 md:flex-row md:items-center md:gap-0">
        <Stat value="2,847" label="aspirants prepping inside" />
        <Divider />
        <Stat value="184" label="IIM calls received by users" />
        <Divider />
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground md:text-right"
        >
          <span className="normal-case tracking-normal text-foreground/85">
            "Caught a contradiction in my own answers I'd been giving for months."
          </span>
          <span className="ml-2 normal-case text-muted-foreground">,  Aarushi K., IIM Indore call</span>
        </motion.div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex items-baseline gap-2 md:px-5">
      <span className="font-display text-base font-semibold tabular-nums">{value}</span>
      <span className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">{label}</span>
    </div>
  );
}

function Divider() {
  return <span aria-hidden className="hidden h-5 w-px bg-border md:block" />;
}
