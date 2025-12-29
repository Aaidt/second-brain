import { Mistral } from "@mistralai/mistralai";
import dotenv from "dotenv"
dotenv.config()

const api_key = process.env.MISTRAL_API_KEY

const client = new Mistral({ apiKey: api_key })

export async function getMistralEmbeddings(text: string): Promise<number[]> {
   if (!text.trim()) {
      throw new Error("No input provided for embedding")
   }
   try {
      const embeddingsBatchResponse = await client.embeddings.create({
         model: "mistral-embed",
         inputs: text
      })

      if (!embeddingsBatchResponse.data?.[0]?.embedding) {
         throw new Error("No response received from mistralai")
      }
      return embeddingsBatchResponse.data?.[0].embedding


   } catch (err) {
      console.log("err is: " + err);
      throw new Error("Error in getting embeddings from mistralai");
   }
}
