import { Router, Response, Request } from "express"
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { hash, compare } from "bcrypt"
import { prismaClient } from "../db/prisma/client"
import { z } from "zod" 
import { AuthSchema, validateAuth } from "../utils/src/types"
dotenv.config()

const authRouter: Router = Router()

type authInput = z.infer<typeof AuthSchema>

const ACCESS_SECRET = process.env.ACCESS_SECRET
const REFRESH_SECRET = process.env.REFRESH_SECRET

authRouter.post("/signup", validateAuth, async function (req: Request<{}, {}, authInput>, res: Response) {
    try {
        const { name, username, password } = req.body
        if(!name || !username || !password){
            res.status(402).json({ message: "All 3 fields are required." })
            return
        }

        const hashedPassword = await hash(password, 5);

        const user = await prismaClient.user.create({
            data: {
                name,
                username,
                password: hashedPassword
            }
        })

        const accessToken = jwt.sign({ userId: user.id }, ACCESS_SECRET as string, { expiresIn: "15m" })
        const refreshToken = jwt.sign({ userId: user.id }, REFRESH_SECRET as string, { expiresIn: "7d" })

        res.cookie("refresh-token", refreshToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: "lax"
        })

        res.status(201).json({
            message: "User has signed-up successfully.",
            accessToken
        })
    } catch (err) {
        console.error("Signup error: " + err);
        res.status(500).json({
            message: "Server error. Error in signing up."
        })
    }
})

authRouter.post("/signin", validateAuth, async function (req: Request<{}, {}, authInput>, res: Response) {
    try {
        const { username, password } = req.body
        if(!username || !password){
            res.status(402).json({ message: "All fields are required." })
            return
        }

        const foundUser = await prismaClient.user.findFirst({ where: { username } })

        if (!foundUser) {
            res.status(404).json({ message: "User not found." })
            return;
        }

        const isPasswordValid = await compare(password, foundUser.password as string);
        if (!isPasswordValid) {
            res.status(400).json({ message: "Invalid credentials" })
            return;
        }

        const accessToken = jwt.sign({ userId: foundUser.id }, ACCESS_SECRET as string, { expiresIn: "15m" })
        const refreshToken = jwt.sign({ userId: foundUser.id }, REFRESH_SECRET as string, { expiresIn: "7d" })

        res.cookie("refresh-token", refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 7 * 24 * 3600 * 1000
        })

        res.json({ accessToken })
    }
    catch (err) {
        console.error("Signin error: " + err);
        res.status(500).json({
            message: "Internal server error while signing in."
        })
    }
})

authRouter.post("/refresh-token", async function (req: Request, res: Response) {
    const refreshToken = req.cookies["refresh-token"]
    if (!refreshToken) {
        res.status(404).json({ message: "Token not found." })
        return
    }
    try{
        const payload = jwt.verify(refreshToken, REFRESH_SECRET as string) as { userId: string }
        const newAccessToken = jwt.sign({ userId: payload.userId }, ACCESS_SECRET as string, { expiresIn: "15m" })
        res.json({ accessToken: newAccessToken })
    }catch(err){
        console.error("Invalid refresh token.");
        res.status(403).json({ message: "Not authorized" });
    }
})

authRouter.post("/logout", async function (req: Request<{}, {}, authInput>, res: Response) {
    try {
        res.clearCookie("refresh-token", { sameSite: "lax", httpOnly: true });
        res.status(200).json({ message: "Logged out successfully." });
    } catch (err) {
        res.status(500).json({ message: "Logout failed." });
        console.error(err)
    }
});

export default authRouter