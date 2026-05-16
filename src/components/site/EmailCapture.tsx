import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { IllInterview } from "@/components/illustrations";

// TODO: Connect to email service (Resend / SendGrid) to deliver the top 10 questions PDF to this address.

export function EmailCapture({ source = "homepage_email_capture" as "homepage_email_capture" | "exit_intent", compact = false }: { source?: "homepage_email_capture" | "exit_intent"; compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [shake, setShake] = useState(false);
  const [err, setErr] = useState("");
  const [done, setDone] = useState(false);

  const submit = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setShake(true); setErr("That doesn't look like a valid email");
      setTimeout(() => setShake(false), 350);
      return;
    }
    setErr("");
    try {
      await (supabase as any).from("leads").insert({ email, source });
    } catch {/* ignore */}
    setDone(true);
  };

  if (done) {
    return (
      <div className="text-center">
        <span className="inline-block rounded-full px-3 py-1 text-[11px] font-bold" style={{ background: "#DDF34430", color: "#0D0D1A" }}>You're in.</span>
        <p className="mt-3 font-display text-[0.95rem] font-semibold">Check your email in the next few minutes.</p>
      </div>
    );
  }

  return (
    <div className={compact ? "" : "text-center"}>
      {!compact && (
        <>
          <div className="flex justify-center"><IllInterview size={56} stroke="#4849F8" className="animate-float" style={{ opacity: 0.85 }} /></div>
          <h2 className="mt-4 font-display text-[1.8rem] font-extrabold">Get the questions IIM panels actually asked this cycle.</h2>
          <p className="mx-auto mt-3 max-w-md text-[0.9rem] text-muted-foreground">
            One email. The top 10 questions from real reconstructions, with the best and worst answers. No course sales. Just the intelligence.
          </p>
        </>
      )}
      <AnimatePresence>
        <motion.div
          key="form"
          animate={shake ? { x: [-4, 4, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: 0.3 }}
          className={`mt-5 flex flex-col gap-3 sm:flex-row ${compact ? "" : "justify-center"}`}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="rounded-[12px] border-[1.5px] px-4 py-3 text-[0.88rem] outline-none transition-colors focus:border-[#4849F8] focus:shadow-[0_0_0_3px_#4849F815] sm:w-[300px]"
            style={{ borderColor: "#ABC4FF80" }}
          />
          <button onClick={submit} className="rounded-[12px] px-6 py-3 text-[0.88rem] font-bold text-white hover:scale-[1.02] transition-transform" style={{ background: "#4849F8" }}>
            Send me the questions
          </button>
        </motion.div>
      </AnimatePresence>
      {err && <div className="mt-2 text-[0.72rem]" style={{ color: "#4849F8" }}>{err}</div>}
      {!compact && <p className="mt-3 text-[0.68rem] text-muted-foreground">No spam. Unsubscribe anytime.</p>}
    </div>
  );
}

export function EmailCaptureSection() {
  return (
    <section className="py-16" style={{ background: "#4849F808" }}>
      <div className="mx-auto max-w-[560px] px-6">
        <EmailCapture source="homepage_email_capture" />
      </div>
    </section>
  );
}
