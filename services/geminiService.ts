import { GoogleGenAI } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeTerraformCode = async (
  code: string, 
  apiKey: string
): Promise<AnalysisResult> => {
  
  if (!apiKey) {
    throw new Error("API Key is required for AI analysis");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const systemPrompt = `
    You are an expert Cloud FinOps and DevOps engineer. 
    Your goal is to analyze Terraform code for AWS, Azure, and Google Cloud (GCP).
    Identify:
    1. Potential cost savings (e.g. over-provisioned instances, older generation families).
    2. Security risks (e.g. open security groups, public access).
    3. Best practices.

    Return the response in strictly valid JSON format matching this schema:
    {
      "suggestions": [
        {
          "resourceName": "string",
          "currentType": "string", 
          "suggestion": "string (short title)",
          "potentialSavings": "string (estimated amount or 'N/A')",
          "reasoning": "string (concise explanation)"
        }
      ]
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Analyze this terraform code:\n\n${code}`,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json"
      }
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    
    return {
      rawText: text,
      suggestions: data.suggestions || []
    };

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze code with Gemini.");
  }
};