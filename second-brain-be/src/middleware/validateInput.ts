import { z } from "zod";
import express, { Request, Response, NextFunction } from "express";

const inputSchema = z.object({
    username: z.string().min(8,
        {
            message: "username must be atleast 8 characters long."
        }).email({
            message: "Invalid email address."
        }),

    password: z.string().min(8, {
        message: "password must be atleast 8 characters long."
    })
});

export const validateInput = (req: Request, res: Response, next: NextFunction) => {
    const result = inputSchema.safeParse(req.body);

    if (!result.success) {
        res.status(400).json({
            error: result.error.format()
        })
    } else {
        next();
    }
}

