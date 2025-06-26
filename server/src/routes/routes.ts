import express, { Request, Response, NextFunction, RequestHandler } from "express"
const app = express();
import cors from "cors";
import { hash, compare } from "bcrypt"
import dotenv from "dotenv";
import { UserModel, ContentModel, LinkModel, ThoughtModel, DocumentModel, ChatModel } from "../db/db"
import { validateAuth, validateContent, validateThought, validateChat } from "../utils/src/types"
import { userMiddleware } from "../middleware/userMiddleware"
import { fileUpload } from "../middleware/fileUpload"
import jwt from 'jsonwebtoken';
import { getEmbeddingsFromGemini } from '../utils/src/client'
import { qdrantClient } from '../utils/src/qdrant'
import { genAI } from "../utils/src/client"
import { v5 as uuidv5 } from 'uuid'

const NAMESPACE = "550e8400-e29b-41d4-a716-446655440000"

dotenv.config();
app.use(express.json());
app.use(cors())

const hashLink = (len: number) => {
    const randomString = "sdajvuwrnklvuaadASUDGUABFWIONTWE"
    let hash = ""
    const length = randomString.length;
    for (let i = 0; i < len; i++) {
        hash += randomString[Math.floor((Math.random() * length))]
    }
    return hash
}


async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await hash(password, saltRounds)
}

async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await compare(plainPassword, hashedPassword)
}


app.post("/api/v1/second-brain/signup", validateAuth, async function (req: Request, res: Response) {
    try {
        const { username, password } = req.body

        const hashedPassword = await hashPassword(password);
        const user = await UserModel.create({
            username: username,
            password: hashedPassword,
            created_at: new Date()
        })

        const token = jwt.sign({ id: user._id }, process.env.JWT_PASSWORD as string, { expiresIn: "1h" })
        res.json({ token })

        res.status(201).json({
            message: "User has signed-up successfully."
        })
    } catch (err) {
        console.log("Signup error: " + err);
        res.status(500).json({
            error: ("Signup error: " + err)
        })
    }
})

app.post("/api/v1/second-brain/signin", validateAuth, async function (req: Request, res: Response) {
    try {
        const { username, password } = req.body

        const foundUser = await UserModel.findOne({ username });

        if (!foundUser) {
            res.status(400).json({ message: "Invalid credentials." })
            return;
        }

        const isPasswordValid = await verifyPassword(password, foundUser.password as string);
        if (!isPasswordValid) {
            res.status(400).json({ message: "Invalid credentials" })
            return;
        }

        const token = jwt.sign({ id: foundUser._id }, process.env.JWT_PASSWORD as string, { expiresIn: "1h" })
        res.json({ token })
    }
    catch (err) {
        console.log("Signin error: " + err);
        res.status(500).json({
            error: "Internal server error."
        })
    }
})

app.post("/api/v1/second-brain/content", validateContent, userMiddleware, async function (req: Request, res: Response) {
    const { title, link, type } = req.body;

    try {
        await ContentModel.create({
            title: title,
            link: link,
            type: type,
            userId: req.userId,
            created_at: new Date()
        })
        res.status(201).json({ message: "Content has been updated successfully." })
    } catch (err) {
        res.status(403).json({ message: "Content not added.", error: err })
    }

})


app.get("/api/v1/second-brain/content", userMiddleware, async function (req: Request, res: Response) {
    try {
        const content = await ContentModel.find({
            userId: req.userId
        }).populate("userId", "username")

        res.status(201).json({
            content
        })
    } catch (err) {
        res.json({ err })
        console.log(err)
    }
})

app.delete("/api/v1/second-brain/content", userMiddleware, async function (req: Request, res: Response) {
    const { contentId } = req.body;
    try {
        await ContentModel.deleteMany({
            _id: contentId,
            userId: req.userId
        })
        res.status(201).json({
            message: "Content deleted successfully."
        })
    } catch (err) {
        res.json({ err })
        console.log(err)
    }
})

app.post("/api/v1/second-brain/thoughts", validateThought, userMiddleware, async function (req: Request, res: Response) {
    const { title, thoughts } = req.body;
    const userId = req.userId
    const fullText = `${title} ${thoughts}`

    if (!title || !thoughts || !userId) {
        res.status(400).json({ message: "Title, thoughts, and userId are required" });
        return
    }

    try {
        const saved = await ThoughtModel.create({
            title: title,
            thoughts: thoughts,
            userId: userId,
            created_at: new Date()
        });

        const vector = await getEmbeddingsFromGemini(fullText)
        if (!vector) {
            res.status(400).json({
                message: "No vector embeddings processed."
            });
            return
        }

        const pointId = uuidv5(saved._id.toString(), NAMESPACE);

        await qdrantClient.upsert('thoughts', {
            points: [
                {
                    id: pointId,
                    vector,
                    payload: {
                        title,
                        thoughts,
                        userId: userId!.toString(),
                        mongoId: saved._id.toString()
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

app.get("/api/v1/second-brain/thoughts", userMiddleware, async function (req: Request, res: Response) {
    try {
        const thoughts = await ThoughtModel.find({
            userId: req.userId
        }).populate("userId", "username");
        res.status(200).json({ thoughts });
    } catch (err) {
        res.status(403).json({ message: "Not found.", error: err })
    }
})

app.delete("/api/v1/second-brain/thoughts", userMiddleware, async function (req: Request, res: Response) {
    const { thoughtId } = req.body;
    const userId = req.userId;

    if (!thoughtId?.trim() || !userId) {
        res.status(400).json({ message: "thoughtId and userId required" });
        return
    }

    try {
        await ThoughtModel.deleteOne({
            _id: thoughtId,
            userId: req.userId
        })

        const point_id = uuidv5(thoughtId, NAMESPACE);
        await qdrantClient.delete('thoughts', {
            // filter: {
            //     must: [
            //         {
            //             key: "id",
            //             match: {
            //                 value: point_id
            //             }
            //         }
            //     ]
            // }
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


app.post("/api/v1/second-brain/query", userMiddleware, async function (req: Request, res: Response) {
    const { query } = req.body;
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
        const queryEmbedding = await getEmbeddingsFromGemini(query)
        if (!queryEmbedding) {
            res.status(500).json({ message: "Failed to generate query embedding" });
            return
        }

        const result = await qdrantClient.search("thoughts", {
            vector: queryEmbedding,
            limit: 2,
            filter: {
                must: [
                    {
                        key: "userId", match: { value: userId.toString() }
                    }
                ]
            }
        })

        // console.log(result.score);

        const results = result.map(r => r.payload)
        res.status(200).json({
            results
        })

    } catch (err) {
        res.status(404).json({
            message: "Error saving thoughts: " + err
        })
    }
});


app.post("/api/v1/second-brain/chat-query", userMiddleware, async function (req: Request, res: Response) {
    const { query } = req.body

    const userId = req.userId
    if (!userId) {
        res.status(401).json({ message: "User is not authenticated." })
        return
    }

    try {
        const queryEmbedding = await getEmbeddingsFromGemini(query);

        const result = await qdrantClient.search('thoughts', {
            vector: queryEmbedding,
            limit: 2,
            filter: {
                must: [{ key: "userId", match: { value: userId!.toString() } }]
            }
        });

        const retrievedTexts = result.map(r => `${r.payload?.title ?? ""}: ${r.payload?.thoughts ?? ""}`).join("\n");
        if (!retrievedTexts) {
            res.status(404).json({
                message: 'No results found.'
            });
        }

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
            references: result.map(r => r.payload)
        })

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error generating answer", error: err });
    }
})

app.post("/api/v1/second-brain/chats", validateChat, userMiddleware, async function (req: Request, res: Response) {
    const { sender, content } = req.body

    try {
        const chat = await ChatModel.create({
            sender,
            content,
            userId: req.userId,
            created_at: new Date()
        })
        res.status(200).json({
            message: "Chats saved successfully!!!",
            chatId: chat._id
        })

    } catch (err) {
        console.log('Error while saving chats. ' + err);
        res.status(500).json({
            message: "Error while saving chats. "
        })
    }
})

app.get("/api/v1/second-brain/chats", userMiddleware, async function (req: Request, res: Response) {
    try {
        const chats = await ChatModel.find({
            userId: req.userId
        }).sort({ created_at: 1 })

        res.status(200).json({
            chats
        })
    } catch (err) {
        console.error('Error retrieving chats:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
})



app.post("/api/v1/second-brain/documents", userMiddleware, fileUpload.single('file'), async function (req: Request, res: Response): Promise<void> {
    try {
        const file = req.file as Express.Multer.File | undefined;
        const userId = (req as any).userId as string | undefined;

        if (!file || !userId) {
            res.status(400).json({ message: "Missing files or user ID" });
            return;
        }

        await DocumentModel.create({
            filePath: file.path,
            fileName: file.originalname,
            fileType: file.mimetype,
            size: file.size,
            userId: userId
        })
        res.status(200).json({ message: "Document added successfully." });
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: "Something went wrong." + err })
    }
})

app.get("/api/v1/second-brain/documents", userMiddleware, async function (req: Request, res: Response) {
    try {
        const document = await DocumentModel.find({
            userId: req.userId
        }).populate("userId", "username")

        res.status(200).json({ document })

    } catch (err) {
        console.log(err);
        res.status(403).json({ message: "Something went wrong." + err })
    }
})

app.delete("/api/v1/second-brain/documents", userMiddleware, async function (req: Request, res: Response) {
    const { documentId } = req.body;

    try {
        const deleted = await DocumentModel.findOneAndDelete({
            _id: documentId,
            userId: req.userId
        })
        if (!deleted) {
            res.status(400).json({ message: "Document not found or not owned by user." })
        }

        res.status(200).json({ message: "Deleted successfully." })
    } catch (err) {
        console.log(err);
        res.json({ err })
    }
})

app.post("/api/v1/second-brain/share", userMiddleware, async function (req: Request, res: Response) {
    const { share } = req.body;
    try {
        if (share) {
            const link = hashLink(20);
            const existingLink = await LinkModel.findOne({
                userId: req.userId
            })
            if (existingLink) {
                res.json({
                    link: existingLink.hash
                })
                return;
            }
            await LinkModel.create({
                userId: req.userId,
                hash: link
            })
            res.json({
                link
            })
        } else {
            await LinkModel.deleteMany({
                userId: req.userId
            })
            res.json({
                message: "Removed link"
            })
        }
    } catch (err) {
        res.json({ err })
        console.log(err)
    }

})

app.post("/api/v1/second-brain/:shareLink", async function (req: Request, res: Response) {
    const link = req.params.shareLink
    try {
        if (!link) {
            res.json({
                message: "Link is required."
            })
            return
        }

        const hashLink = await LinkModel.findOne({
            hash: link
        })
        if (!hashLink) {
            res.json({
                message: "Invalid link."
            })
            return
        }

        const content = await ContentModel.find({
            userId: hashLink.userId
        })

        const user = await UserModel.findOne({
            _id: hashLink.userId
        })
        if (!user) {
            res.json({
                message: "User not found."
            })
        }

        res.json({
            username: user?.username,
            content
        })
    } catch (err) {
        res.json({ err })
        console.log(err)
    }
})

const PORT = process.env.PORT as unknown as number

app.listen(PORT, () => {
    console.log("Server listening on PORT: " + PORT)
})