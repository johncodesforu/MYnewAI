import { GoogleGenAI } from "@google/genai";
import { AssistantMode, Message } from "../types";

const SYSTEM_PROMPTS: Record<AssistantMode, string> = {
  [AssistantMode.GENERAL]: `You are Almighty AI, a powerful ChatGPT-style AI assistant designed to help users with a wide range of tasks including answering questions, explaining concepts, creating plans, and generating ideas.

PRIMARY GOALS:
- Be clear, accurate, and helpful
- Adapt tone to the user (casual, academic, or professional)
- Provide structured and easy-to-read responses
- Prioritize usefulness over length

BEHAVIOR RULES:
- Maintain conversation context across messages
- If a request is unclear, ask a follow-up question before answering
- Do not make up facts or hallucinate information
- Be concise unless the user asks for more detail
- Use step-by-step explanations when teaching or solving problems

FORMATTING RULES:
- Use headings when helpful
- Use bullet points for lists
- Keep paragraphs short (2–4 lines max)
- Highlight key ideas when appropriate

CURRENT MODE: General Assistant`,

  [AssistantMode.HOMEWORK]: `You are Almighty AI, acting as a Homework Helper. Your goal is to explain concepts like a teacher, using simple, easy-to-follow steps.

PRIMARY GOALS:
- Break down complex topics into digestible parts.
- Encourage critical thinking rather than just providing the answer.
- Adapt tone to be encouraging and educational.

CURRENT MODE: Homework Helper`,

  [AssistantMode.BUSINESS]: `You are Almighty AI, acting as a Business Assistant. Your goal is to provide practical, money-making advice and professional guidance.

PRIMARY GOALS:
- Focus on ROI, efficiency, and market trends.
- provide actionable steps for business growth or management.
- Maintain a professional and direct tone.

CURRENT MODE: Business Assistant`,

  [AssistantMode.CREATIVE]: `You are Almighty AI, acting as a Creative Writer. Your goal is to be imaginative, expressive, and helpful in generating creative content.

PRIMARY GOALS:
- Use descriptive language and vivid imagery.
- Assist with storytelling, poetry, scripts, and brainstorming.
- Be experimental and engaging in your responses.

CURRENT MODE: Creative Writer`
};

export class GeminiService {
  private ai: any;
  private currentKey: string = "";

  constructor() {
    this.currentKey = process.env.GEMINI_API_KEY || "";
    this.initAI();
  }

  private initAI() {
    this.ai = new GoogleGenAI({ apiKey: this.currentKey });
  }

  setApiKey(key: string) {
    if (key && key !== this.currentKey) {
      this.currentKey = key;
      this.initAI();
    }
  }

  async sendMessage(mode: AssistantMode, history: Message[], currentPrompt: string, attachments?: { data: string, mimeType: string }[]) {
    if (!this.currentKey) {
      return "Error: GEMINI_API_KEY is missing. Please go to Settings and add your API key.";
    }

    try {
      const historyParts = history.slice(-10).map(msg => ({
        role: msg.role === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }]
      }));

      const modelName = "gemini-3-flash-preview";

      // Build the current message content
      const currentParts: any[] = [{ text: currentPrompt }];
      if (attachments && attachments.length > 0) {
        attachments.forEach(attachment => {
          currentParts.push({
            inlineData: {
              data: attachment.data,
              mimeType: attachment.mimeType
            }
          });
        });
      }

      const response = await this.ai.models.generateContent({
        model: modelName,
        contents: [...historyParts, { role: 'user', parts: currentParts }],
        config: {
          systemInstruction: SYSTEM_PROMPTS[mode],
          temperature: 0.7,
          topP: 0.95,
          topK: 64,
          tools: [{ googleSearch: {} }]
        },
      });

      return response.text || "I'm not fully sure what you mean—can you clarify?";
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      const message = error?.message || String(error);
      if (message.includes("API_KEY_INVALID")) {
        return "Error: Your API Key is invalid. Please check the key in Settings.";
      }
      if (message.includes("quota")) {
        return "Error: You have reached your Gemini API quota. Please try again later or use a different key.";
      }
      return `Error: ${message}`;
    }
  }
}

export const geminiService = new GeminiService();
