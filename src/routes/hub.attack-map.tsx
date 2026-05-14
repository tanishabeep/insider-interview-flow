import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Crosshair, Sparkles, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";
import { DashShell } from "@/components/dash/Sidebar";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/hub/attack-map")({
  component: AttackMapPage,
});

type Zone = { id: string; name: string; threat: "low" | "medium" | "high" | "critical"; why: string; chain: string[]; defend: string };

const THREAT_STYLES: Record<Zone["threat"], string> = {
  low: "border-l-muted-foreground/40",
  medium: "border-l-primary",
  high: "border-l-warning",
  critical: "border-l-destructive",
};

function generateZones(profile: Record<string, string>): Zone[] {
  const zones: Zone[] = [];
  if (profile.cgpaDrop) {
    zones.push({
      id: "cgpa",
      name: "The academic trajectory dip",
      threat: "high",
      why: "A visible drop in your transcript invites a 'what happened, and what does it predict?' line of questioning.",
      chain: [
        `Your CGPA dropped during ${profile.cgpaDrop}. What happened?`,
        "How does that reflect on your ability to handle the pressure of a two-year MBA?",
        "Give me one example of sustained performance since then.",
      ],
      defend: "Don't apologize. Own the cause briefly, then redirect to the recovery and what it taught you.",
    });
  }
  if (profile.careerSwitch) {
    zones.push({
      id: "switch",
      name: "The career switch motivation gap",
      threat: "critical",
      why: "Switching from a technical to a management track creates a 'why now, why not later' surface.",
      chain: [
        `You moved from ${profile.careerSwitch}. Why now?`,
        "What stops you from doing this without an MBA?",
        "Two years from now, what specifically will be different?",
      ],
      defend: "Anchor the switch in a concrete experience, not in abstract aspiration. Show the missing capability the MBA fills.",
    });
  }
  if (profile.hobbies) {
    zones.push({
      id: "hobby",
      name: "The hobby depth challenge",
      threat: "medium",
      why: "Listed hobbies that aren't pursued at depth become trap doors.",
      chain: [
        `You listed ${profile.hobbies}. How long, how often?`,
        "Name three people who shaped this field.",
        "Walk me through the last time you actually did this.",
      ],
      defend: "Either show genuine depth or remove the hobby. Half-pursued hobbies are worse than no hobby.",
    });
  }
  if (profile.sopClaim) {
    zones.push({
      id: "sop",
      name: "The SOP claim audit",
      threat: "high",
      why: `You claimed "${profile.sopClaim}" in your SOP. Panels read SOPs like contracts.`,
      chain: [
        "Walk me through the specific moment that produced this conviction.",
        "What's the strongest counter-argument someone could make?",
        "Has this view ever been wrong for you?",
      ],
      defend: "Be ready to live the claim with one specific story. Not a list — one story, told well.",
    });
  }
  if (zones.length === 0) {
    zones.push({
      id: "default",
      name: "The 'tell me about yourself' opener",
      threat: "medium",
      why: "The first 60 seconds set the entire panel's frame for you. Most candidates waste them.",
      chain: ["Tell me about yourself.", "Why this story and not another?", "What would your closest friend say is missing from that?"],
      defend: "Lead with one specific identity statement. End with a hook the panel wants to pull on.",
    });
  }
  return zones;
}

function AttackMapPage() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  useEffect(() => { if (!loading && !user) nav({ to: "/login" }); }, [user, loading, nav]);

  const [profile, setProfile] = useState({ cgpaDrop: "", careerSwitch: "", hobbies: "", sopClaim: "" });
  const [zones, setZones] = useState<Zone[]>([]);
  const [generating, setGenerating] = useState(false);
  const [steps, setSteps] = useState<string[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("attack_map_profiles").select("*").order("generated_at", { ascending: false }).limit(1).maybeSingle().then(({ data }) => {
      if (data) {
        const snap = data.profile_snapshot as typeof profile;
        if (snap) setProfile({ cgpaDrop: snap.cgpaDrop ?? "", careerSwitch: snap.careerSwitch ?? "", hobbies: snap.hobbies ?? "", sopClaim: snap.sopClaim ?? "" });
        if (Array.isArray(data.predicted_lines)) setZones(data.predicted_lines as unknown as Zone[]);
      }
    });
  }, [user]);

  if (!user) return null;

  async function generate() {
    setGenerating(true);
    setSteps([]);
    const lines = ["Scanning academic trajectory…", "Detecting career motivation gaps…", "Cross-referencing profile claims…", "Mapping contradiction surfaces…"];
    for (const l of lines) { await new Promise(r => setTimeout(r, 700)); setSteps((s) => [...s, l]); }
    const newZones = generateZones(profile);
    setZones(newZones);
    setGenerating(false);
    const { error } = await supabase.from("attack_map_profiles").insert({
      user_id: user!.id,
      profile_snapshot: profile,
      hot_zones: newZones.filter((z) => z.threat === "high" || z.threat === "critical").map((z) => z.name),
      weak_spots: newZones.map((z) => z.name),
      predicted_lines: newZones as unknown as Record<string, unknown>[],
    });
    if (error) toast.error(error.message);
    else toast.success("Attack map generated.");
  }

  const critical = zones.filter((z) => z.threat === "critical").length;
  const high = zones.filter((z) => z.threat === "high").length;

  return (
    <DashShell>
      <div className="mx-auto max-w-6xl px-6 py-10">
        <header className="flex items-start gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-destructive/15 to-warning/20 text-destructive">
            <Crosshair className="h-5 w-5" />
          </span>
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">Profile Attack Map</h1>
            <p className="mt-1 font-mono text-xs text-muted-foreground">The eight to twelve points a panel will press first. Built from your actual profile.</p>
          </div>
        </header>

        <div className="mt-8 glass-panel rounded-3xl p-6">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Profile snapshot</div>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Field label="Year of CGPA dip (if any)" v={profile.cgpaDrop} on={(v) => setProfile({ ...profile, cgpaDrop: v })} placeholder="e.g. third year" />
            <Field label="Career switch context" v={profile.careerSwitch} on={(v) => setProfile({ ...profile, careerSwitch: v })} placeholder="e.g. backend engineering" />
            <Field label="Hobbies (comma separated)" v={profile.hobbies} on={(v) => setProfile({ ...profile, hobbies: v })} placeholder="e.g. chess, classical music" />
            <Field label="Strongest SOP claim" v={profile.sopClaim} on={(v) => setProfile({ ...profile, sopClaim: v })} placeholder="e.g. I want to build climate startups" />
          </div>
          <div className="mt-5 flex justify-end">
            <button onClick={generate} disabled={generating} className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-primary-glow px-5 py-2.5 text-xs font-semibold text-primary-foreground disabled:opacity-50">
              <Sparkles className="h-3.5 w-3.5" /> {generating ? "Analyzing…" : zones.length ? "Regenerate map" : "Generate attack map"}
            </button>
          </div>
          {generating && (
            <div className="mt-4 space-y-1 font-mono text-[11px] text-muted-foreground">
              {steps.map((s) => <div key={s}>› {s}</div>)}
            </div>
          )}
        </div>

        {zones.length > 0 && (
          <>
            <div className="mt-6 grid gap-3 md:grid-cols-4">
              <Stat label="Total zones" value={zones.length} />
              <Stat label="Critical" value={critical} tone="destructive" />
              <Stat label="High" value={high} tone="warning" />
              <Stat label="Pressure score" value={Math.min(100, zones.length * 20 + critical * 10)} suffix="%" />
            </div>

            <div className="mt-6 space-y-4">
              {zones.map((z, i) => (
                <motion.div key={z.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`glass-panel rounded-3xl border-l-[4px] p-6 ${THREAT_STYLES[z.threat]}`}>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                      z.threat === "critical" ? "bg-destructive/15 text-destructive" :
                      z.threat === "high" ? "bg-warning/15 text-warning" :
                      z.threat === "medium" ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                    }`}>{z.threat}</span>
                    <div className="font-display text-base font-semibold">{z.name}</div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{z.why}</p>
                  <ol className="mt-3 space-y-2">
                    {z.chain.map((q, idx) => (
                      <li key={idx} className="flex items-start gap-2 rounded-xl bg-muted/60 p-3 font-mono text-[11px]">
                        <ArrowRight className="mt-0.5 h-3 w-3 shrink-0 text-primary" /> {q}
                      </li>
                    ))}
                  </ol>
                  <div className="mt-3 rounded-xl border-l-2 border-l-primary bg-card/70 p-3 text-xs"><span className="font-semibold">Defend: </span>{z.defend}</div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </DashShell>
  );
}

function Field({ label, v, on, placeholder }: { label: string; v: string; on: (s: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
      <input value={v} onChange={(e) => on(e.target.value)} placeholder={placeholder} className="mt-1 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm" />
    </label>
  );
}

function Stat({ label, value, tone, suffix }: { label: string; value: number; tone?: "destructive" | "warning"; suffix?: string }) {
  const c = tone === "destructive" ? "text-destructive" : tone === "warning" ? "text-warning" : "text-foreground";
  return (
    <div className="glass-panel rounded-2xl p-4">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-1 font-display text-2xl font-semibold tabular-nums ${c}`}>{value}{suffix ?? ""}</div>
    </div>
  );
}