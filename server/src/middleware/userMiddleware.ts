import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string
dotenv.config();

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"]
    const decoded = jwt.verify(header as string, JWT_SECRET);

    try {
        if (decoded) {
            if (typeof decoded == "string") {
                res.status(403).json({
                    message: "Invalid token"
                });
                return;
            }
            req.userId = decoded.id
            next();
        } else {
            res.status(403).json({
                message: "You are not logged in."
            })
        }
    } catch (e) {
        console.log(e);
    }

}