
import { GoogleGenAI } from "@google/genai";

export const getFlowerFunFact = async (flowerName: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Give me one interesting, short, and surprising fun fact about ${flowerName} flowers. Keep it under 20 words.`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 50,
      }
    });
    return response.text || "Every flower has a secret story!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Flowers have been used for communication for centuries!";
  }
};
