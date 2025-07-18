import express from 'express'
import dotenv from "dotenv"
import cors from 'cors'
import { userMiddleware } from "./middleware/userMiddleware"
import cookieParser from "cookie-parser"
import authRouter from "./routes/authRouter"
import contentRouter from "./routes/contentRouter"
import thoughtRouter from "./routes/thoughtRouter"
import chatMessageRouter from "./routes/chatMessageRouter"
import chatSessionRouter from "./routes/chatSessionRouter"
import linkRouter from "./routes/linkRouter"


dotenv.config()

const app = express()

const allowedOrigin = [process.env.FRONTEND_URL as string, "http://localhost:5173"]

app.use(express.json())
app.use(cors({
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    origin: (origin, callback) => {
        if(!origin || allowedOrigin.includes(origin)){
            callback(null, true);
        }else{
            callback(new Error("Not allowed by CORS"));
        }
    }
}))
app.use(cookieParser())

app.use("/second-brain/api/auth", authRouter)
app.use("/second-brain/api/content", userMiddleware, contentRouter)
app.use("/second-brain/api/thought", userMiddleware, thoughtRouter)
app.use("/second-brain/api/link", userMiddleware, linkRouter)
app.use("/second-brain/api/chatMessage", userMiddleware, chatMessageRouter)
app.use("/second-brain/api/chatSession", userMiddleware, chatSessionRouter)


app.listen(3000, () => { console.log('Server is listening on port 3000.') })

