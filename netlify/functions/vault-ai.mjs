const SYSTEM_INSTRUCTIONS = `You are Vault AI, the technology assistant inside IT Vault. Help with Android phones, Windows, apps, networking, troubleshooting, coding basics, digital skills, and cybersecurity. Give clear numbered steps when useful. Never ask for passwords, verification codes, payment details, or API keys. Warn users before destructive actions. Keep answers practical and concise.`;

export default async (request) => {
  const headers = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
  };

  const reply = (status, data) =>
    new Response(JSON.stringify(data), { status, headers });

  if (request.method !== "POST") {
    return reply(405, { error: "Please send a question using POST." });
  }

  const apiKey = Netlify.env.get("OPENAI_API_KEY");

  if (!apiKey) {
    return reply(503, {
      error: "Vault AI is not configured. Check the API key environment variable in Netlify."
    });
  }

  let body;

  try {
    body = await request.json();
  } catch {
    return reply(400, { error: "Invalid request." });
  }

  const messages = Array.isArray(body.messages)
    ? body.messages.slice(-10)
    : [];

  const safeMessages = messages
    .filter(m =>
      m &&
      ["user", "assistant"].includes(m.role) &&
      typeof m.content === "string"
    )
    .map(m => ({
      role: m.role,
      content: m.content.trim().slice(0, 2000)
    }))
    .filter(m => m.content);

  if (
    !safeMessages.length ||
    safeMessages[safeMessages.length - 1].role !== "user"
  ) {
    return reply(400, { error: "Please type a question." });
  }

  try {
    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "gpt-4.1-mini",
          instructions: SYSTEM_INSTRUCTIONS,
          input: safeMessages.map(m => ({
            role: m.role,
            content: [
              { type: "input_text", text: m.content }
            ]
          })),
          max_output_tokens: 700,
          store: false
        })
      }
    );

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("OpenAI request failed:", response.status);

      if (response.status === 401) {
        return reply(502, {
          error: "The API key was rejected. Check the key stored in Netlify."
        });
      }

      if (response.status === 429) {
        return reply(502, {
          error: "The AI service is rate-limited or API credits may be unavailable. Check your API usage and billing."
        });
      }

      return reply(502, {
        error: "The AI service could not complete the request."
      });
    }

    const answer = (data.output || [])
      .flatMap(item => item.content || [])
      .filter(item => item.type === "output_text")
      .map(item => item.text)
      .join("\n")
      .trim();

    if (!answer) {
      return reply(502, { error: "Vault AI returned an empty answer." });
    }

    return reply(200, { answer });

  } catch (error) {
    console.error("Vault AI error:", error.message || "unknown");

    return reply(502, {
      error: "Could not connect to the AI service. Please try again."
    });
  }
};
