import { createFileRoute } from "@tanstack/react-router";
import "@tanstack/react-start";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

type Body = {
  question: string;
  answer: string;
  category?: string;
};

export const Route = createFileRoute("/api/evaluate")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) {
          return new Response("Missing LOVABLE_API_KEY", { status: 500 });
        }

        let body: Body;
        try {
          body = (await request.json()) as Body;
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }
        if (!body?.question || !body?.answer) {
          return new Response("question and answer required", { status: 400 });
        }

        const system = `You are a senior IIM admissions panelist. Evaluate a candidate's open-ended interview answer with the rigor of a real personal-interview panel.

Return ONLY valid JSON matching this exact schema:
{
  "scores": {
    "confidence": number (0-10),
    "communication": number (0-10),
    "clarity": number (0-10),
    "originality": number (0-10),
    "logical_consistency": number (0-10),
    "overall": number (0-10)
  },
  "evaluation": string (2-3 sentences of premium panelist feedback, specific and incisive),
  "strengths": string[] (2-3 punchy items),
  "weaknesses": string[] (2-3 punchy items),
  "follow_up_questions": string[] (3 adaptive follow-ups a real panel would drill into next)
}

Tone: a top IIM professor. Sharp, direct, never generic. Avoid platitudes like "good attempt".`;

        const user = `QUESTION: ${body.question}
CATEGORY: ${body.category ?? "general"}
CANDIDATE ANSWER: ${body.answer}`;

        const res = await fetch(GATEWAY_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              { role: "system", content: system },
              { role: "user", content: user },
            ],
            response_format: { type: "json_object" },
          }),
        });

        if (res.status === 429) {
          return Response.json(
            { error: "Rate limit reached. Try again in a moment." },
            { status: 429 },
          );
        }
        if (res.status === 402) {
          return Response.json(
            { error: "AI credits exhausted. Add credits in workspace settings." },
            { status: 402 },
          );
        }
        if (!res.ok) {
          const t = await res.text();
          return new Response(`Gateway error: ${t}`, { status: 500 });
        }

        const data = await res.json();
        const content: string = data?.choices?.[0]?.message?.content ?? "{}";
        let parsed: unknown;
        try {
          parsed = JSON.parse(content);
        } catch {
          return Response.json({ error: "Invalid AI response", raw: content }, { status: 500 });
        }
        return Response.json(parsed);
      },
    },
  },
});