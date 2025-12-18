import { GoogleGenAI } from "@google/genai";
import { Ingredient } from "../types";

/**
 * Analyzes the nutritional benefits of the selected bowl ingredients using Google Gemini AI.
 * Uses the latest gemini-3-flash-preview model for efficient and high-quality analysis.
 */
export const analyzeBowlNutrition = async (ingredients: Ingredient[]): Promise<string> => {
  const ingredientList = ingredients.map(i => i.name).join(', ');
  const prompt = `
    I have a fruit bowl with the following ingredients: ${ingredientList}.
    
    Please provide a short, punchy, and exciting nutrition summary (max 3 sentences). 
    Focus on the specific health benefits of this combination (e.g., energy, immunity, skin health). 
    Do not list calories or macros unless they are exceptional. 
    Tone: Energetic, Premium, Health-Conscious.
  `;

  try {
    // Initialize a new GoogleGenAI instance directly using the pre-configured API key
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Call generateContent with both the model name and prompt parts
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    // Access the generated text using the .text property (not a method)
    return response.text || "Enjoy your fresh and healthy Fusion Bowl!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Our chef says: This is a delicious combination packed with natural goodness!";
  }
};