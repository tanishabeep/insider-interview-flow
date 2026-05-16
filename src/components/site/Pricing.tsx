import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Check, Zap, Crown } from "lucide-react";
import { WhatsAppPricingCard } from "@/components/site/WhatsAppButton";

export function Pricing() {
  return (
    <section id="pricing" className="py-28">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            Pricing
          </div>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-tight md:text-5xl">
            Two plans. <span className="gradient-text">Both elite.</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            One sprint to peak before interview day. One protocol to build long-term consistency.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <PriceCard
            tag="30-Day Sprint"
            badge="Only ₹10/day"
            icon={<Zap className="h-4 w-4" />}
            price="299"
            tone="default"
            features={[
              "Unlimited 2-minute current-affairs sprints",
              "Adaptive cross-questioning engine",
              "Profile grilling predictor",
              "Daily readiness analytics",
              "Real interview experience archive",
              "The week before your interview, switch to The Day Before Protocol. Included.",
            ]}
            cta="Start sprint"
            note="If you don't find a question in here that your panel actually asks, we'll refund you."
          />
          <PriceCard
            tag="The Consistency Protocol"
            badge="For serious aspirants"
            icon={<Crown className="h-4 w-4" />}
            price="449"
            tone="featured"
            features={[
              "Everything in 30-Day Sprint",
              "Long-form mock interview simulator",
              "Stress interview patterns library",
              "Streak engine with weekly insights",
              "Personalised opinion drills",
              "Priority feedback on AI evaluations",
              "The system remembers every answer you've ever given. It will catch your contradictions before the panel does.",
            ]}
            cta="Commit to protocol"
            note="Every feature unlocks the moment you sign up. No waiting period, no drip."
          />
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-[0.72rem]" style={{ color: "#ABC4FF" }}>
          <div className="flex items-center gap-2"><LockMini /> Secure payment via Razorpay</div>
          <span className="h-3 w-px" style={{ background: "#ABC4FF60" }} />
          <div className="flex items-center gap-2"><CalMini /> Cancel anytime</div>
          <span className="h-3 w-px" style={{ background: "#ABC4FF60" }} />
          <div className="flex items-center gap-2"><ChatMini /> WhatsApp support available</div>
        </div>

        <WhatsAppPricingCard />
      </div>
    </section>
  );
}

function LockMini() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ABC4FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11 V8 C8 5 10 4 12 4 C14 4 16 5 16 8 V11"/></svg>;
}
function CalMini() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ABC4FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><rect x="4" y="6" width="16" height="14" rx="2"/><path d="M4 10 H20 M9 4 V8 M15 4 V8"/></svg>;
}
function ChatMini() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ABC4FF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 18 L5 14 C 3.5 12 3.5 8 6 6 C 10 3 16 4 18 8 C 20 12 17 17 12 17 C 9 17 7 17 4 18 Z"/></svg>;
}

function PriceCard({
  tag,
  badge,
  icon,
  price,
  features,
  cta,
  tone,
  note,
}: {
  tag: string;
  badge: string;
  icon: React.ReactNode;
  price: string;
  features: string[];
  cta: string;
  tone: "default" | "featured";
  note?: string;
}) {
  const featured = tone === "featured";
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className={`relative overflow-hidden rounded-3xl p-8 transition-shadow ${
        featured
          ? "border border-primary/20 bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-[0_30px_80px_-30px_oklch(0.55_0.22_270/0.55)] hover:shadow-[0_40px_100px_-30px_oklch(0.55_0.22_270/0.7)]"
          : "glass-card"
      }`}
    >
      {featured && (
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/30 blur-3xl" aria-hidden />
      )}
      <div className="relative">
        <motion.div
          initial={{ y: -4, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${
            featured ? "bg-primary-foreground/15 text-primary-foreground" : "bg-accent/20 text-accent-foreground"
          }`}
        >
          {icon} {badge}
        </motion.div>
        <h3 className={`mt-5 font-display text-2xl font-semibold ${featured ? "text-primary-foreground" : ""}`}>{tag}</h3>
        <div className="mt-4 flex items-baseline gap-1">
          <span className={`text-sm ${featured ? "text-primary-foreground/70" : "text-muted-foreground"}`}>₹</span>
          <span className="font-display text-5xl font-semibold tracking-tight">{price}</span>
        </div>
        <ul className="mt-7 space-y-3 text-sm">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-3">
              <Check className={`mt-0.5 h-4 w-4 flex-shrink-0 ${featured ? "text-accent" : "text-primary"}`} />
              <span className={featured ? "text-primary-foreground/90" : "text-foreground/85"}>{f}</span>
            </li>
          ))}
        </ul>
        <Link
          to="/signup"
          className={`mt-8 block rounded-full px-5 py-3 text-center text-sm font-semibold transition-transform hover:scale-[1.02] ${
            featured
              ? "bg-primary-foreground text-primary hover:shadow-lg"
              : "bg-foreground text-background hover:shadow-lg"
          }`}
        >
          {cta}
        </Link>
        {note && (
          <p className={`mt-3 text-center text-[0.72rem] ${featured ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
            {note}
          </p>
        )}
      </div>
    </motion.div>
  );
}
