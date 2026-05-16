import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Users, Target, Flame, BookOpen, AlertTriangle,
  CheckCircle2, XCircle, Lightbulb, ChevronDown,
} from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { isPublicArchive } from "@/lib/public-archive";
import { useNavigate } from "@tanstack/react-router";
import { IllTarget } from "@/components/illustrations";

export const Route = createFileRoute("/archive/$slug")({
  component: ArchiveDetail,
  head: ({ params }) => {
    const slug = params.slug;
    // Derive a readable IIM label from the slug
    const title = `${slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())} — Interview Reconstruction | IPM Ace`;
    const desc = `Read the complete reconstruction of a real IIM interview. Full panel walkthrough, pressure moments, best and weak answers, and panel psychology analysis.`;
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
        { property: "og:type", content: "article" },
      ],
      links: [
        { rel: "canonical", href: `https://insider-interview-flow.lovable.app/archive/${slug}` },
      ],
    };
  },
});

type Phase = { phase: string; duration: string; questions: string[] };
type Moment = { moment: string; detail: string };
type QA = { q: string; a: string };

type Archive = {
  id: string;
  title: string;
  panel_type: string | null;
  candidate_background: string | null;
  interview_flow: Phase[];
  grilling_themes: string[] | null;
  stress_moments: Moment[];
  best_answers: QA[];
  weak_answers: QA[];
  lessons_learned: string[] | null;
  tags: string[] | null;
  difficulty: string | null;
  duration_minutes: number | null;
};

function ArchiveDetail() {
  const { slug } = Route.useParams();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState<Archive | null>(null);
  const [loading, setLoading] = useState(true);
  const [openPhase, setOpenPhase] = useState<number | null>(0);

  useEffect(() => {
    if (!authLoading && !user && !isPublicArchive(slug)) {
      navigate({ to: "/signup" });
    }
  }, [user, authLoading, slug, navigate]);

  useEffect(() => {
    supabase
      .from("real_interview_archive")
      .select("*")
      .eq("slug", slug)
      .maybeSingle()
      .then(({ data }) => {
        setItem(data as unknown as Archive);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="mesh-bg grid min-h-screen place-items-center">
        <div className="glass-panel rounded-2xl px-6 py-4 text-sm text-muted-foreground">Loading case…</div>
      </div>
    );
  }
  if (!item) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-3xl px-6 py-24 text-center">
          <h1 className="font-display text-3xl font-bold">Case not found</h1>
          <Link to="/archive" className="mt-4 inline-block text-sm text-primary">← Back to archive</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <article className="mx-auto max-w-5xl px-6 pt-12">
        <Link to="/archive" className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Archive
        </Link>

        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6"
        >
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-foreground/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {item.difficulty}
            </span>
            <span className="rounded-full border border-border bg-card px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              {item.duration_minutes} min panel
            </span>
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">{item.title}</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">{item.candidate_background}</p>
        </motion.header>

        {/* Panel + themes */}
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <InfoCard icon={<Users className="h-4 w-4" />} title="Panel composition" body={item.panel_type ?? ", "} />
          <InfoCard
            icon={<Target className="h-4 w-4" />}
            title="What they were testing"
            body={(item.grilling_themes ?? []).join(" · ")}
          />
        </div>

        {isPublicArchive(slug) && !user && (
          <InlinePrompt
            bold="Your profile has different attack zones than this candidate."
            plain="The free scan takes 90 seconds and shows you where your panel will press hardest."
            cta="Find my attack zones"
            to="/#vulnerability-scan"
          />
        )}

        {/* Interview flow timeline */}
        <Section title="Interview flow" icon={<BookOpen className="h-4 w-4" />}>
          <div className="space-y-3">
            {(item.interview_flow ?? []).map((phase, i) => {
              const open = openPhase === i;
              return (
                <motion.div
                  key={i}
                  layout
                  className="glass-card overflow-hidden rounded-2xl"
                >
                  <button
                    onClick={() => setOpenPhase(open ? null : i)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-xs font-bold text-primary-foreground shadow-md">
                        {String(i + 1).padStart(2, "0")}
                      </div>
                      <div>
                        <div className="font-display text-base font-semibold">{phase.phase}</div>
                        <div className="text-xs text-muted-foreground">{phase.duration} · {phase.questions.length} questions</div>
                      </div>
                    </div>
                    <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <ul className="space-y-2 px-5 pb-5">
                          {phase.questions.map((q, qi) => (
                            <li key={qi} className="flex gap-3 rounded-xl border border-border bg-card/50 px-4 py-3 text-sm">
                              <span className="font-mono text-xs text-muted-foreground">Q{qi + 1}</span>
                              <span>{q}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </Section>

        {/* Stress moments */}
        <Section title="Pressure moments" icon={<AlertTriangle className="h-4 w-4" style={{ color: "#DDF344" }} />}>
          <div className="grid gap-3 md:grid-cols-2">
            {(item.stress_moments ?? []).map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="glass-card rounded-2xl border-l-[3px] p-5"
                style={{ borderLeftColor: "#DDF344", background: "#DDF34408" }}
              >
                <div className="flex items-center gap-2 text-sm font-semibold">
                  <Flame className="h-4 w-4" style={{ color: "#DDF344" }} /> {m.moment}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{m.detail}</p>
              </motion.div>
            ))}
          </div>
        </Section>

        {isPublicArchive(slug) && !user ? (
          <InlinePrompt
            bold="Practiced answers don't survive this kind of pressure."
            plain="The Interview Lab runs you through exactly this. Adaptive. No scripts. No easy exits."
            cta="Try the Interview Lab"
            to="/signup"
          />
        ) : user ? (
          <InlinePrompt
            bold="Think you could handle this pressure moment?"
            plain="Open it in the Interview Lab. The AI panel won't let you off as easily as you think."
            cta="Practice this panel style"
            to="/lab"
          />
        ) : null}

        {/* Best vs Weak answers */}
        <Section title="What worked vs what didn't" icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}>
          <div className="grid gap-4 md:grid-cols-2">
            <AnswerColumn
              tone="best"
              title="Best answers"
              icon={<CheckCircle2 className="h-4 w-4 text-emerald-500" />}
              items={item.best_answers ?? []}
            />
            <AnswerColumn
              tone="weak"
              title="Weak answers"
              icon={<XCircle className="h-4 w-4 text-destructive" />}
              items={item.weak_answers ?? []}
            />
          </div>
        </Section>

        {/* Lessons */}
        <Section title="Lessons learned" icon={<Lightbulb className="h-4 w-4 text-primary" />}>
          <ol className="space-y-3">
            {(item.lessons_learned ?? []).map((l, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="glass-card flex gap-4 rounded-2xl p-4"
              >
                <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-xl bg-primary/10 text-xs font-bold text-primary">
                  {i + 1}
                </span>
                <span className="text-sm">{l}</span>
              </motion.li>
            ))}
          </ol>
        </Section>

        {isPublicArchive(slug) && !user && (
          <div className="mt-14 grid gap-6 rounded-[20px] p-8 text-white md:grid-cols-[1.2fr_1fr] md:items-center" style={{ background: "#4849F8" }}>
            <div>
              <h3 className="font-display text-2xl font-extrabold">There are 47 more of these.</h3>
              <p className="mt-2 text-[0.9rem] opacity-90">Plus the tools to prepare for yours specifically.</p>
            </div>
            <div className="flex flex-col gap-2 md:items-end">
              <Link to="/signup" className="rounded-full bg-white px-5 py-2.5 text-[0.85rem] font-bold" style={{ color: "#4849F8" }}>Join now — ₹299</Link>
              <Link to="/signup" className="rounded-full border border-white px-5 py-2.5 text-[0.85rem] font-bold text-white">Start free — no card needed</Link>
            </div>
          </div>
        )}

        <div className="mt-12 mb-16 flex flex-wrap items-center justify-between gap-4 rounded-3xl bg-gradient-to-br from-primary/10 via-card to-card p-8">
          <div>
            <h3 className="font-display text-xl font-semibold">Practice this exact panel style</h3>
            <p className="mt-1 text-sm text-muted-foreground">Run the AI evaluator on your own answer to one of these questions.</p>
          </div>
          <Link
            to="/evaluator"
            className="rounded-full bg-foreground px-5 py-2.5 text-sm font-semibold text-background shadow-md transition-all hover:scale-[1.03]"
          >
            Open AI Evaluator →
          </Link>
        </div>
      </article>
      <Footer />
    </main>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <div className="mb-4 flex items-center gap-2">
        {icon}
        <h2 className="font-display text-lg font-semibold uppercase tracking-wide text-muted-foreground">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function InlinePrompt({ bold, plain, cta, to }: { bold: string; plain: string; cta: string; to: string }) {
  const isHash = to.startsWith("/#");
  return (
    <div className="mt-8 flex flex-wrap items-center gap-4 rounded-[14px] p-5" style={{ background: "#4849F808", borderLeft: "4px solid #DDF344" }}>
      <IllTarget size={28} stroke="#4849F8" />
      <div className="min-w-0 flex-1">
        <div className="font-display text-[0.95rem] font-bold">{bold}</div>
        <div className="mt-1 text-[0.82rem] text-muted-foreground">{plain}</div>
      </div>
      {isHash ? (
        <a href={to} className="rounded-full px-5 py-2 text-[0.82rem] font-bold text-white" style={{ background: "#4849F8" }}>{cta}</a>
      ) : (
        <Link to={to} className="rounded-full px-5 py-2 text-[0.82rem] font-bold text-white" style={{ background: "#4849F8" }}>{cta}</Link>
      )}
    </div>
  );
}

function InfoCard({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="glass-card rounded-2xl p-5">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {icon} {title}
      </div>
      <p className="mt-2 text-sm">{body}</p>
    </div>
  );
}

function AnswerColumn({
  tone, title, icon, items,
}: { tone: "best" | "weak"; title: string; icon: React.ReactNode; items: QA[] }) {
  const borderColor = tone === "best" ? "var(--success)" : "var(--destructive)";
  return (
    <div className="glass-card rounded-2xl border-l-4 p-5" style={{ borderLeftColor: borderColor }}>
      <div className="flex items-center gap-2 text-sm font-semibold">{icon} {title}</div>
      <div className="mt-4 space-y-4">
        {items.map((qa, i) => (
          <div key={i}>
            <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground">{qa.q}</div>
            <p className="mt-1 text-sm leading-relaxed">{qa.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}