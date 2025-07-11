import { Router, Response, Request } from "express"
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { hash, compare } from "bcrypt"
import { prismaClient } from "../db/prisma/client"

dotenv.config()
const authRouter: Router = Router()

const ACCESS_SECRET =  process.env.ACCESS_SECRET
const REFRESH_SECRET =  process.env.REFRESH_SECRET

authRouter.post("/signup", async function (req: Request, res: Response) {
    try {
        const { name, username, password } = req.body

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

        res.json({ accessToken })

        res.status(201).json({
            message: "User has signed-up successfully."
        })
    } catch (err) {
        console.log("Signup error: " + err);
        res.status(500).json({
            error: ("Server error. Error in signing up.")
        })
    }
})

authRouter.post("/signin", async function (req: Request, res: Response) {
    try {
        const { username, password } = req.body

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

        const accessToken = jwt.sign({ id: foundUser.id },  ACCESS_SECRET as string, { expiresIn: "15m" })
        const refreshToken = jwt.sign({ id: foundUser.id },  REFRESH_SECRET as string, { expiresIn: "7d" })

        res.cookie("refresh-token", refreshToken, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 7 * 24 * 3600 * 1000
        })

        res.json({ accessToken })
    }
    catch (err) {
        console.log("Signin error: " + err);
        res.status(500).json({
            error: "Internal server error while signing in."
        })
    }
})

authRouter.post("/refresh-token", async function (req: Request, res: Response) {
    const userId = req.userId
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken){
        res.status(404).json({ message: "Token not found." })
        return
    }

    const isRefreshTokenValid = jwt.verify(refreshToken, REFRESH_SECRET as string)

    if (!isRefreshTokenValid) {
        res.status(402).json({ message: "Not authourized." })
        console.log("Invalid refresh token.")
        return
    }

    const newAccessToken  = jwt.sign({ userId }, ACCESS_SECRET as string, { expiresIn: "15m"})

    res.json({ accessToken: newAccessToken  })
})

export default authRouter