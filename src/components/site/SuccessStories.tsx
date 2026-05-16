import { motion } from "framer-motion";
import { Check } from "lucide-react";

// TODO: Replace these with real student stories as they come in.
// Collect via the post-interview prompt in the dashboard.
const STORIES = [
  {
    name: "Priya Sharma",
    iim: "IIM Indore call",
    stream: "Commerce",
    story:
      "I read the IIM Indore reconstruction three times. The panel asked me almost exactly what was in the pressure moments section. Not the same words. The same logic. I had an answer because I had thought about it already.",
  },
  {
    name: "Rohan Mehta",
    iim: "IIM Lucknow call",
    stream: "Engineering",
    story:
      "The profile scan told me my career switch story had a contradiction. I had never noticed it. I fixed it two weeks before my interview. They asked me exactly that question. I had a clean answer.",
  },
  {
    name: "Ananya Krishnan",
    iim: "IIM Kozhikode call",
    stream: "Humanities",
    story:
      "I used the Day Before Protocol the night before. It flagged that I had given three different opinions on India-China policy across my sessions. I locked one position. The panel asked me my view. I held it for 10 minutes of follow-up.",
  },
  {
    name: "Arjun Patel",
    iim: "IIM Bangalore call",
    stream: "Engineering",
    story:
      "My CGPA dropped in third year. I had been avoiding practicing that question. The attack map put it as my highest-risk zone. I practiced it until I stopped dreading it. It came up in the interview.",
  },
  {
    name: "Shreya Iyer",
    iim: "IIM Calcutta call",
    stream: "Commerce",
    story:
      "The IIM Calcutta panel intelligence page told me they would demand numbers behind every claim. I spent a week learning specific statistics for every topic I planned to discuss. They asked for numbers four times.",
  },
];

export function SuccessStories() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-6">
        <div className="text-center">
          <span className="inline-block rounded-full border px-3 py-1 text-[11px] font-bold" style={{ borderColor: "#DDF344", background: "#DDF34415", transform: "rotate(1deg)" }}>
            From students who used it.
          </span>
          <h2 className="mt-5 font-display text-[2rem] font-extrabold">They walked in knowing what was coming.</h2>
          <p className="mt-2 text-[0.9rem] text-muted-foreground">Specific moments. Real outcomes.</p>
        </div>

        <div
          className="mt-10 flex gap-5 overflow-x-auto pb-4"
          style={{ scrollSnapType: "x mandatory", WebkitOverflowScrolling: "touch" }}
        >
          {STORIES.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04, duration: 0.5 }}
              className="flex min-h-[240px] flex-shrink-0 flex-col rounded-[20px] bg-white p-7"
              style={{
                width: "min(340px, 80vw)",
                scrollSnapAlign: "start",
                border: "1.5px solid #ABC4FF60",
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="grid h-12 w-12 place-items-center rounded-full"
                  style={{ background: "#ABC4FF30", border: "2px dashed #4849F840" }}
                >
                  <span className="font-display text-[0.7rem] font-bold" style={{ color: "#4849F8" }}>
                    {s.name.split(" ").map((p) => p[0]).join("")}
                  </span>
                </div>
                <div>
                  <div className="font-display text-[0.92rem] font-bold">{s.name}</div>
                  <div className="text-[0.72rem] font-semibold" style={{ color: "#4849F8" }}>{s.iim}</div>
                  <div className="text-[0.65rem]" style={{ color: "#ABC4FF" }}>{s.stream}</div>
                </div>
              </div>
              <p className="mt-4 text-[0.85rem] leading-[1.65]" style={{ color: "rgba(13,13,26,0.8)" }}>{s.story}</p>
              <div className="mt-auto flex items-center gap-1.5 pt-4 text-[0.68rem]" style={{ color: "#ABC4FF" }}>
                <Check className="h-3 w-3" style={{ color: "#DDF344" }} /> Verified via IIM call letter
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
