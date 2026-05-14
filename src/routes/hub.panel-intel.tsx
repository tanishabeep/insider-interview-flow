import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GitCompare, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { DashShell } from "@/components/dash/Sidebar";
import { IIM_INTEL, type IimIntel } from "@/lib/iim-panel-intel";
import { sfx } from "@/lib/sounds";

export const Route = createFileRoute("/hub/panel-intel")({
  component: PanelIntelPage,
});

const STREAMS = ["All profiles", "Engineering", "Commerce/Humanities"] as const;

function PanelIntelPage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  useEffect(() => { if (!loading && !user) nav({ to: "/login" }); }, [user, loading, nav]);

  const [activeId, setActiveId] = useState(IIM_INTEL[0].id);
  const [stream, setStream] = useState<(typeof STREAMS)[number]>("All profiles");
  const active = IIM_INTEL.find((i) => i.id === activeId)!;

  if (!user) return null;

  return (
    <DashShell>
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl font-semibold tracking-tight md:text-5xl">Panel Intelligence</h1>
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              What each IIM panel actually tests. Sourced from reconstructed interviews.
            </p>
          </div>
          <button
            onClick={() => toast.message("IIM comparison coming in the next update.")}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold transition-colors hover:bg-muted"
          >
            <GitCompare className="h-3.5 w-3.5" /> Compare IIMs
          </button>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-2">
          {STREAMS.map((s) => (
            <button
              key={s}
              onClick={() => { setStream(s); }}
              title="Profile-specific intelligence coming soon."
              className={`rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-all ${
                stream === s ? "border-foreground bg-foreground text-background" : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-[0.32fr_1fr]">
          {/* Left selector */}
          <div className="space-y-2">
            {IIM_INTEL.map((i) => {
              const isActive = i.id === activeId;
              return (
                <button
                  key={i.id}
                  onClick={() => { setActiveId(i.id); sfx.click(); }}
                  onMouseEnter={() => sfx.hover()}
                  className={`group flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left transition-all ${
                    isActive
                      ? "border-l-[3px] border-l-primary border-y-border border-r-border bg-secondary/40 shadow-sm"
                      : "border-border bg-card hover:bg-muted"
                  }`}
                >
                  <div>
                    <div className="font-display text-sm font-semibold">{i.name}</div>
                    <div className="text-[11px] text-muted-foreground">{i.shortStyle}</div>
                  </div>
                  <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${isActive ? "translate-x-0.5 text-primary" : ""}`} />
                </button>
              );
            })}
          </div>

          {/* Right intelligence */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeId}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-5"
            >
              <IntelView iim={active} onPractice={() => nav({ to: "/lab" })} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </DashShell>
  );
}

function IntelView({ iim, onPractice }: { iim: IimIntel; onPractice: () => void }) {
  const domains: { label: string; key: keyof IimIntel["domainEmphasis"] }[] = [
    { label: "Current Affairs", key: "currentAffairs" },
    { label: "Profile Analysis", key: "profileAnalysis" },
    { label: "General Knowledge", key: "generalKnowledge" },
    { label: "Ethics", key: "ethics" },
    { label: "Subject Knowledge", key: "subject" },
  ];
  return (
    <>
      <Card>
        <Eyebrow>Panel composition</Eyebrow>
        <p className="mt-2 text-sm leading-relaxed">{iim.panelComposition}</p>
      </Card>

      <Card>
        <Eyebrow>Signature grilling patterns</Eyebrow>
        <div className="mt-3 space-y-3">
          {iim.signaturePatterns.map((p) => (
            <div key={p.name} className="rounded-2xl border-l-[3px] border-l-warning/70 bg-card/70 p-4">
              <div className="font-display text-sm font-semibold">{p.name}</div>
              <p className="mt-1 text-xs text-muted-foreground">{p.description}</p>
              <blockquote className="mt-3 rounded-xl bg-muted/60 p-3 font-mono text-[11px] leading-relaxed text-foreground/90">
                {p.exampleQuestion}
              </blockquote>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <Eyebrow>Domain emphasis</Eyebrow>
        <div className="mt-4 space-y-3">
          {domains.map((d, i) => {
            const v = iim.domainEmphasis[d.key];
            return (
              <div key={d.key}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{d.label}</span>
                  <span className="font-semibold">{v}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${v}%` }}
                    transition={{ delay: 0.1 + i * 0.06, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className="h-full rounded-full bg-gradient-to-r from-primary to-primary-glow"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <Card>
        <Eyebrow>What a good answer looks like</Eyebrow>
        <div className="mt-3 space-y-2">
          {iim.goodAnswerTraits.map((t) => (
            <div key={t} className="rounded-xl border-l-2 border-l-primary bg-card/70 px-3 py-2 text-sm">{t}</div>
          ))}
        </div>
      </Card>

      <Card>
        <Eyebrow>Historical themes</Eyebrow>
        <div className="mt-3 flex flex-wrap gap-2">
          {iim.historicalThemes.map((t) => (
            <span key={t} className="rounded-full border border-border bg-card px-3 py-1 text-[11px] text-muted-foreground">{t}</span>
          ))}
        </div>
      </Card>

      <button
        onClick={onPractice}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-primary-glow px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_16px_40px_-16px_oklch(0.55_0.22_270/0.55)] transition-transform hover:scale-[1.02]"
      >
        Practice {iim.name} panel style →
      </button>
    </>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="glass-panel rounded-3xl p-6">{children}</div>;
}
function Eyebrow({ children }: { children: React.ReactNode }) {
  return <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{children}</div>;
}