import express, { Request, Response, NextFunction, RequestHandler } from "express"
const app = express();
import cors from "cors";
import { hash, compare } from "bcrypt"
import dotenv from "dotenv";
dotenv.config();
import { UserModel, ContentModel, LinkModel, ThoughtModel } from "../db/db"
import { validateInput } from "../middleware/validateInput"
import { userMiddleware } from "../middleware/userMiddleware"
import jwt from 'jsonwebtoken';

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


app.post("/api/v1/second-brain/signup", validateInput, async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body

        const hashedPassword = await hashPassword(password);
        await UserModel.create({
            username: username,
            password: hashedPassword
        })

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

app.post("/api/v1/second-brain/signin", validateInput, async (req: Request, res: Response) => {
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

app.post("/api/v1/second-brain/content", userMiddleware, async (req: Request, res: Response) => {
    const { title, link, type } = req.body;

    try {
        await ContentModel.create({
            title: title,
            link: link,
            type: type,
            userId: req.userId
        })
        res.status(201).json({ message: "Content has been updated successfully." })
    } catch (err) {
        res.status(403).json({ message: "Content not added.", error: err })
    }

})


app.get("/api/v1/second-brain/content", userMiddleware, async (req: Request, res: Response) => {
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

app.delete("/api/v1/second-brain/content", userMiddleware, async (req: Request, res: Response) => {
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

app.post("/api/v1/second-brain/thoughts", userMiddleware, async(req: Request, res: Response) => {
    const { title, thought } = req.body;

    try{
        await ThoughtModel.create({
            title: title,
            thought: thought
        })
        res.status(200).json({ message: "Successfully added the thought." })

    }catch(err){
        console.log(err);
        res.status(403).json({ message: "Thought not added. Something went wrong", error: err })
    }
})

app.get("/api/v1/second-brain/thoughts", userMiddleware, async(req: Request, res: Response ) => {
    try{
        const thought = await ThoughtModel.find({
            userId: req.userId
        }).populate("userId", "username");
    
        res.status(200).json({ thought });
    }catch(err){
        res.status(403).json({ message: "Thought not found.", error: err })
    }
})

app.delete("/api/v1/second-brain/thoughts", userMiddleware, async(req: Request, res: Response) => {
    
})


app.post("/api/v1/second-brain/share", userMiddleware, async (req: Request, res: Response) => {
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

app.post("/api/v1/second-brain/:shareLink", async (req: Request, res: Response) => {
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