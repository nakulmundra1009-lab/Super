
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

  // Instantiate client here to ensure the latest API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: AIVENO_PERSONA_INSTRUCTION,
      temperature: 0.7,
      topP: 0.9,
    },
    history: [],
  });

  return chat;
};

const generateImage = async (prompt: string): Promise<string | null> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
  }

  // Instantiate client here to ensure the latest API key is used
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        },
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData) {
        const base64EncodeString: string = part.inlineData.data;
        return `data:image/png;base64,${base64EncodeString}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image generation failed:", error);
    return null;
  }
};


export { getChatSession, generateImage };
