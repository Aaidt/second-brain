import express from 'express'
import dotenv from "dotenv"
import cors from 'cors'
import { userMiddleware } from "./middleware/userMiddleware"
import { validateAuth, validateContent, validateThought, validateChatMessage, validateChatSession, validateLink } from "./utils/src/types"
import cookieParser from "cookie-parser"
import authRouter from "./routes/authRouter"
import contentRouter from "./routes/contentRouter"
import thoughtRouter from "./routes/thoughtRouter"
import chatMessageRouter from "./routes/chatMessageRouter"
import chatSessionRouter from "./routes/chatSessionRouter"
import linkRouter from "./routes/linkRouter"


dotenv.config()

const app = express()

app.use(express.json())
app.use(cors({
    credentials: true,
    origin: "http://localhost:5173"
}))
app.use(cookieParser())

app.use("/second-brain/api/auth", validateAuth, authRouter)
app.use("/second-brain/api/content", validateContent, userMiddleware, contentRouter)
app.use("/second-brain/api/thought", validateThought, userMiddleware, thoughtRouter)
app.use("/second-brain/api/link", validateLink, userMiddleware, linkRouter)
app.use("/second-brain/api/chat", validateChatMessage, userMiddleware, chatMessageRouter)
app.use("/second-brain/api/chat", validateChatSession, userMiddleware, chatSessionRouter)


app.listen(3000, () => {
    console.log('Server is listening on port 3000.')
})

