// Replace WHATSAPP_NUMBER_PLACEHOLDER with the actual WhatsApp number in
// international format without + or spaces. Example: 919876543210 for an Indian number.
export const WHATSAPP_NUMBER = "WHATSAPP_NUMBER_PLACEHOLDER";

export function buildWhatsAppLink(prefill?: string) {
  const msg = prefill ?? "Hi, I have a question about IPM Ace before joining.";
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export function WhatsAppPricingCard() {
  return (
    <div
      className="mx-auto mt-6 flex max-w-[480px] items-center gap-4 rounded-[16px] p-5"
      style={{ background: "#DDF34415", border: "1.5px solid #DDF34480" }}
    >
      <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="#0D0D1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M6 28 L8 22 C 6 19 6 14 9 11 C 13 7 22 7 26 12 C 29 16 28 22 24 25 C 21 27 16 27 13 25 Z" />
        <circle cx="14" cy="18" r="1" fill="#0D0D1A" />
        <circle cx="18" cy="18" r="1" fill="#0D0D1A" />
        <circle cx="22" cy="18" r="1" fill="#0D0D1A" />
      </svg>
      <div className="flex-1">
        <div className="font-display text-[0.88rem] font-bold">Have a question before joining?</div>
        <div className="text-[0.78rem] text-muted-foreground">WhatsApp us. We reply within a few hours.</div>
      </div>
      <a
        href={buildWhatsAppLink()}
        target="_blank" rel="noopener noreferrer"
        className="rounded-full px-4 py-2 text-[0.78rem] font-bold text-white"
        style={{ background: "#25D366" }}
      >
        WhatsApp us
      </a>
    </div>
  );
}

export function WhatsAppFloating() {
  return (
    <a
      href={buildWhatsAppLink()}
      target="_blank" rel="noopener noreferrer"
      aria-label="WhatsApp us"
      className="fixed right-4 grid h-[52px] w-[52px] place-items-center rounded-full transition-transform hover:scale-[1.08] md:hidden"
      style={{ background: "#25D366", boxShadow: "0 4px 20px #25D36650", zIndex: 90, bottom: "5rem" }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21 L4.5 16 C 3 14 3 10 5 8 C 8 5 14 5 17 8 C 20 11 20 16 17 19 C 14 21 10 21 8 19 Z" />
      </svg>
      <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border-2 border-white" style={{ background: "#DDF344" }} />
    </a>
  );
}
