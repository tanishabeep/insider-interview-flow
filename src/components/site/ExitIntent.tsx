import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { EmailCapture } from "./EmailCapture";
import { IllBrain } from "@/components/illustrations";
import { PUBLIC_ARCHIVE_SLUG } from "@/lib/public-archive";

const FLAG = "ipm_exit_modal_shown";

export function ExitIntent() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.innerWidth < 768) return;
    try { if (sessionStorage.getItem(FLAG)) return; } catch {/* ignore */}

    const onMove = (e: MouseEvent) => {
      if (e.clientY < window.innerHeight * 0.1) {
        try { sessionStorage.setItem(FLAG, "1"); } catch {/* ignore */}
        setOpen(true);
        document.removeEventListener("mousemove", onMove);
      }
    };
    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] grid place-items-center p-4"
          style={{ background: "rgba(13,13,26,0.4)", backdropFilter: "blur(4px)" }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.94, opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[480px] rounded-[20px] bg-white p-10"
            style={{ boxShadow: "var(--shadow-floating)" }}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 grid h-8 w-8 place-items-center text-muted-foreground hover:text-foreground"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
            <div className="flex justify-center"><IllBrain size={48} stroke="#4849F8" /></div>
            <h2 className="mt-3 text-center font-display text-[1.4rem] font-extrabold">Before you go.</h2>
            <p className="mx-auto mt-2 max-w-[340px] text-center text-[0.88rem] text-muted-foreground">
              Get the top 10 questions IIM panels actually asked this year. One email. No course pitch.
            </p>
            <div className="mt-4">
              <EmailCapture source="exit_intent" compact />
            </div>
            <div className="mt-4 flex justify-center gap-6 text-[0.72rem]">
              <Link to="/archive/$slug" params={{ slug: PUBLIC_ARCHIVE_SLUG }} className="underline text-muted-foreground">
                Read a real interview first
              </Link>
              <a href="#pricing" onClick={() => setOpen(false)} className="underline text-muted-foreground">
                See what's inside
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
