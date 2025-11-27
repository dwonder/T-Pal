
import { GoogleGenAI, Type } from "@google/genai";

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const extractVatFromReceipt = async (base64Image: string, mimeType: string): Promise<number> => {
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    {
                        inlineData: {
                            mimeType,
                            data: base64Image,
                        },
                    },
                    {
                        text: "Analyze this receipt. Extract the VAT (Value Added Tax) amount. Return a JSON object with a single key 'vatAmount' and its numeric value. If no VAT is found, the value should be 0."
                    }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        vatAmount: {
                            type: Type.NUMBER,
                            description: 'The Value Added Tax amount found on the receipt.',
                        },
                    },
                    required: ['vatAmount'],
                },
            },
        });
        
        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        
        return result.vatAmount || 0;

    } catch (error) {
        console.error("Error processing receipt with Gemini API:", error);
        throw new Error("Failed to extract VAT from receipt. Please try again.");
    }
};
