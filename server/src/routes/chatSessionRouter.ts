import { Router, Request, Response } from "express"
import { prismaClient } from "../db/prisma/client"

const chatSessionRouter: Router = Router()

chatSessionRouter.post("/create", async (req: Request, res: Response) => {
    const { title } = req.body;
    const userId = req.userId;
    if (!title || !userId) {
        res.status(400).json({ message: "Title and userId are required." });
        return;
    }
    try {
        const session = await prismaClient.chatSession.create({
            data: {
                title,
                user: { connect: { id: userId } },
            },
        });
        res.status(201).json({ session });
    } catch (err) {
        res.status(500).json({ message: "Error creating session." });
        console.error("Error is: " + err)
    }
});

chatSessionRouter.get("/", async (req: Request, res: Response) => {
    const userId = req.userId;
    if (!userId) {
        res.status(401).json({ message: "User not authenticated." });
        return;
    }
    try {
        const sessions = await prismaClient.chatSession.findMany({
            where: { userId },
            orderBy: { created_at: "desc" },
        });
        res.status(200).json({ sessions });
    } catch (err) {
        res.status(500).json({ message: "Error fetching sessions." });
        console.error("Error is: " + err)
    }
});

chatSessionRouter.get("/:sessionId", async (req: Request, res: Response) => {
    const userId = req.userId;
    const { sessionId } = req.params;
    if (!userId) {
        res.status(401).json({ message: "User not authenticated." });
        return;
    }
    try {
        const session = await prismaClient.chatSession.findFirst({
            where: { id: sessionId, userId },
            include: { message: { orderBy: { created_at: "asc" } } },
        });
        if (!session) {
            res.status(404).json({ message: "Session not found." });
            return;
        }
        res.status(200).json({ session });
    } catch (err) {
        res.status(500).json({ message: "Error fetching session." });
        console.error("Error is: " + err)
    }
});


chatSessionRouter.delete("/delete/:sessionId", async function (req: Request, res: Response){
    const sessionId = req.params.sessionId;

    try{
        await prismaClient.chatSession.delete({ where: { id: sessionId } })
        res.status(200).json({ message: "Session deleted successfully." })
    }catch(err){
        console.error("Error is: " + err)
        res.status(500).json({ message: "Server error. Could not delete session." })
    }
})

export default chatSessionRouter