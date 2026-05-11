import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Layers, Flame, Search } from "lucide-react";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/archive")({
  component: ArchivePage,
});

type ArchiveItem = {
  id: string;
  slug: string;
  title: string;
  panel_type: string | null;
  candidate_background: string | null;
  grilling_themes: string[] | null;
  tags: string[] | null;
  difficulty: string | null;
  duration_minutes: number | null;
};

function ArchivePage() {
  const [items, setItems] = useState<ArchiveItem[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("real_interview_archive")
      .select("id, slug, title, panel_type, candidate_background, grilling_themes, tags, difficulty, duration_minutes")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setItems((data ?? []) as ArchiveItem[]);
        setLoading(false);
      });
  }, []);

  const filtered = items.filter((it) => {
    if (!q.trim()) return true;
    const s = q.toLowerCase();
    return (
      it.title.toLowerCase().includes(s) ||
      (it.tags ?? []).some((t) => t.toLowerCase().includes(s)) ||
      (it.grilling_themes ?? []).some((t) => t.toLowerCase().includes(s))
    );
  });

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="mx-auto max-w-6xl px-6 pt-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Layers className="h-3 w-3" /> Real Interview Archive
          </span>
          <h1 className="mt-4 max-w-3xl font-display text-4xl font-bold tracking-tight md:text-5xl">
            Insider reconstructions of <span className="gradient-text">actual IIM interviews</span>.
          </h1>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            Each case is a full panel walkthrough — flow, stress moments, best & weak answers, and what they were really testing.
          </p>
        </motion.div>

        <div className="glass-panel mt-8 flex items-center gap-3 rounded-2xl px-4 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by IIM, theme, or tag…"
            className="flex-1 bg-transparent py-2 text-sm outline-none placeholder:text-muted-foreground"
          />
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {loading && <div className="text-sm text-muted-foreground">Loading archive…</div>}
          {filtered.map((it, i) => (
            <ArchiveCard key={it.id} item={it} index={i} />
          ))}
          {!loading && filtered.length === 0 && (
            <div className="text-sm text-muted-foreground">No interviews match your search.</div>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}

function ArchiveCard({ item, index }: { item: ArchiveItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      whileHover={{ y: -4 }}
      className="group glass-card relative overflow-hidden rounded-3xl p-6"
    >
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-foreground/5 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {item.difficulty ?? "Case"}
        </span>
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" /> {item.duration_minutes ?? "—"} min
        </span>
      </div>
      <h3 className="mt-4 font-display text-xl font-semibold leading-snug">{item.title}</h3>
      <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{item.candidate_background}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {(item.grilling_themes ?? []).slice(0, 3).map((t) => (
          <span key={t} className="rounded-full border border-border bg-card px-2 py-0.5 text-[11px] text-muted-foreground">
            {t}
          </span>
        ))}
      </div>
      <div className="mt-5 flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
          <Flame className="h-3 w-3 text-primary" /> {item.panel_type}
        </span>
        <Link
          to="/archive/$slug"
          params={{ slug: item.slug }}
          className="inline-flex items-center gap-1 text-sm font-semibold text-foreground transition-transform group-hover:translate-x-0.5"
        >
          Open case <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
}