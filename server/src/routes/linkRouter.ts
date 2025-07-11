import { Router, Request, Response } from "express"
import { prismaClient } from "../db/prisma/client"

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


linkRouter.post("/share", async function (req: Request, res: Response) {
    const { share } = req.body;
    const userId = req.userId
    try {
        if (share) {
            const link = hashLink(20);
            const existingLink = await prismaClient.link.findFirst({
                where: {
                    userId
                }
            })
            if (existingLink) {
                res.json({
                    link: existingLink.hash
                })
                return;
            }
            await prismaClient.link.create({
                data: {
                    hash: link,
                    user:{ 
                        connect: {
                            id: userId
                        }
                    } 
                }
            })
            res.json({
                link
            })
        } else {
            await prismaClient.link.deleteMany({
                where: {
                    userId
                }
            })
            res.json({
                message: "Removed link"
            })
        }
    } catch (err) {
        res.json({ message: "Server error. Could not delete." })
        console.log(err)
    }

})

linkRouter.post("/share/:shareLink", async function (req: Request, res: Response) {
    const link = req.params.shareLink
    try {
        if (!link) {
            res.json({
                message: "Link is required."
            })
            return
        }

        const hashLink = await prismaClient.link.findFirst({
            where: {
                hash: link
            }
        })
        if (!hashLink) {
            res.json({
                message: "Invalid link."
            })
            return
        }

        const content = await prismaClient.content.findMany({
            where: {
                userId: hashLink.userId
            }
        })

        const user = await prismaClient.user.findFirst({
            where: {
                id: hashLink.userId
            }
        })
        if (!user) {
            res.json({
                message: "User not found."
            })
        }

        res.json({
            username: user?.username,
            content
        })
    } catch (err) {
        res.json({ err })
        console.log(err)
    }
})


export default linkRouter