import { Router, Request, Response } from "express"
import { prismaClient } from "../db/prisma/client"

const contentRouter: Router = Router()

contentRouter.post("/create", async function (req: Request, res: Response) {
    const { title, link, type } = req.body;
    const userId = req.userId

    try {
        await prismaClient.content.create({
            data: {
                title,
                link,
                type,
                user: {
                    connect: {
                        id: userId
                    }
                }
            }
        })
        res.status(201).json({ message: "Content has been added successfully." })
    } catch (err) {
        console.log(err);
        res.status(403).json({ message: "Server error. Content not added." })
    }

})


contentRouter.get("/", async function (req: Request, res: Response) {
    const userId = req.userId
    try {
        const content = await prismaClient.content.findMany({ where: { userId } })

        res.status(201).json({ content })
    } catch (err) {
        res.status(500).json({ message: "Server error. Could not get content." })
        console.log(err)
    }
})

contentRouter.delete("/deleteOne", async function (req: Request, res: Response) {
    const { contentId } = req.body;
    try {
        await prismaClient.content.delete({
            where: {
                id: contentId,
                userId: req.userId
            }
        })
        res.status(201).json({
            message: "Content deleted successfully."
        })
    } catch (err) {
        res.json({ err })
        console.log(err)
    }
})

contentRouter.delete("/deleteAll", async function (req: Request, res: Response) {
    try {
        await prismaClient.content.deleteMany({
            where: {
                userId: req.userId
            }
        })
        res.status(201).json({
            message: "Content deleted successfully."
        })
    } catch (err) {
        res.json({ err })
        console.log(err)
    }
})




export default contentRouter    