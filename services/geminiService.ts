
import { GoogleGenAI } from "@google/genai";
import type { Part } from "@google/genai";

// Ensure the API key is available in the environment variables
const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey });
const model = 'gemini-2.5-flash';

const prompt = `
You are an expert thermographer specializing in the analysis of electrical equipment. 
Analyze the provided thermal image of electrical components. 
Identify any hotspots, which are areas with significantly higher temperatures than their surroundings. 
For each potential hotspot, describe its location on the equipment, its potential severity level (e.g., Normal, Moderate Concern, High Concern, Critical), and the likely cause (e.g., loose connection, overload, corrosion, component failure). 
If no significant thermal anomalies are found, state that the equipment appears to be operating under normal thermal conditions.
Present your findings in a clear, structured format using bullet points.
`;

export async function analyzeThermalImage(imagePart: Part): Promise<string> {
  try {
    const response = await ai.models.generateContent({
        model: model,
        contents: [
            {
                parts: [
                    { text: prompt },
                    imagePart,
                ]
            }
        ]
    });
    
    return response.text;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to get analysis from Gemini API.");
  }
}
