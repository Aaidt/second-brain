import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

const JWT_PASSWORD = process.env.JWT_PASSWORD as string

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"]
    const decoded = jwt.verify(header as string, JWT_PASSWORD );

    if(decoded){
        if(typeof decoded == "string"){
            res.status(403).json({
                message: "Invalid token"
            });
            return;
        }
        req.userId = decoded.id
        next();
    }else{
        res.status(403).json({
            message: "You are not logged in."
        })
    }
}