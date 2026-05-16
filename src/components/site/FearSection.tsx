import { motion } from "framer-motion";

export function FearSection() {
  const stats = [
    { num: "12", text: "Minutes. The average time an IIM panel spends specifically on your profile in a 30-minute interview." },
    { num: "1 in 3", text: "Candidates who report being asked a question they had never considered preparing for." },
    { num: "72hrs", text: "Before your interview is when most people start preparing for it. The panel can tell." },
  ];
  const rows = [
    "You know your specific attack zones before you walk in, not during.",
    "You've practiced the exact pressure moments panels use for your profile type.",
    "Your opinions are consistent. Your contradictions are caught here, not in the room.",
  ];
  return (
    <>
      <section className="relative py-20" style={{ background: "#0D0D1A", color: "#FDFEFF" }}>
        <div className="mx-auto grid max-w-6xl gap-12 px-6 md:grid-cols-2 md:gap-16">
          <div className="space-y-10">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
              >
                <div className="font-display text-[4rem] font-black leading-none" style={{ color: "#DDF344" }}>{s.num}</div>
                <p className="mt-3 text-[0.92rem] leading-relaxed" style={{ color: "rgba(253,254,255,0.8)" }}>{s.text}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7 }}
            className="rounded-[20px] p-8"
            style={{ background: "rgba(253,254,255,0.06)", border: "1px solid rgba(253,254,255,0.15)" }}
          >
            <span className="inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider" style={{ background: "#DDF34420", color: "#DDF344" }}>
              What this changes.
            </span>
            <div className="mt-5 space-y-4">
              {rows.map((r, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="mt-2 block h-1.5 w-1.5 flex-shrink-0 rounded-full" style={{ background: "#DDF344" }} />
                  <p className="text-[0.92rem] leading-relaxed" style={{ color: "rgba(253,254,255,0.9)" }}>{r}</p>
                </div>
              ))}
            </div>
            <div className="my-6 h-px" style={{ background: "rgba(253,254,255,0.15)" }} />
            <button
              onClick={() => document.getElementById("vulnerability-scan")?.scrollIntoView({ behavior: "smooth" })}
              className="rounded-full px-7 py-2.5 text-[0.88rem] font-bold"
              style={{ background: "#DDF344", color: "#0D0D1A" }}
            >
              Find my attack zones.
            </button>
          </motion.div>
        </div>
      </section>
      <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="-mt-px block h-12 w-full" aria-hidden>
        <path d="M0,0 C320,60 720,60 1440,0 L1440,60 L0,60 Z" fill="#FDFEFF" />
        <path d="M0,0 C320,60 720,60 1440,0 L1440,0 Z" fill="#0D0D1A" />
      </svg>
    </>
  );
}
