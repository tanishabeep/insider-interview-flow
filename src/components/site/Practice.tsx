import { motion } from "framer-motion";
import { MessagesSquare, UserSearch, ScanLine, Library } from "lucide-react";

const features = [
  {
    icon: MessagesSquare,
    title: "Adaptive cross-questioning",
    body: "The AI drills deeper like a real panel — every answer becomes the next, harder question.",
  },
  {
    icon: UserSearch,
    title: "Profile grilling predictor",
    body: "Upload your stream, hobbies and SOP. We predict your weakest interview surfaces.",
  },
  {
    icon: ScanLine,
    title: "Stress interview patterns",
    body: "Interruptions, contradictions, rapid-fire — train for what actually happens in the room.",
  },
  {
    icon: Library,
    title: "Real interview archive",
    body: "Reconstructed transcripts and recurring panel themes, presented as interactive cases.",
  },
];

export function Practice() {
  return (
    <section id="practice" className="py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            The practice ecosystem
          </div>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-5xl">
            Interview prep that <span className="gradient-text">reacts</span> to you.
          </h2>
          <p className="mt-5 text-muted-foreground">
            Every interaction adapts. Every answer compounds. The system learns your weak surfaces
            and rehearses you on them — exactly the way a real IIM panel would.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ delay: i * 0.07, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -4 }}
              className="glass-card group relative overflow-hidden rounded-3xl p-7"
            >
              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
              <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 text-primary">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-5 font-display text-xl font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
