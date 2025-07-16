import { Router, Request, Response } from "express"
import { z } from 'zod'
import { prismaClient } from "../db/prisma/client"
import { LinkSchema, validateLink } from '../utils/src/types';

const linkRouter: Router = Router()

const hashLink = (len: number) => {
    const randomString = "sdajvuwrnklvuaadASUDGUABFWIONTWE"
    let hash = ""
    const length = randomString.length;
    for (let i = 0; i < len; i++) {
        hash += randomString[Math.floor((Math.random() * length))]
    }
    return hash
}

type linkInput = z.infer<typeof LinkSchema>

linkRouter.post("/share", validateLink, async function (req: Request<{}, {}, linkInput>, res: Response) {
    const { share } = req.body;
    const userId = req.userId
    try {
        if (share) {
            const link = hashLink(20);
            const existingLink = await prismaClient.link.findFirst({ where: { userId } })
            if (existingLink) {
                res.json({ link: existingLink.hash })
                return;
            }
            await prismaClient.link.create({
                data: {
                    hash: link,
                    user:{ 
                        connect: { id: userId }
                    } 
                }
            })
            res.json({ link })
        } else {
            await prismaClient.link.deleteMany({
                where: { userId }
            })
            res.json({ message: "Removed link" })
        }
    } catch (err) {
        res.json({ message: "Server error. Could not delete." })
        console.error(err)
    }

})

linkRouter.post("/share/:shareLink", async function (req: Request<{shareLink: string}, {}, {}>, res: Response) {
    const link = req.params.shareLink
    try {
        if (!link) {
            res.json({ message: "Link is required." })
            return
        }

        const hashLink = await prismaClient.link.findFirst({
            where: { hash: link }
        })
        if (!hashLink) {
            res.json({ message: "Invalid link." })
            return
        }

        const content = await prismaClient.content.findMany({
            where: { userId: hashLink.userId }
        })

        const thought = await prismaClient.thought.findMany({
            where: { userId: hashLink.userId }
        })

        const user = await prismaClient.user.findFirst({
            where: { id: hashLink.userId }
        })
        if (!user) {
            res.json({
                message: "User not found."
            })
        }

        res.json({
            username: user?.username,
            content,
            thought
        })
    } catch (err) {
        res.json({ message: "Server error. Error in the sharing process." })
        console.error(err)
    }
})


export default linkRouter