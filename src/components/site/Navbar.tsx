import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/lib/auth";

export function Navbar() {
  const { user } = useAuth();
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="sticky top-0 z-50 w-full"
    >
      <div className="mx-auto mt-4 flex max-w-6xl items-center justify-between px-6">
        <div className="glass-panel flex w-full items-center justify-between rounded-full px-5 py-2.5">
          <Link to="/" className="flex items-center gap-2 font-display text-base font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-md">
              <Sparkles className="h-4 w-4" />
            </span>
            <span>IPM Ace</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
            <Link to="/" hash="practice" className="transition-colors hover:text-foreground">Practice</Link>
            <Link to="/" hash="current-affairs" className="transition-colors hover:text-foreground">Current Affairs</Link>
            <Link to="/" hash="built-by" className="transition-colors hover:text-foreground">Built by</Link>
            <Link to="/" hash="pricing" className="transition-colors hover:text-foreground">Pricing</Link>
          </nav>
          <div className="flex items-center gap-2">
            {user ? (
              <Link to="/dashboard" className="rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background transition-transform hover:scale-[1.03]">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="hidden rounded-full px-4 py-2 text-xs font-semibold text-foreground/80 transition-colors hover:text-foreground sm:inline-block">
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="rounded-full bg-foreground px-4 py-2 text-xs font-semibold text-background shadow-md transition-all hover:scale-[1.03] hover:shadow-lg"
                >
                  Join now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
