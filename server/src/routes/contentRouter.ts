import { Router, Request, Response } from "express"
import { prismaClient } from "../db/prisma/client"
import { z } from "zod" 
import { ContentSchema, validateContent } from "../utils/src/types"

const contentRouter: Router = Router()

type contentInput = z.infer<typeof ContentSchema>

contentRouter.post("/create", validateContent, async function (req: Request<{}, {}, contentInput>, res: Response) {
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
        console.error(err);
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
        console.error(err)
    }
})

contentRouter.delete("/deleteOne/:contentId", async function (req: Request<{contentId: string}, {}, {}>, res: Response) {
    const { contentId } = req.params;
    const userId = req.userId
    if(!contentId?.trim() || !userId){
        res.status(403).json({ message: "Unauthorized." })
        return 
    }

    if(typeof contentId !== "string"){
        res.status(403).json({ message: "Incorrect contentId sent" })
        return 
    }
    try {
        const doesUserExist = await prismaClient.user.findFirst({
            where: { id: userId }
        })
        if(!doesUserExist){
            res.status(404).json({ message: "This user doesnt exist." })
            return
        }

        await prismaClient.content.delete({
            where: {
                id: contentId,
                userId
            }
        })
        res.status(201).json({ message: "Content deleted successfully." })
    } catch (err) {
        res.json({ message: "Server error. Error while deleting one." })
        console.error(err)
    }
})

contentRouter.delete("/deleteAll", async function (req: Request, res: Response) {
    try {
        await prismaClient.content.deleteMany({
            where: { userId: req.userId }
        })
        res.status(201).json({ message: "Content deleted successfully." })
    } catch (err) {
        res.json({ message: "Server error. Error while deleting all." })
        console.error(err)
    }
})




export default contentRouter    