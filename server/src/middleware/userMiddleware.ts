import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers["Authorization"]

    if (!authHeader || typeof authHeader !== "string") {
        res.status(403).json({ message: "Authorization header missing or mlaformed." })
        return
    }

    const accessToken = authHeader.split(" ")[1]
    if (!accessToken) {
        res.status(401).json({ message: "Access token missing." });
        return
    }

    try {
        const decoded = jwt.verify(accessToken, JWT_SECRET) as jwt.JwtPayload;

        if (!decoded || !decoded.userId) {
            res.status(403).json({ message: "Invalid token payload." });
            return
        }

        req.userId = decoded.userId;
        next();

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Server Error. User not authorized" })
        return
    }

}