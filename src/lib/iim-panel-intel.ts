export type Pattern = { name: string; description: string; exampleQuestion: string };
export type IimIntel = {
  id: string;
  name: string;
  shortStyle: string;
  panelComposition: string;
  signaturePatterns: Pattern[];
  domainEmphasis: { currentAffairs: number; profileAnalysis: number; generalKnowledge: number; ethics: number; subject: number };
  goodAnswerTraits: string[];
  historicalThemes: string[];
};

export const IIM_INTEL: IimIntel[] = [
  {
    id: "iim-a",
    name: "IIM Ahmedabad",
    shortStyle: "First-principles stress",
    panelComposition: "Typically 3 panelists. One senior faculty (often economics or strategy), one industry veteran, one younger faculty or alumnus. The senior faculty leads and sets the intellectual tone.",
    signaturePatterns: [
      { name: "The first-principles demand", description: "They take your answer and ask you to justify it from scratch, removing all assumptions.", exampleQuestion: "You said India should prioritise manufacturing. Justify that without using the word 'jobs'." },
      { name: "The silence test", description: "After your answer, they say nothing for 4 to 6 seconds. They watch whether you fill the silence nervously or hold it with confidence.", exampleQuestion: "N/A. This is a non-verbal pressure technique." },
      { name: "The 'why not X instead' challenge", description: "They accept your answer and immediately propose an equally plausible alternative. You must defend your original position.", exampleQuestion: "You'd go into consulting. Why not IAS, where the impact is larger and more direct?" },
    ],
    domainEmphasis: { currentAffairs: 60, profileAnalysis: 85, generalKnowledge: 50, ethics: 75, subject: 55 },
    goodAnswerTraits: [
      "Intellectual courage. Take a clear side and defend it.",
      "Original framing. A perspective the panel hasn't heard three times today.",
      "Comfort with uncertainty. 'I'm not sure, but my reasoning is…' is respected.",
    ],
    historicalThemes: ["Philosophy of governance", "India's global positioning", "Entrepreneurship vs institutional career paths", "Economic inequality frameworks", "The ethics of ambition"],
  },
  {
    id: "iim-b",
    name: "IIM Bangalore",
    shortStyle: "Self-awareness pressure",
    panelComposition: "Typically 3 panelists with a mix of strategy, HR, and industry backgrounds. Warmer initial tone that can shift quickly. Often includes a strong HR presence focused on self-awareness.",
    signaturePatterns: [
      { name: "The self-awareness probe", description: "They ask you to identify your own weaknesses with specific examples, then probe whether you've actually addressed them.", exampleQuestion: "What's the one thing about yourself that makes you least suited for an MBA right now?" },
      { name: "The values pressure test", description: "They present a scenario where your stated values conflict with a professional incentive and watch what you choose.", exampleQuestion: "Your manager asks you to present data in a misleading way. You need this project to succeed. What do you do?" },
      { name: "The leadership thinness challenge", description: "For profiles without formal leadership roles, they probe whether informal leadership is genuine or manufactured.", exampleQuestion: "You led this project, but you had no formal authority. Why did people follow you?" },
    ],
    domainEmphasis: { currentAffairs: 70, profileAnalysis: 80, generalKnowledge: 55, ethics: 80, subject: 60 },
    goodAnswerTraits: [
      "Genuine self-awareness. They can tell when it's rehearsed.",
      "Values consistency. Your ethics answers must match your profile choices.",
      "Warmth with substance. This panel rewards relatability alongside intelligence.",
    ],
    historicalThemes: ["Leadership and organisational behaviour", "Sustainability and ESG in Indian business", "Tech industry ethics", "Startup failure analysis", "Work culture and management philosophy"],
  },
  {
    id: "iim-c",
    name: "IIM Calcutta",
    shortStyle: "Quant + logic",
    panelComposition: "Typically 2 to 3 panelists with heavy quantitative and finance background. Known for precision and logical consistency checks. Expect at least one panelist who will probe numbers.",
    signaturePatterns: [
      { name: "The number demand", description: "Any claim you make that could be quantified will be. They ask for the specific figure.", exampleQuestion: "You said India's logistics sector is inefficient. By how much, relative to what benchmark?" },
      { name: "The logic chain test", description: "They follow your reasoning step by step and challenge the weakest link, not the conclusion.", exampleQuestion: "Walk me through that reasoning again, slowly." },
      { name: "The assumption surface", description: "They identify the hidden assumption in your answer and ask you to justify it explicitly.", exampleQuestion: "That argument only works if X is true. Is X true?" },
    ],
    domainEmphasis: { currentAffairs: 65, profileAnalysis: 70, generalKnowledge: 60, ethics: 55, subject: 80 },
    goodAnswerTraits: [
      "Quantitative grounding. Back opinions with numbers.",
      "Structured logic. State your reasoning steps explicitly.",
      "Intellectual precision. 'Approximately 13%' beats 'a lot'.",
    ],
    historicalThemes: ["Financial markets and RBI policy", "India's capital markets development", "Corporate governance", "Startup ecosystem and valuation", "India-China economic comparison"],
  },
  {
    id: "iim-l",
    name: "IIM Lucknow",
    shortStyle: "Current affairs depth",
    panelComposition: "Typically 2 to 3 panelists. Known for current affairs depth and domain knowledge pressure. Strong emphasis on economic and policy awareness. Often includes a faculty member with a public policy background.",
    signaturePatterns: [
      { name: "The opinion demand", description: "They will not accept a balanced 'on one hand, on the other hand' answer. They want your position.", exampleQuestion: "I don't want both sides. Tell me what India should do about its fiscal deficit." },
      { name: "The depth drill", description: "They take one topic from your answer and go three levels deeper until they find the boundary of your knowledge.", exampleQuestion: "You mentioned the PLI scheme. Which sector has had the highest capital investment, and why hasn't it hit its employment target?" },
      { name: "The current context test", description: "They reference a specific recent development and ask you to connect it to a broader framework.", exampleQuestion: "The RBI's latest MPC minutes showed a split vote for the first time in two years. What does that signal?" },
    ],
    domainEmphasis: { currentAffairs: 90, profileAnalysis: 65, generalKnowledge: 70, ethics: 60, subject: 65 },
    goodAnswerTraits: [
      "Opinion confidence. Take a side and defend it.",
      "Current affairs depth. Not awareness. Analysis.",
      "Policy mechanism knowledge. Know how schemes actually work.",
    ],
    historicalThemes: ["Monetary policy and RBI decisions", "Agricultural policy", "India's federal structure and state finance", "Global trade and WTO", "Infrastructure and logistics policy"],
  },
  {
    id: "iim-i",
    name: "IIM Indore",
    shortStyle: "Structured systems",
    panelComposition: "Typically 2 panelists. Known for a structured, systematic questioning style. Panels value logical flow and clear thinking over flashy answers. Often includes a focus on operations and quantitative reasoning.",
    signaturePatterns: [
      { name: "The structure demand", description: "They want your answer in a clear framework before the content. 'First, second, third' responses are rewarded.", exampleQuestion: "Before you answer. How are you going to structure your response?" },
      { name: "The operations lens", description: "They apply an operational thinking test to non-operational topics, checking whether you can think in systems.", exampleQuestion: "You want to improve India's primary education outcomes. Walk me through that as a process improvement problem." },
      { name: "The specificity test", description: "Generic answers are immediately probed for specifics. Any scheme or concept must be explained at mechanism level.", exampleQuestion: "You said ONDC will democratise e-commerce. How does it actually work?" },
    ],
    domainEmphasis: { currentAffairs: 70, profileAnalysis: 75, generalKnowledge: 65, ethics: 60, subject: 70 },
    goodAnswerTraits: [
      "Structured articulation. Framework first, content second.",
      "Operational thinking. Can you break a problem into components?",
      "Specific knowledge. Mechanism-level understanding of anything you mention.",
    ],
    historicalThemes: ["Supply chain and logistics", "Operations management in Indian context", "Manufacturing and PLI", "Digital public infrastructure", "Tier-2 city economy"],
  },
  {
    id: "iim-k",
    name: "IIM Kozhikode",
    shortStyle: "Authenticity probe",
    panelComposition: "Typically 3 panelists with finance, HR, and general management backgrounds. The most probing on personal story and motivation. The panel is interested in authenticity. They have heard every rehearsed answer.",
    signaturePatterns: [
      { name: "The authenticity test", description: "They take your most polished answer and ask you to give the unpolished version.", exampleQuestion: "That was a very clean answer. Tell me what you're leaving out." },
      { name: "The motivation depth probe", description: "They follow your stated motivation backward through your life choices, checking for consistency.", exampleQuestion: "You said you've wanted to be in finance since Class 10. Walk me through every choice since then that reflects that." },
      { name: "The failure demand", description: "They look for evidence of real failure, not 'I worked too hard' failures.", exampleQuestion: "Tell me about something you genuinely failed at, where the outcome was bad and at least partly your fault." },
    ],
    domainEmphasis: { currentAffairs: 65, profileAnalysis: 90, generalKnowledge: 50, ethics: 70, subject: 65 },
    goodAnswerTraits: [
      "Authenticity over polish. The panel rewards genuine over rehearsed.",
      "Motivational consistency. Your life choices must support your stated motivations.",
      "Comfort with vulnerability. Admitting real failure is rewarded here.",
    ],
    historicalThemes: ["Personal leadership journey", "Finance and capital markets", "Kerala's economic model", "Entrepreneurship in emerging markets", "Ethics in financial services"],
  },
];