import { Router, Request, Response } from "express"
import { getEmbeddingsFromGemini } from '../utils/src/client'
import { qdrantClient } from '../utils/src/qdrant'
import { prismaClient } from "../db/prisma/client"
import { z } from "zod"
import { ThoughtSchema } from "../utils/src/types"

const thoughtRouter: Router = Router()

type thoughtInput = z.infer<typeof ThoughtSchema>

thoughtRouter.post("/create", async function (req: Request<{}, {}, thoughtInput>, res: Response) {
    const { title, thoughts } = req.body;
    const userId = req.userId
    const fullText = `${title} ${thoughts}`

    if (!title || !thoughts || !userId) {
        res.status(400).json({ message: "Title, thoughts, and userId are required" });
        return
    }

    let saved;
    try {
        saved = await prismaClient.thought.create({
            data: {
                title: title,
                body: thoughts,
                user: {
                    connect: { id: userId }
                },
                created_at: new Date()
            }
        });

        const vector = await getEmbeddingsFromGemini(fullText)
        if (!vector) {
            // rollback the Db insert.
            await prismaClient.thought.delete({ where: { id: saved.id } })

            res.status(400).json({
                message: "No vector embeddings processed."
            });
            return
        }

        try {

            await qdrantClient.upsert('thoughts', {
                points: [
                    {
                        id: saved.id,
                        vector,
                        payload: {
                            title,
                            thoughts,
                            userId
                        }
                    }
                ]
            })

            res.status(200).json({ message: "Successfully added the thought." })
        } catch (qdrantErr) {
            console.error("Error while inserting in qdrant db is: " + qdrantErr);
            // rollack db insert
            await prismaClient.thought.delete({ where: { id: saved.id } });
            res.status(500).json({ message: "Failed to upsert thought to Qdrant DB. Had to rollback. " })
        }

    } catch (err) {
        console.error("Error is: " + err)
        res.status(403).json({ message: "Content not added. Something went wrong" })
    }
})

thoughtRouter.get("/", async function (req: Request<{}, {}, thoughtInput>, res: Response) {
    try {
        const thoughts = await prismaClient.thought.findMany({
            where: { userId: req.userId }
        });
        res.status(200).json({ thoughts });
    } catch (err) {
        res.status(403).json({ message: "Server error. Not found." })
        console.error("Error is: " + err)
    }
})

thoughtRouter.delete("/delete", async function (req: Request<{ thoughtId: string }, {}, thoughtInput>, res: Response) {
    const { thoughtId } = req.params;
    const userId = req.userId;

    if (!thoughtId?.trim() || !userId) {
        res.status(400).json({ message: "thoughtId and userId required" });
        return
    }

    let deletedThought;
    try {
        deletedThought = await prismaClient.thought.findUnique({ where: { id: thoughtId } })
        if (!deletedThought || deletedThought.userId !== userId) {
            res.status(403).json({
                message: "Thought not found or not authorized."
            })
            return
        }

        await prismaClient.thought.delete({
            where: {
                id: thoughtId,
                userId: userId
            }
        })

        try {
            await qdrantClient.delete('thoughts', {
                points: [thoughtId]
            })
        } catch (qdrantErr) {
            // rollback the deleted thought
            await prismaClient.thought.create({
                data: {
                    id: deletedThought.id,
                    title: deletedThought.title,
                    body: deletedThought.body,
                    userId: deletedThought.userId,
                    created_at: deletedThought.created_at,
                }
            })

            res.status(500).json({ message: "Failed to delete from Qdrant, rolled back the db." })
            console.error("Qdrant deletion error: " + qdrantErr)
            return
        }

        res.status(200).json({ message: "Deleted successfully." })
    } catch (err) {
        console.error("Error deleting thought: ", err);
        res.status(500).json({
            message: "Server error. Failed to delete thought."
        });
    }
})

export default thoughtRouter    