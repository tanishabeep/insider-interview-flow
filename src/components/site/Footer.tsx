import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="border-t border-border bg-surface py-14">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="font-display text-base font-semibold">IPM Ace Prep</div>
            <p className="mt-1 max-w-md text-xs text-muted-foreground">
              An interview intelligence platform for IPMAT &amp; IIM aspirants — built from inside the panel room.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-7 gap-y-2 text-xs font-medium text-muted-foreground">
            <Link to="/" hash="practice" className="hover:text-foreground">Practice</Link>
            <Link to="/" hash="current-affairs" className="hover:text-foreground">Current Affairs</Link>
            <Link to="/" hash="pricing" className="hover:text-foreground">Pricing</Link>
            <Link to="/login" className="hover:text-foreground">Sign in</Link>
          </div>
        </div>
        <div className="hairline mt-10" />
        <div className="mt-5 text-[11px] text-muted-foreground">© {new Date().getFullYear()} IPM Ace Prep. All rights reserved.</div>
      </div>
    </footer>
  );
}
