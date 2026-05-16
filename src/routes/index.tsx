import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Library } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Hero } from "@/components/site/Hero";
import { SocialProof } from "@/components/site/SocialProof";
import { BuiltBy } from "@/components/site/BuiltBy";
import { FeatureRows } from "@/components/site/FeatureRows";
import { Pricing } from "@/components/site/Pricing";
import { Footer } from "@/components/site/Footer";
import { VulnerabilityScan } from "@/components/site/VulnerabilityScan";
import { FearSection } from "@/components/site/FearSection";
import { SuccessStories } from "@/components/site/SuccessStories";
import { EmailCaptureSection } from "@/components/site/EmailCapture";
import { ExitIntent } from "@/components/site/ExitIntent";
import { WhatsAppFloating } from "@/components/site/WhatsAppButton";
import { supabase } from "@/integrations/supabase/client";
import { PUBLIC_ARCHIVE_SLUG } from "@/lib/public-archive";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <SocialProof />
      <FearSection />
      <FeatureRows />
      <VulnerabilityScan />
      <BuiltBy />
      <SuccessStories />
      <ArchiveTeaser />
      <EmailCaptureSection />
      <Pricing />
      <Footer />
      <ExitIntent />
      <WhatsAppFloating />
    </main>
  );
}

type TeaserItem = {
  id: string;
  slug: string;
  title: string;
  panel_type: string | null;
  difficulty: string | null;
  duration_minutes: number | null;
  grilling_themes: string[] | null;
};

function ArchiveTeaser() {
  const [items, setItems] = useState<TeaserItem[]>([]);
  useEffect(() => {
    supabase
      .from("real_interview_archive")
      .select("id, slug, title, panel_type, difficulty, duration_minutes, grilling_themes")
      .order("created_at", { ascending: false })
      .limit(3)
      .then(({ data }) => setItems((data ?? []) as TeaserItem[]));
  }, []);

  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Library className="h-3.5 w-3.5" /> Real interview archive
          </div>
          <h2 className="mt-5 font-display text-4xl font-semibold leading-tight md:text-5xl">
            Read what panels <span className="gradient-text">actually asked</span>.
          </h2>
          <p className="mt-5 text-base text-muted-foreground">
            Reconstructed question by question. Strongest answers, weakest moments, and the follow-up chains that broke candidates.
          </p>
        </motion.div>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {items.map((it, i) => (
            <motion.div
              key={it.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.08, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              whileHover={{ y: -5 }}
            >
              <Link to="/archive/$slug" params={{ slug: it.slug }} className="glass-card group block h-full rounded-3xl p-7">
                <div className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
                  {it.panel_type ?? "IIM panel"} · {it.difficulty ?? "—"}
                  {it.slug === PUBLIC_ARCHIVE_SLUG && (
                    <span className="ml-2 rounded-full px-2 py-0.5 text-[9px] font-bold" style={{ background: "#DDF34430", color: "#0D0D1A" }}>
                      FREE READ
                    </span>
                  )}
                </div>
                <h3 className="mt-3 font-display text-lg font-semibold leading-tight">{it.title}</h3>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {(it.grilling_themes ?? []).slice(0, 3).map((t) => (
                    <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{t}</span>
                  ))}
                </div>
                <div className="mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-transform group-hover:translate-x-1">
                  Open reconstruction <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link to="/archive" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-5 py-2.5 text-xs font-semibold transition-colors hover:bg-muted">
            Browse the full archive <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
