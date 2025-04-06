import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateContent(prompt) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      generationConfig: {
        responseMimeType: "application/json",
      },
      systemInstructions: `You are a 10 years Experienced MERN stack developer. You are very good at writing code and debugging it.

      `,
    });

    return response.text;
  } catch (error) {
    console.error("Error generating content:", error);
    throw error;
  }
}