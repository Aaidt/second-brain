import { z } from "zod";

export const ValidateInput = () => {
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
}

