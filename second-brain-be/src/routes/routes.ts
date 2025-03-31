import express, { Request, Response, NextFunction, RequestHandler } from "express"
const app = express();
import cors from "cors";
import { hash, compare } from "bcrypt-ts";
import dotenv from "dotenv";
dotenv.config();
import { UserModel, ContentModel } from "../db/db"
import { validateInput } from "../middleware/validateInput"
import jwt from 'jsonwebtoken';

app.use(express.json());
app.use(cors())

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
            error: "Internal server error."
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

app.post("/api/v1/second-brain/content", async (req: Request, res: Response) => {
    const { title, link, type } = req.body;

    await ContentModel.create({
        title: title,
        link: link,
        type: type
    })
    res.status(201).json({ message: "Content has been updated successfully." })
})

app.get("/api/v1/second-brain/content", async (req: Request, res: Response) => {


})

app.post("/api/v1/second-brain/signup", async (req: Request, res: Response) => {

})

app.post("/api/v1/second-brain/signup", async (req: Request, res: Response) => {

})

app.post("/api/v1/second-brain/signup", async (req: Request, res: Response) => {

})

const PORT = process.env.PORT as unknown as number

app.listen(PORT, () => {
    console.log("Server listening on PORT: " + PORT)
})