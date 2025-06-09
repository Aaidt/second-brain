import express from "express";
const app = express();
import cors from "cors";
// import { UserModel, ContentModel, LinkModel } from "./db/db"
import jwt from "jsonwebtoken";
// import { JWT_PASSWORD, PORT } from "./config"
import { userMiddleware } from "./middlewares/userMiddleware"
import { random } from "./utils"
import { pool } from "./db/db"
import dotenv from "dotenv";
dotenv.config();

app.use(express.json())
app.use(cors())

app.post("/api/v1/second-brain/test", async (req, res) => {
	const { username } = req.body;
	res.json({
		message: username
	})
})



app.get("/api/v1/second-brain/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      message: "Connected to RDS successfully!",
      timestamp: result.rows[0].now,
    });
  } catch (err) {
	  // @ts-ignore
    console.error("RDS connection failed:", err.message);
    res.status(500).json({ error: "Database connection failed" });
  }
});


app.post("/api/v1/second-brain/signup", async (req, res) => {
    // zod validation, password hashing 
    const { username, password } = req.body;
    try {
        // await UserModel.create({
        //     username: username,
        //     password: password
        // });
        await pool.query(
            "INSERT INTO users (username, password) VALUES ($1, $2)",
            [username, password]
          );

        res.status(200).json({
            message: "You have successfully signed up."
        });
    } catch (e) {
        console.log(e);
    }
})

app.post("/api/v1/second-brain/signin", async (req, res) => {
    const { username, password } = req.body;
    // try{

    // }catch(err){
    //     console.log(`Error while signing in. ${err}`)
    //     res.status(500).json({
    //         message: "Internal server error"
    //     })
    // }
    // const existingUser = await UserModel.findOne({
    //     username,
    //     password
    // });

    // if (existingUser) {
    //     const token = jwt.sign({
    //         id: existingUser._id
    //     },process.env.JWT_PASSWORD)
    //     res.json({
    //         token
    //     })
    // } else {    
    //     res.status(403).json({
    //         message: "Incorrect credentials."
    //     })
    // }
    const result = await pool.query(
        "SELECT id FROM users WHERE username = $1 AND password = $2",
        [username, password]
      );
      
      if (result.rows.length > 0) {
        // @ts-ignore
	const token = jwt.sign({ id: result.rows[0].id }, process.env.JWT_PASSWORD);
        res.json({ token });
      } else {
        res.status(403).json({ message: "Incorrect credentials." });
      }
})

app.post("/api/v1/second-brain/content", userMiddleware, async (req, res) => {
    const { title, link, type } = req.body;
    // await ContentModel.create({
    //     title,
    //     link,
    //     type,
    //     tags: [],
    //     userId: req.userId
    // });
    const userId = req.userId
    try {
        await pool.query(
            'INSERT INTO content (title, link, type, user_id) VALUES ($1, $2, $3, $4)',
            [title, link, type, userId]
        );
        res.json({ message: "content added." });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Failed to add content" });
    }
})


app.get("/api/v1/second-brain/content", userMiddleware, async (req, res) => {
    const userId = req.userId;
    // const content = await ContentModel.find({
    //     userId: userId
    // }).populate("userId", "username");
    try {
        const result = await pool.query(
            `SELECT content.*, users.username 
             FROM content 
             JOIN users ON content.user_id = users.id 
             WHERE content.user_id = $1`,
            [userId]
        );

        res.json({ content: result.rows });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Failed to fetch content" });
    }

    // res.json({
    //     content
    // })
})


app.delete("/api/v1/second-brain/content", userMiddleware, async (req, res) => {
    const contentId = req.body.contentId;
    // await ContentModel.deleteMany({
    //     _id: contentId,
    //     userId: req.userId
    // // })
    // res.json({
    //     message: 'content deleted sucessfully.'
    // })

    
    try {
        await pool.query(
            'DELETE FROM content WHERE id = $1 AND user_id = $2',
            [contentId, req.userId]
        );
        res.json({ message: 'Contents deleted successfully.' });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Failed to delete content' });
    }
})


app.post("/api/v1/second-brain/share", userMiddleware, async (req, res) => {
    const share = req.body.share;
    // const userId = req.userId
    // if (share) {
    //     const hash = random(10)
    //     const existingLink = await LinkModel.findOne({
    //         userId: userId
    //     })
    //     if(existingLink){
    //         res.json({
    //             hash: existingLink.hash
    //         })
    //         return
    //     }
    //     await LinkModel.create({
    //         userId: userId,
    //         hash
    //     })
    //     res.json({
    //         hash
    //     })
    // } else {
    //     await LinkModel.deleteOne({
    //         userId: userId
    //     })
    //     res.json({
    //         message: "removed link."
    //     })
    // }
    const userId = req.userId;

    try {
        if (share) {
            // Check if link already exists
            const result = await pool.query(
                'SELECT hash FROM links WHERE user_id = $1',
                [userId]
            );

            if (result.rows.length > 0) {
                res.json({ hash: result.rows[0].hash });
                return;
            }

            const hash = random(10); // generate random 10-char hash

            await pool.query(
                'INSERT INTO links (user_id, hash) VALUES ($1, $2)',
                [userId, hash]
            );

            res.json({ hash });
        } else {
            // Remove share link
            await pool.query(
                'DELETE FROM links WHERE user_id = $1',
                [userId]
            );

            res.json({ message: "Removed link." });
        }
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Error handling share link' });
    }
})

app.get("/api/v1/second-brain/:sharelink", userMiddleware, async (req, res) => {
    const hash = req.params.sharelink;
    // if(!hash){
    //     res.json({
    //         message: "link is requried."
    //     })
    //     return 
    // }

    // const link = await LinkModel.findOne({
    //     hash
    // });

    // if (!link) {
    //     res.status(411).json({
    //         message: "Incorrect input."
    //     })
    //     return;
    // }

    // const content = await ContentModel.find({
    //     userId: link.userId
    // })

    // const user = await UserModel.findOne({
    //     _id: link.userId
    // })

    // if (!user) {
    //     res.status(411).json({
    //         message: "user not found."
    //     })
    //     return;
    // }
   

    // res.json({
    //     username: user.username,
    //     content: content
    // })
    
    if (!hash) {
        res.status(400).json({ message: "Link is required." });
        return;
    }

    try {
        const linkResult = await pool.query(
            'SELECT user_id FROM links WHERE hash = $1',
            [hash]
        );

        if (linkResult.rows.length === 0) {
            res.status(404).json({ message: "Incorrect input." });
            return;
        }

        const userId = linkResult.rows[0].user_id;

        const contentResult = await pool.query(
            'SELECT * FROM content WHERE user_id = $1',
            [userId]
        );

        const userResult = await pool.query(
            'SELECT username FROM users WHERE id = $1',
            [userId]
        );

        if (userResult.rows.length === 0) {
            res.status(404).json({ message: "User not found." });
            return;
        }

        res.json({
            username: userResult.rows[0].username,
            content: contentResult.rows
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Internal error" });
    }
})

app.get("/api/v1/second-brain/testep", (req, res) => {
	res.json({ message: "IT Works" });

})

// @ts-ignore
app.listen(process.env.PORT, '0.0.0.0', () => {
	// @ts-ignore
    console.log("Listening on port: " + process.env.PORT)
})
