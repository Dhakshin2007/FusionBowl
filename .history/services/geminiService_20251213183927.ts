import { GoogleGenAI } from "@google/genai";
import { Ingredient } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize safely - if no key is present, we handle it in the function call
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const analyzeBowlNutrition = async (ingredients: Ingredient[]): Promise<string> => {
  if (!ai) {
    console.warn("Gemini API Key is missing.");
    return "AI Analysis unavailable in demo mode. Please add a valid API_KEY.";
  }

  const ingredientList = ingredients.map(i => i.name).join(', ');
  const prompt = `
    I have a fruit bowl with the following ingredients: ${ingredientList}.
    
    Please provide a short, punchy, and exciting nutrition summary (max 3 sentences). 
    Focus on the specific health benefits of this combination (e.g., energy, immunity, skin health). 
    Do not list calories or macros unless they are exceptional. 
    Tone: Energetic, Premium, Health-Conscious.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    
    return response.text || "Enjoy your fresh and healthy Fusion Bowl!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Our chef says: This is a delicious combination packed with natural goodness!";
  }
};