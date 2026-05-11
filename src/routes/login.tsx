import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ArrowLeft, Sparkles } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Welcome back");
    nav({ to: "/dashboard" });
  };

  return (
    <div className="mesh-bg min-h-screen">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back home
        </Link>
        <Link to="/" className="flex items-center gap-2 font-display font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          IPM Ace
        </Link>
      </div>
      <div className="mx-auto grid max-w-md px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="glass-panel rounded-3xl p-8"
        >
          <h1 className="font-display text-3xl font-semibold">Welcome back.</h1>
          <p className="mt-1 text-sm text-muted-foreground">Continue your interview prep.</p>
          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <Field label="Email">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="input" />
            </Field>
            <Field label="Password">
              <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="input" />
            </Field>
            <button disabled={loading} className="cta-primary w-full">
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            New here?{" "}
            <Link to="/signup" className="font-semibold text-foreground underline-offset-4 hover:underline">Create account</Link>
          </p>
        </motion.div>
      </div>
      <style>{`
        .input { width: 100%; padding: 12px 14px; border-radius: 14px; background: var(--card); border: 1px solid var(--border); font-size: 14px; transition: border-color .2s, box-shadow .2s; }
        .input:focus { outline: none; border-color: var(--ring); box-shadow: 0 0 0 4px oklch(0.55 0.2 270 / 0.12); }
        .cta-primary { padding: 12px 16px; border-radius: 9999px; font-weight: 600; font-size: 14px; background: linear-gradient(135deg, var(--primary), var(--primary-glow)); color: var(--primary-foreground); transition: transform .2s, box-shadow .2s; box-shadow: 0 12px 32px -12px oklch(0.55 0.22 270 / 0.5); }
        .cta-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 18px 44px -14px oklch(0.55 0.22 270 / 0.6); }
        .cta-primary:disabled { opacity: .6; }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</div>
      {children}
    </label>
  );
}
