import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Sparkles, Brain, Calendar, Crosshair, GitCompare, ArrowRight } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { DashShell } from "@/components/dash/Sidebar";

export const Route = createFileRoute("/hub/")({
  component: HubLanding,
});

const FEATURES = [
  { id: "panel-intel", name: "IIM Panel Intelligence", desc: "What each IIM panel actually tests.", icon: Sparkles, status: "active", to: "/hub/panel-intel" },
  { id: "memory", name: "Memory & Coherence", desc: "Tracks your positions over time. Catches contradictions.", icon: Brain, status: "active", to: "/hub/memory" },
  { id: "day-before", name: "Day Before Protocol", desc: "Unlocks 72 hours before your interview date.", icon: Calendar, status: "active", to: "/hub/day-before" },
  { id: "attack-map", name: "Profile Attack Map", desc: "The eight to twelve points a panel will press first.", icon: Crosshair, status: "active", to: "/hub/attack-map" },
  { id: "consistency", name: "Opinion Consistency Tracker", desc: "Defensible positions topic by topic.", icon: GitCompare, status: "active", to: "/hub/consistency" },
] as const;

function HubLanding() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  useEffect(() => { if (!loading && !user) nav({ to: "/login" }); }, [user, loading, nav]);
  if (!user) return null;

  return (
    <DashShell>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <motion.header initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-[11px] font-medium text-muted-foreground">
            <Sparkles className="h-3 w-3" /> Hub
          </div>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight md:text-5xl">New Features Hub</h1>
          <p className="mt-2 text-sm text-muted-foreground">Tools built from inside the panel room.</p>
        </motion.header>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            const active = f.status === "active";
            return (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                whileHover={active ? { y: -4 } : undefined}
                className={`glass-card relative overflow-hidden rounded-3xl p-6 ${active ? "" : "opacity-60"}`}
              >
                <div className="flex items-start gap-4">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-primary/15 to-accent/20 text-primary">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <div className="font-display text-lg font-semibold">{f.name}</div>
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                        active ? "bg-success/15 text-success" : "bg-muted text-muted-foreground"
                      }`}>
                        {active ? "Active" : "Setting up…"}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{f.desc}</p>
                  </div>
                </div>
                <div className="mt-5 flex justify-end">
                  {active && f.to ? (
                    <Link
                      to={f.to}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold transition-colors hover:bg-muted"
                    >
                      Open <ArrowRight className="h-3 w-3" />
                    </Link>
                  ) : (
                    <button disabled className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold text-muted-foreground">
                      Coming soon
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </DashShell>
  );
}