import { GoogleGenerativeAI } from "@google/generative-ai"
import * as dotenv from "dotenv"
dotenv.config()

const GEMINI_API_KEY = process.env.GEMINI_API_KEY
if (!GEMINI_API_KEY) {
   throw new Error('Gemini api key not provided.')
}

export const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!)

export async function getEmbeddingsFromGemini(text: string): Promise<number[]> {
   try {
      if (!text.trim()) { throw new Error('Input cannot be empty') }

      const model = genAI.getGenerativeModel({ model: 'embedding-001' })
      const result = await model.embedContent({
         content: {
            role: "user",
            parts: [{ text }]
         },
      });
      if (!result.embedding?.values) {
         throw new Error("No embedding values returned from Gemini API");
      }
      return result.embedding.values
   } catch (err) {
      console.log('Error is: ' + err)
      throw new Error('Failed to get embeddings')
   }
}

// getEmbeddingsFromGemini("hows the weather today?").then(embeddings => {
//   console.log(embeddings); 
// }).catch(console.error);
