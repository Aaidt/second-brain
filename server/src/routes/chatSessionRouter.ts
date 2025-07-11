import { Router, Request, Response } from "express"
import { prismaClient } from "../db/prisma/client"

const chatSessionRouter: Router = Router()

// Create a new chat session
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
        res.status(500).json({ message: "Error creating session.", error: err });
    }
});

// Get all chat sessions for the user
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
        res.status(500).json({ message: "Error fetching sessions.", error: err });
    }
});

// Get a single session with its messages
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
        res.status(500).json({ message: "Error fetching session.", error: err });
    }
});

// Add a message to a session
chatSessionRouter.post("/:sessionId/message", async (req: Request, res: Response) => {
    const userId = req.userId;
    const { sessionId } = req.params;
    let { sender, content } = req.body;
    if (!userId) {
        res.status(401).json({ message: "User not authenticated." });
        return;
    }
    if (!sender || !content) {
        res.status(400).json({ message: "Sender and content are required." });
        return;
    }
    // Map sender to enum values
    sender = sender === "user" ? "USER" : sender === "ai" ? "AI" : sender;
    try {
        const message = await prismaClient.chatMessage.create({
            data: {
                sender,
                content,
                session: { connect: { id: sessionId } },
            },
        });
        res.status(201).json({ message });
    } catch (err) {
        res.status(500).json({ message: "Error adding message.", error: err });
    }
});

export default chatSessionRouter