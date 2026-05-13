import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Newspaper,
  Brain,
  UserSearch,
  Sparkles as HubIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useEffect, useState } from "react";
import { sfx } from "@/lib/sounds";

type Item = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  soon?: boolean;
};

const ITEMS: Item[] = [
  { to: "/dashboard", label: "Home", icon: LayoutDashboard },
  { to: "/quiz", label: "Quiz Arena", icon: Newspaper },
  { to: "/lab", label: "Interview Lab", icon: Brain },
  { to: "/grilling", label: "Profile Intelligence", icon: UserSearch },
  { to: "/dashboard", label: "New Features Hub", icon: HubIcon, soon: true },
];

function useStored(key: string, initial: boolean) {
  const [v, setV] = useState<boolean>(() => {
    if (typeof localStorage === "undefined") return initial;
    const s = localStorage.getItem(key);
    return s === null ? initial : s === "1";
  });
  useEffect(() => {
    if (typeof localStorage !== "undefined") localStorage.setItem(key, v ? "1" : "0");
  }, [key, v]);
  return [v, setV] as const;
}

export function DashShell({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useStored("ipm.sidebar.expanded", true);
  const path = useRouterState({ select: (s) => s.location.pathname });

  return (
    <div className="min-h-screen bg-surface">
      {/* Desktop sidebar */}
      <motion.aside
        initial={{ x: -16, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-y-0 left-0 z-30 hidden md:flex flex-col border-r border-border bg-background/85 backdrop-blur-xl transition-[width] duration-300 ${
          expanded ? "w-[220px]" : "w-[64px]"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-border px-3">
          <Link to="/" className="flex items-center gap-2 overflow-hidden">
            <span className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground shadow-md">
              <HubIcon className="h-4 w-4" />
            </span>
            {expanded && <span className="font-display text-sm font-semibold">IPM Ace</span>}
          </Link>
          <button
            onClick={() => { setExpanded(!expanded); sfx.click(); }}
            className="grid h-7 w-7 place-items-center rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground"
            aria-label="Toggle sidebar"
          >
            {expanded ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-2 py-4">
          {ITEMS.map((it) => (
            <NavRow key={it.label} item={it} active={path === it.to && !it.soon} expanded={expanded} />
          ))}
        </nav>
        <div className={`border-t border-border px-3 py-3 ${expanded ? "" : "text-center"}`}>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{expanded ? "Build mode · v1" : "v1"}</div>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className={`transition-[padding] duration-300 ${expanded ? "md:pl-[220px]" : "md:pl-[64px]"} pb-20 md:pb-0`}>
        {children}
      </div>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-border bg-background/95 px-2 py-2 backdrop-blur-xl md:hidden">
        {ITEMS.map((it) => {
          const Icon = it.icon;
          const active = path === it.to && !it.soon;
          return (
            <Link
              key={it.label}
              to={it.to}
              onClick={() => sfx.click()}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl px-1.5 py-1.5 text-[9px] font-medium ${
                active ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />
              <span className="truncate">{it.label.split(" ")[0]}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function NavRow({ item, active, expanded }: { item: Item; active: boolean; expanded: boolean }) {
  const Icon = item.icon;
  const inner = (
    <div
      className={`group relative flex items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-all ${
        active
          ? "bg-gradient-to-r from-primary/15 to-primary/5 text-foreground shadow-[inset_0_0_0_1px_oklch(0.55_0.22_270/0.2)]"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
      title={!expanded ? item.label : undefined}
    >
      {active && (
        <motion.span
          layoutId="dash-nav-active"
          className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-r-full bg-gradient-to-b from-primary to-primary-glow"
        />
      )}
      <Icon className={`h-4 w-4 flex-shrink-0 ${active ? "text-primary" : ""}`} />
      {expanded && (
        <span className="flex flex-1 items-center justify-between truncate">
          {item.label}
          {item.soon && (
            <span className="rounded-full bg-accent/30 px-1.5 py-0.5 text-[9px] font-semibold uppercase text-accent-foreground">
              soon
            </span>
          )}
        </span>
      )}
    </div>
  );
  if (item.soon) {
    return (
      <button onClick={() => sfx.click()} className="block w-full text-left opacity-70" disabled aria-disabled>
        {inner}
      </button>
    );
  }
  return (
    <Link to={item.to} onClick={() => sfx.click()} className="block">
      {inner}
    </Link>
  );
}
