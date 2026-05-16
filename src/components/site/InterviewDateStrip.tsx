import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { IllCalendar } from "@/components/illustrations";

const KEY = "ipm_interview_date";

function diffDays(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - today.getTime()) / 86400000);
}

export function InterviewDateStrip() {
  const [date, setDate] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) { setDate(saved); setOpen(true); }
    } catch {/* ignore */}
  }, []);

  const handleChange = (v: string) => {
    setDate(v);
    setOpen(!!v);
    try { localStorage.setItem(KEY, v); } catch {/* ignore */}
  };

  const n = date ? diffDays(date) : null;

  let message: React.ReactNode = null;
  let ctaText = ""; let ctaTo: string | null = null; let ctaInternal = false;
  let ctaStyle: React.CSSProperties = { background: "#4849F8", color: "white" };
  let borderColor = "#4849F840";

  if (n !== null) {
    if (n < 0) {
      message = "That date has passed. If your interview is coming up, enter the right date. If you've already had your interview, we'd love to hear how it went.";
      ctaText = "Share your story"; ctaTo = "/signup";
    } else if (n === 0) {
      message = "Your interview is today. Good luck. Trust your preparation.";
      borderColor = "#DDF34480";
    } else if (n <= 6) {
      message = "Less than a week. Use the Day Before Protocol. It won't fix everything but it will make sure you walk in with a clear head and your contradictions resolved.";
      ctaText = "Access Day Before Protocol"; ctaTo = "/signup";
      borderColor = "#4849F840";
    } else if (n <= 14) {
      message = "Two weeks. Enough time to address two or three critical vulnerabilities. Not enough time to start from scratch. Find out what matters most for your profile right now.";
      ctaText = "See my top risks"; ctaInternal = true;
      ctaStyle = { background: "#DDF344", color: "#0D0D1A" };
    } else if (n <= 30) {
      message = "Three to four weeks is enough time to find and fix your biggest gaps. Most candidates spend this period on generic prep. You can spend it on yours.";
      ctaText = "Find my gaps"; ctaInternal = true;
    } else {
      message = "You have time to do this properly. Students who spend 4+ weeks building consistent practice walk in with a fundamentally different level of confidence. Start with your profile scan.";
      ctaText = "Start profile scan"; ctaInternal = true;
    }
  }

  return (
    <div className="mx-auto mt-8 w-full max-w-[480px]">
      <motion.div
        layout
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="overflow-hidden"
        style={{
          background: open ? "#4849F808" : "rgba(255,255,255,0.8)",
          border: `1.5px solid ${open ? borderColor : "#ABC4FF60"}`,
          borderRadius: open ? "16px" : "100px",
          padding: open ? "1.25rem 1.5rem" : "0.6rem 0.6rem 0.6rem 1.25rem",
        }}
      >
        <div className="flex items-center gap-3">
          <IllCalendar size={18} stroke="#ABC4FF" />
          <span className="flex-1 text-[0.8rem]" style={{ color: "#0D0D1A" }}>
            {open && n !== null ? null : "When is your IIM interview?"}
          </span>
          <input
            type="date"
            value={date}
            onChange={(e) => handleChange(e.target.value)}
            className="bg-transparent text-[0.8rem] font-semibold outline-none"
            style={{ color: "#4849F8", border: "none" }}
          />
        </div>

        <AnimatePresence>
          {open && n !== null && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-4">
                {n > 0 && (
                  <div className="flex items-baseline gap-2">
                    <span className="font-display text-[1.4rem] font-extrabold" style={{ color: "#4849F8" }}>{n}</span>
                    <span className="text-[0.88rem]" style={{ color: "#0D0D1A" }}>days until your IIM interview.</span>
                  </div>
                )}
                <p className="mt-2 text-[0.82rem] leading-relaxed text-muted-foreground">{message}</p>
                {ctaText && (
                  <div className="mt-3">
                    {ctaInternal ? (
                      <button
                        onClick={() => document.getElementById("vulnerability-scan")?.scrollIntoView({ behavior: "smooth" })}
                        className="rounded-full px-4 py-2 text-[0.78rem] font-bold"
                        style={ctaStyle}
                      >
                        {ctaText}
                      </button>
                    ) : ctaTo ? (
                      <Link to={ctaTo} className="inline-block rounded-full px-4 py-2 text-[0.78rem] font-bold" style={ctaStyle}>
                        {ctaText}
                      </Link>
                    ) : null}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
