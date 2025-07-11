import { Router, Request, Response } from "express"
import { getEmbeddingsFromGemini } from '../utils/src/client'
import { qdrantClient } from '../utils/src/qdrant'
import { prismaClient } from "../db/prisma/client"
import { userMiddleware } from "../middleware/userMiddleware"
import { v5 as uuidv5 } from 'uuid';

const NAMESPACE = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'; // Use a constant UUID namespace

const thoughtRouter: Router = Router()

thoughtRouter.post("/thoughts", async function (req: Request, res: Response) {
    const { title, thoughts } = req.body;
    const userId = req.userId
    const fullText = `${title} ${thoughts}`

    if (!title || !thoughts || !userId) {
        res.status(400).json({ message: "Title, thoughts, and userId are required" });
        return
    }

    try {
        const saved = await prismaClient.thought.create({
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
            res.status(400).json({
                message: "No vector embeddings processed."
            });
            return
        }

        const pointId = uuidv5(saved.id, NAMESPACE);

        await qdrantClient.upsert('thoughts', {
            points: [
                {
                    id: pointId,
                    vector,
                    payload: {
                        title,
                        thoughts,
                        userId: userId.toString(),
                        dbId: saved.id
                    }
                }
            ]
        })

        res.status(200).json({ message: "Successfully added the thought." })

    } catch (err) {
        console.log(err);
        res.status(403).json({ message: "Content not added. Something went wrong", error: err })
    }
})

thoughtRouter.get("/api/v1/second-brain/thoughts", userMiddleware, async function (req: Request, res: Response) {
    try {
        const thoughts = await prismaClient.thought.findMany({
            where: { userId: req.userId },
            include: { user: { select: { username: true } } }
        });
        res.status(200).json({ thoughts });
    } catch (err) {
        res.status(403).json({ message: "Not found.", error: err })
    }
})

thoughtRouter.delete("/api/v1/second-brain/thoughts", userMiddleware, async function (req: Request, res: Response) {
    const { thoughtId } = req.body;
    const userId = req.userId;

    if (!thoughtId?.trim() || !userId) {
        res.status(400).json({ message: "thoughtId and userId required" });
        return
    }

    try {
        await prismaClient.thought.delete({
            where: {
                id: thoughtId,
                userId: userId
            }
        })

        const point_id = uuidv5(thoughtId, NAMESPACE);
        await qdrantClient.delete('thoughts', {
            points: [point_id]
        })

        res.status(200).json({ message: "Deleted successfully." })
    } catch (err) {
        console.error("Error deleting thought:", err);
        res.status(500).json({
            message: "Failed to delete thought",
            error: (err as Error).message
        });
    }
})

export default thoughtRouter    