import express, { Request, Response } from 'express'
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
import cluster from 'cluster'
import os from "os"

dotenv.config()

if (cluster.isMaster) {
   const number_of_cpus = os.cpus().length;
   console.log(`Master ${process.pid} is running.`)

   for (let i = 0; i < number_of_cpus; i++) {
      cluster.fork();
   }

   cluster.on("exit", (worker, code, signal) => {
      console.log(`Worker ${worker.process.pid} has died`);
      console.log("Starting a new worker...");
      cluster.fork();
   })
} else {

   const app = express()

   app.use(express.json())
   app.use(cors({
      credentials: true,
      allowedHeaders: ["Content-Type", "Authorization"],
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      origin: ["https://second-brainfe.vercel.app", "https://second-brain.codexbuild.website", "http://localhost:5173"]
   }))
   app.use(cookieParser())

   app.use("/second-brain/api/auth", authRouter)
   app.use("/second-brain/api/content", userMiddleware, contentRouter)
   app.use("/second-brain/api/thought", userMiddleware, thoughtRouter)
   app.use("/second-brain/api/link", userMiddleware, linkRouter)
   app.use("/second-brain/api/chatMessage", userMiddleware, chatMessageRouter)
   app.use("/second-brain/api/chatSession", userMiddleware, chatSessionRouter)

   app.get("/healthcheck", (req: Request, res: Response) => {
      res.status(200).json({ message: "The VM is healthy." })
   })

   app.listen(3000, () => { console.log('Server is listening on port 3000.') })

}

