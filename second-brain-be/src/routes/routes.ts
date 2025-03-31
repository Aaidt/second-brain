import express, { Request, Response, NextFunction } from "express"
const app = express();
import cors from "cors"; 
import { z } from "zod"
import { hash, compare } from "bcrypt-ts";
import dotenv from "dotenv";
dotenv.config(); 
import { UserModel, ContentModel } from "../db/db"
import { validateInput } from "../middleware/validateInput"

app.use(express.json());
app.use(cors())

app.post("/api/v1/second-brain/signup", validateInput,  async (req: Request, res: Response) => {
    const { username, password } = req.body

    async function hashPassword(password: string): Promise<string>{
        const saltRounds = 10;
        return await hash(password, saltRounds)
    }
    const hashedPassword = await hashPassword(password);

    await UserModel.create({
        username: username,
        password: hashedPassword
    })
    res.status(201).json({
        message: "User has signed-up successfully."
    })

})

app.post("/api/v1/second-brain/signin", async (req, res) => {
    const { username, password } = req.body

    async function verifyPassword(plainPassword: string, hashedPassword: string){
        return await compare(plainPassword, hashedPassword)
    }

    // const hashedPassword = await verifypassword(password);
})

app.post("/api/v1/second-brain/signup", async (req, res) => {
    
})

app.post("/api/v1/second-brain/signup", async (req, res) => {
    
})

app.post("/api/v1/second-brain/signup", async (req, res) => {
    
})

app.post("/api/v1/second-brain/signup", async (req, res) => {
    
})

app.post("/api/v1/second-brain/signup", async (req, res) => {
    
})

const PORT = process.env.PORT as unknown as number 

app.listen(PORT, () => {
    console.log("Server listening on PORT: " + PORT)
})