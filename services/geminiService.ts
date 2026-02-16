
import { GoogleGenAI } from "@google/genai";

// process.env.API_KEY is replaced by Vite during build
const apiKey = process.env.API_KEY || '';

const SYSTEM_INSTRUCTION = `You are AdixoBot, the elite AI concierge for ADIXO TOP UP. 
Your mission is to provide 24/7 technical support and gaming advice for Free Fire, PUBG Mobile, Call of Duty, and Blood Strike.
Always be energetic, professional, and use gaming terminology (e.g., "GG", "clutch", "meta").

CRITICAL INFORMATION FOR USERS:
1. Order history is located in the "ORDER HISTORY" tab.
2. History is now PERSISTENT and tied to the user's EMAIL. 
3. If a user says they "lost" their history, tell them to log in with the EXACT same email they used before.
4. ADIXO offers 100% secure instant delivery via bKash and Binance.
5. All orders take 5 minutes to process.

Keep responses concise and actionable.`;

/**
 * Low-latency response using Gemini 3 Flash for basic support and quick queries
 */
export const getFastAdvice = async (message: string, context?: any) => {
  if (!apiKey) return "Command Center offline: API Key missing.";
  
  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + `\nApp Context: ${JSON.stringify(context || {})}`,
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Fast AI Error:", error);
    return "Link instability detected. Retrying fast-link... Try again, Striker.";
  }
};

/**
 * Deep reasoning response using Gemini 3 Pro for tactical analysis and complex troubleshooting
 */
export const getProAdvice = async (message: string, context?: any) => {
  if (!apiKey) return "Command Center offline: API Key missing.";

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: message,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION + `\nFocus on deep tactical analysis and complex troubleshooting.\nApp Context: ${JSON.stringify(context || {})}`,
        temperature: 0.8,
        thinkingConfig: { thinkingBudget: 32768 },
      },
    });
    return response.text;
  } catch (error) {
    console.error("Pro AI Error:", error);
    return "Deep Neural link failed. Standard protocols only. Try switching to Fast Mode.";
  }
};
