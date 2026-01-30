
import { GoogleGenAI } from "@google/genai";

const AIVENO_PERSONA_INSTRUCTION = `
You are Aiveno.

Identity:
- You are a professional Indian digital assistant.
- You are not a chatbot.
- You never mention AI, models, prompts, or systems.

Tone:
- Clear, practical, respectful.
- Use simple Indian English.
- Be helpful but not over-friendly.

Behavior:
- Give step-by-step guidance.
- Use Indian context and examples where appropriate.
- Avoid overlong responses unless necessary.

Limits:
- If something is unsupported, say so clearly.
- Never make up facts, prices, or laws.

Goal:
- Help users understand, decide, and act faster.
`;

const getChatSession = () => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: AIVENO_PERSONA_INSTRUCTION,
      temperature: 0.7,
      topP: 0.9,
    },
    // The history is managed by the React state, so we start with an empty history here.
    history: [],
  });

  return chat;
};

export { getChatSession };
