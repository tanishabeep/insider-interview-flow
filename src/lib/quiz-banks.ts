/**
 * Per-category curated question banks for the IPM Ace quiz engine.
 * Each category has its OWN questions, themes, and adaptive follow-ups.
 * Inspired by real IIM personal-interview pressure patterns.
 */

export type QuizQuestion = {
  prompt: string;
  options: string[];
  correct: number;
  followUp: string;
  difficulty?: "easy" | "medium" | "hard";
};

export type QuizCategory =
  | "geopolitics"
  | "economics"
  | "policy"
  | "business"
  | "international"
  | "ethics"
  | "opinion"
  | "stress"
  | "profile"
  | "current";

export const CATEGORY_META: Record<QuizCategory, { label: string; tag: string; tone: string; blurb: string }> = {
  geopolitics:   { label: "Geopolitics",          tag: "Geopolitics",          tone: "from-primary to-primary-glow",      blurb: "World power shifts, alliances, conflicts." },
  economics:     { label: "Economics",            tag: "Economic policy",      tone: "from-chart-3 to-primary",            blurb: "Macro, RBI, inflation, fiscal stance." },
  policy:        { label: "Indian Policy",        tag: "Policy",               tone: "from-accent to-primary-glow",        blurb: "Domestic reform, governance, regulation." },
  business:      { label: "Business",             tag: "Business",             tone: "from-warning to-accent",             blurb: "Strategy, markets, corporate moves." },
  international: { label: "International Affairs",tag: "International",        tone: "from-chart-3 to-accent",             blurb: "UN, trade pacts, diplomacy." },
  ethics:        { label: "Ethics & Maturity",    tag: "Ethics",               tone: "from-primary to-chart-5",            blurb: "Moral dilemmas, judgement, values." },
  opinion:       { label: "Opinion Drills",       tag: "Opinion",              tone: "from-chart-5 to-primary-glow",       blurb: "Take and defend a real position." },
  stress:        { label: "Stress Interview",     tag: "Stress",               tone: "from-destructive/70 to-warning",     blurb: "Pressure, contradictions, traps." },
  profile:       { label: "Profile Grilling",    tag: "Profile",              tone: "from-accent to-warning",             blurb: "Your background, picked apart." },
  current:       { label: "Current Affairs Sprint",tag: "Current Affairs",   tone: "from-primary-glow to-chart-3",       blurb: "What broke this fortnight." },
};

const opinionOpts = ["Strongly agree — defend it", "Agree with caveats", "Disagree — defend it", "Disagree strongly"];

export const QUIZ_BANKS: Record<QuizCategory, QuizQuestion[]> = {
  geopolitics: [
    { prompt: "India's recent abstention pattern at the UN on the Russia–Ukraine war is best explained by:",
      options: ["S-400 dependency and energy realism", "Pure pacifist tradition", "BRICS solidarity only", "Domestic Hindu-vote calculus"],
      correct: 0, followUp: "Now argue why this 'strategic autonomy' is actually a moral failure. 30 seconds." },
    { prompt: "The Quad's biggest credibility weakness in 2026 is:",
      options: ["Lack of a binding security clause", "Too much US dominance", "China not feeling threatened", "ASEAN opposition"],
      correct: 0, followUp: "If you were India's NSA, what one bargain would you push to fix it?" },
    { prompt: "India–Bangladesh relations after the 2024 political shift are most strained over:",
      options: ["River-water sharing", "Minority safety", "Border-fencing pace", "Power-export pricing"],
      correct: 1, followUp: "Should India publicly criticise Dhaka? Defend either side." },
    { prompt: "China's Belt & Road has lost steam primarily because of:",
      options: ["Debt-trap exposure", "Western sanctions", "Lack of manpower", "Religious resistance"],
      correct: 0, followUp: "Name one African country that pivoted away — and why." },
    { prompt: "India's Indo-Pacific doctrine differs from the US version mainly in:",
      options: ["Inclusivity of China", "Naval aggression", "Climate stance", "Tariff regime"],
      correct: 0, followUp: "Is including China in your 'free Indo-Pacific' a contradiction? Argue." },
  ],
  economics: [
    { prompt: "If RBI hikes the repo rate today, the FIRST sector to feel margin pressure is:",
      options: ["Large IT exporters", "MSME working-capital borrowers", "PSU banks", "Sovereign-bond holders"],
      correct: 1, followUp: "As Governor, would you hike, hold or cut today? Defend in 30s." },
    { prompt: "India's record GST collection in FY26 is least explained by:",
      options: ["Formalisation of MSMEs", "Better compliance tech", "Genuine consumption boom", "Higher e-invoicing thresholds"],
      correct: 2, followUp: "If consumption isn't booming, why are equity markets at all-time highs?" },
    { prompt: "The biggest structural risk to India's 7%+ growth narrative is:",
      options: ["Oil prices", "Female labour-force participation", "Rupee volatility", "Crypto regulation"],
      correct: 1, followUp: "Why is FLFP a macro number, not a social one? Make the linkage." },
    { prompt: "Sovereign-bond inclusion in JP Morgan's index primarily helps via:",
      options: ["Cheaper sovereign borrowing", "Stronger rupee permanently", "Higher tax revenue", "Lower inflation"],
      correct: 0, followUp: "What's the hidden risk of foreign-flow dependency on bonds?" },
    { prompt: "India's productivity gap with China is widest in:",
      options: ["Services exports", "Manufacturing scale", "Agricultural yields", "IT services"],
      correct: 1, followUp: "PLI schemes — net positive or expensive subsidy? Defend." },
  ],
  policy: [
    { prompt: "'One Nation, One Election' primarily seeks to reform:",
      options: ["Voter ID system", "Synchronisation of Lok Sabha and state polls", "Electoral bonds", "Anti-defection law"],
      correct: 1, followUp: "State the federalism objection in one sharp sentence." },
    { prompt: "The Uniform Civil Code debate is constitutionally rooted in:",
      options: ["Article 14", "Article 44 (Directive Principles)", "Article 370", "Schedule 9"],
      correct: 1, followUp: "If DPSPs aren't enforceable, why is UCC even debated as 'mandatory'?" },
    { prompt: "The Women's Reservation Act takes effect after:",
      options: ["Immediate implementation", "Delimitation following the next census", "2029 polls automatically", "Supreme Court clearance"],
      correct: 1, followUp: "Is delaying reservation till 2029+ symbolic politics? Argue both sides." },
    { prompt: "The new criminal codes (BNS, BNSS, BSA) most controversial change is:",
      options: ["Death penalty expansion", "Police-custody extension up to 90 days", "Lower court fees", "Faster cybercrime trials"],
      correct: 1, followUp: "Why might this chill press freedom?" },
    { prompt: "DBT (direct benefit transfer) has reduced leakage most in:",
      options: ["MGNREGA wages", "PDS food grains", "LPG subsidy", "Fertilizer subsidy"],
      correct: 2, followUp: "Why is fertilizer DBT politically harder than LPG?" },
  ],
  business: [
    { prompt: "The biggest strategic blunder in Byju's collapse was:",
      options: ["Aggressive M&A funded by debt", "Online-only model", "Hiring too many tutors", "Cricket sponsorship"],
      correct: 0, followUp: "What did Byju's get RIGHT that founders should still copy?" },
    { prompt: "Reliance Jio's '2026 IPO' is most likely priced on:",
      options: ["ARPU expansion", "Subscriber count alone", "AI-cloud monetisation potential", "Fibre footprint"],
      correct: 2, followUp: "Will Jio's AI bet beat Microsoft+OpenAI in India? Take a side." },
    { prompt: "Tata vs Adani in green hydrogen — Tata's edge is:",
      options: ["Capex muscle", "Captive demand from group companies", "Foreign tech tie-ups", "Government goodwill"],
      correct: 1, followUp: "Is captive-demand a moat, or a crutch? Argue." },
    { prompt: "Zomato profitability turn was driven primarily by:",
      options: ["Blinkit unit economics", "Higher restaurant take-rate", "Ad-revenue from listings", "Lower discounting on food"],
      correct: 3, followUp: "Why did Swiggy's IPO valuation lag Zomato's market cap?" },
    { prompt: "The 'India SaaS' story's biggest threat is:",
      options: ["US recession", "Generative AI flattening the moat", "Rupee strength", "GDPR-style regulation"],
      correct: 1, followUp: "Name one Indian SaaS firm with a real AI-defensible moat." },
  ],
  international: [
    { prompt: "WTO dispute settlement is paralysed mainly because:",
      options: ["China blocks judges", "US blocks Appellate Body appointments", "EU vetoes panels", "India refuses to participate"],
      correct: 1, followUp: "Without WTO appeals, how should India settle disputes? Two routes." },
    { prompt: "India–EU FTA's biggest sticking point is:",
      options: ["IT visa quotas", "Carbon Border Adjustment Mechanism", "Whisky tariffs", "Investor-state arbitration"],
      correct: 1, followUp: "Should India retaliate against CBAM? Or comply? Pick." },
    { prompt: "The 2026 BRICS expansion's strategic risk for India is:",
      options: ["Loss of veto", "Yuan-isation of trade settlement", "Loss of summit hosting rights", "Reduced UN clout"],
      correct: 1, followUp: "Why hasn't India joined BRICS Pay yet?" },
    { prompt: "Israel–Hamas conflict's economic spillover hit India hardest via:",
      options: ["Diamond exports", "Crude prices", "Tourism", "Defence imports"],
      correct: 0, followUp: "Should India formally recognise a Palestinian state today? Argue." },
    { prompt: "Climate finance pledged at COP vs delivered to developing countries:",
      options: ["Roughly matches", "Delivered exceeds pledge", "Delivered is under 30% of pledge", "Cannot be measured"],
      correct: 2, followUp: "Should India accept loss-and-damage funds with strings? Defend." },
  ],
  ethics: [
    { prompt: "A friend offers you the leaked PI question paper. The MOST mature response is:",
      options: ["Take it — everyone does", "Refuse and stay silent", "Refuse and report it", "Take it and report later"],
      correct: 2, followUp: "Now defend why staying silent is also defensible. 30s." },
    { prompt: "Your team-lead at an internship asks you to inflate metrics in a deck. You should:",
      options: ["Comply quietly", "Comply and document privately", "Refuse and propose honest framing", "Quit immediately"],
      correct: 2, followUp: "What if refusing costs you the PPO? Walk through the trade-off." },
    { prompt: "An IIM panel asks: 'Was Snowden a hero or a traitor?' The MATURE answer:",
      options: ["Pure hero", "Pure traitor", "Take a side and acknowledge the strongest counter", "Refuse to answer"],
      correct: 2, followUp: "Pick a side now — and steelman the other view first." },
    { prompt: "Affirmative action in IIMs is BEST defended on the ground of:",
      options: ["Historical injustice", "Diversity improving learning", "Reducing inequality of outcome", "Constitutional mandate"],
      correct: 1, followUp: "Should it apply at faculty-recruitment level too? Defend." },
    { prompt: "Euthanasia legalisation in India should depend most on:",
      options: ["Religious consensus", "Medical-board safeguards against coercion", "Family request alone", "Insurance-industry view"],
      correct: 1, followUp: "Is 'consent' even meaningful when poor patients face medical bills?" },
  ],
  opinion: [
    { prompt: "Take a stance: 'Reservations should be income-based, not caste-based.'",
      options: opinionOpts, correct: 0, followUp: "Now argue the OPPOSITE side as if it's your real view." },
    { prompt: "Take a stance: 'Indian engineers should not be allowed to migrate freely.'",
      options: opinionOpts, correct: 2, followUp: "If brain-drain is real, why does remittance data look healthy?" },
    { prompt: "Take a stance: 'AI will hurt Indian IT services more than it helps.'",
      options: opinionOpts, correct: 0, followUp: "Name two Indian IT firms making the right AI bet — and why." },
    { prompt: "Take a stance: 'Free electricity to farmers should be scrapped.'",
      options: opinionOpts, correct: 0, followUp: "Which state proves your point? Specifics." },
    { prompt: "Take a stance: 'Cricket has crowded out India's other sporting talent.'",
      options: opinionOpts, correct: 1, followUp: "Why has hockey not recovered despite Olympic medals?" },
  ],
  stress: [
    { prompt: "Panel: 'Your CGPA is mediocre. Why should we believe you'll cope?' Best opener:",
      options: ["Defend the CGPA aggressively", "Acknowledge, reframe with proof of growth", "Blame the grading system", "Pivot to extracurriculars immediately"],
      correct: 1, followUp: "Now — give that exact reframe, in 25 seconds, out loud." },
    { prompt: "Panel: 'You contradicted yourself two minutes ago.' Mature response:",
      options: ["Deny it", "Ask which statement and reconcile honestly", "Apologise profusely", "Change topic"],
      correct: 1, followUp: "Walk us through the reconciliation as if it's happening now." },
    { prompt: "Panel: 'You said you read economics. Name your favourite economist and ONE flaw in their thinking.' The trap is:",
      options: ["Naming a famous one without a flaw", "Naming an obscure one", "Saying 'all of them are flawed'", "Refusing to answer"],
      correct: 0, followUp: "Pick one now and name a real flaw in their argument." },
    { prompt: "Panel goes silent for 20 seconds after your answer. The right move:",
      options: ["Repeat the answer louder", "Add a sharper second-order point", "Apologise", "Ask if they want clarification"],
      correct: 1, followUp: "Show that second-order point — improvise on your last quiz answer." },
    { prompt: "Panel: 'If we reject you today, what will you do?' Best framing:",
      options: ["I'll be devastated", "I have no Plan B — this is it", "I'll continue building, try again, and own the gap honestly", "I'll join my family business"],
      correct: 2, followUp: "What would you actually build in the gap year? Be specific." },
  ],
  profile: [
    { prompt: "You wrote 'I love reading'. Panel asks the LAST book. The trap is:",
      options: ["Naming a book you skimmed", "Naming a heavy book to impress", "Naming a recent finished book and a real takeaway", "Saying 'I read mostly articles'"],
      correct: 2, followUp: "Name your last actually-finished book and a one-line takeaway." },
    { prompt: "You list 'class representative' as leadership. Strongest defence:",
      options: ["I represented 60 students", "Specific incident: I resolved X conflict by Y", "It's on my CV", "Teachers chose me"],
      correct: 1, followUp: "Tell that exact incident — STAR format, 40s." },
    { prompt: "Hobby = chess. Panel: 'What's your ELO?' If you have none:",
      options: ["Lie about an ELO", "Say 'I play casually for thinking practice' — pivot to value", "Refuse", "Change hobby on the spot"],
      correct: 1, followUp: "What's one decision-making lesson chess taught you? Specific." },
    { prompt: "You're an engineer applying to MBA. The MOST honest 'why MBA' uses:",
      options: ["Salary jump", "A specific friction in your work that needed business-thinking", "Family pressure", "I love variety"],
      correct: 1, followUp: "Describe that friction in 30s with a real example." },
    { prompt: "Your SOP says 'I want to start up'. Panel: 'In what?' The trap:",
      options: ["Vague 'tech for good'", "Specific problem + your unique edge", "Fintech, like everyone", "I'll decide post-MBA"],
      correct: 1, followUp: "State the problem, the user, and your edge — in three sentences." },
  ],
  current: [
    { prompt: "The 2026 RBI Monetary Policy stance is best characterised as:",
      options: ["Hawkish hold", "Dovish hold with growth-tilt", "Aggressive cut cycle", "Neutral with FX focus"],
      correct: 1, followUp: "Why is RBI prioritising growth NOW vs 18 months ago?" },
    { prompt: "India's '$5 trillion economy' target is now expected by:",
      options: ["FY27", "FY28", "FY29 at the earliest", "Already missed permanently"],
      correct: 2, followUp: "What ONE policy lever could pull the date forward by a year?" },
    { prompt: "The recent India–US Critical Minerals MoU primarily covers:",
      options: ["Lithium and cobalt sourcing partnerships", "Defence sales", "AI compute", "Pharma supply chains"],
      correct: 0, followUp: "Why does this matter for your EV story? One causal chain." },
    { prompt: "The 2026 Union Budget's most consequential tax change was:",
      options: ["New regime made default permanently", "Capital-gains harmonisation", "Removal of indexation on debt funds", "Higher LTCG rate"],
      correct: 1, followUp: "Did this hurt the middle class or simplify investing? Pick." },
    { prompt: "India's AI Mission allocation is largely tilted toward:",
      options: ["Sovereign LLM training", "Compute infrastructure (GPUs)", "Skilling", "Regulation"],
      correct: 1, followUp: "Is buying GPUs a moat — or just rented dependency? Defend." },
  ],
};

export function getBank(cat: QuizCategory): QuizQuestion[] {
  // Shuffle questions and option order for non-opinion banks
  const base = [...QUIZ_BANKS[cat]];
  for (let i = base.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [base[i], base[j]] = [base[j], base[i]];
  }
  return base;
}