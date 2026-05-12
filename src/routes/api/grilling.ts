import { createFileRoute } from "@tanstack/react-router";
import "@tanstack/react-start";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

type Body = {
  stream?: string;
  hobbies?: string;
  achievements?: string;
  internships?: string;
  sop?: string;
  background?: string;
};

export const Route = createFileRoute("/api/grilling")({
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        const apiKey = process.env.LOVABLE_API_KEY;
        if (!apiKey) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        let body: Body;
        try { body = (await request.json()) as Body; }
        catch { return new Response("Invalid JSON", { status: 400 }); }

        const profile = `Stream: ${body.stream || "—"}
Hobbies: ${body.hobbies || "—"}
Achievements: ${body.achievements || "—"}
Internships: ${body.internships || "—"}
Background: ${body.background || "—"}
SOP/Interests: ${body.sop || "—"}`;

        const system = `You are a senior IIM admissions panelist preparing a grilling brief on a candidate.
Return ONLY valid JSON with this schema:
{
  "attack_zones": [{ "title": string, "why": string, "questions": string[] (3-4 specific Qs) }] (4-5 zones),
  "contradiction_traps": string[] (3 sharp traps the panel will set),
  "weak_points": string[] (3 defendable but exposed points),
  "strongest_anchors": string[] (3 talking-points to lean on),
  "expected_followup_chains": [{ "opener": string, "chain": string[] (3 follow-ups deeper) }] (2 chains)
}
Be brutally specific to THIS profile. No generic advice.`;

        const res = await fetch(GATEWAY_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [{ role: "system", content: system }, { role: "user", content: profile }],
            response_format: { type: "json_object" },
          }),
        });

        if (res.status === 429) return Response.json({ error: "Rate limit reached. Try again in a moment." }, { status: 429 });
        if (res.status === 402) return Response.json({ error: "AI credits exhausted." }, { status: 402 });
        if (!res.ok) return new Response(`Gateway error: ${await res.text()}`, { status: 500 });

        const data = await res.json();
        const content: string = data?.choices?.[0]?.message?.content ?? "{}";
        try { return Response.json(JSON.parse(content)); }
        catch { return Response.json({ error: "Invalid AI response", raw: content }, { status: 500 }); }
      },
    },
  },
});