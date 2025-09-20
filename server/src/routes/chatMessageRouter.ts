import { Router, Request, Response } from "express"
// import { getEmbeddingsFromGemini } from '../utils/src/client'
import { getMistralEmbeddings } from "../utils/src/mistral_client"
import { qdrantClient } from '../utils/src/qdrant'
import { genAI } from "../utils/src/client"
import { prismaClient } from "../db/prisma/client"
import { z } from "zod"
import { ChatMessageSchema, validateChatMessage } from "../utils/src/types"

const chatMessageRouter: Router = Router()

type chatMessageInput = z.infer<typeof ChatMessageSchema>

chatMessageRouter.post("/query", async function (req: Request, res: Response) {
   const { query } = req.body;
   const userId = req.userId

   if (!query || typeof query !== "string" || !query.trim()) {
      res.status(403).json({ message: "Query must be a non-empty string" })
      return
   }
   if (!userId) {
      res.status(401).json({ message: "User is not authenticated." })
      return
   }

   try {
      const queryEmbedding = await getMistralEmbeddings(query)
      if (!queryEmbedding) {
         res.status(500).json({ message: "Failed to generate query embedding" });
         return
      }

      const result = await qdrantClient.search("second-brain", {
         vector: queryEmbedding,
         limit: 5,
         filter: {
            must: [
               { key: "userId", match: { value: userId } }
            ]
         }
      })

      // console.log(result.score);

      const results = result.map(r => r.payload)
      res.status(200).json({ results })

   } catch (err) {
      res.status(404).json({ message: "Server error. Error saving thoughts" })
      console.error("Error is: " + err)
   }
});

chatMessageRouter.post("/chat-query", async function (req: Request, res: Response) {
   const { query } = req.body
   if (!query || typeof query !== "string" || !query.trim()) {
      res.status(403).json({ message: "Query must be a non-empty string" })
      return
   }

   const userId = req.userId
   if (!userId) {
      res.status(401).json({ message: "User is not authenticated." })
      return
   }

   try {
      const queryEmbedding = await getMistralEmbeddings(query);

      const result = await qdrantClient.search('second-brain', {
         vector: queryEmbedding,
         limit: 5,
         filter: {
            must: [{ key: "userId", match: { value: userId } }]
         }
      });

      const retrievedTexts = result.map(r => `${r.payload?.title ?? ""}: ${r.payload?.thoughts ?? ""}`).join("\n");
      if (!retrievedTexts) { res.status(404).json({ message: 'No thoughts provided to reference an answer from.' }) }

      const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
      const prompt = `You are a helpful assistant. The user has saved some personal notes. Use the following thoughts
        to answer their question.
        Thoughts: ${retrievedTexts}
        User question: ${query}
        Answer in a precise and clear way and refer the thoughts above only when the queries are relevant to it.
        If the queries are not relevant, answer on your own.
        `.trim();

      const response = await model.generateContent(prompt)
      const text = response.response.text()

      res.status(200).json({
         answers: text,
         references: result.map(r => r.payload),
         title: query.length > 30 ? query.slice(0, 30) + "..." : query
      })

   } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error generating answer", error: err });
   }
})

chatMessageRouter.post("/send/:sessionId", validateChatMessage, async function (req: Request<{ sessionId: string }, {}, chatMessageInput>, res: Response) {
   const { sender, content } = req.body
   const sessionId = req.params.sessionId

   try {
      await prismaClient.chatMessage.create({
         data: {
            sender,
            content,
            session: {
               connect: { id: sessionId }
            }
         }
      })
      res.status(200).json({ message: "Messages sent successfully!!!" })

   } catch (err) {
      console.error('Error while saving chats. ' + err);
      res.status(500).json({ message: "Server error. Error while saving messages." })
   }
})

chatMessageRouter.get("/:sessionId", async function (req: Request<{ sessionId: string }, {}, {}>, res: Response) {
   const { sessionId } = req.params
   try {
      const chats = await prismaClient.chatMessage.findMany({
         where: { sessionId }
      })

      res.status(200).json({ chats })
   } catch (err) {
      console.error('Error retrieving chats:', err);
      res.status(500).json({ message: 'Internal server error' });
   }
})


export default chatMessageRouter    
