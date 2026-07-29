import { Router } from "express"
import bcrypt from "bcrypt";
import connectToDB from "../db/index.js"
import { authorizeMiddleware } from "../middleware/authorize.js"

const router = Router()

// Select all chats from a logged in user
router.get("/get", authorizeMiddleware, async (req, res) => {
    // Get the user id
    const userId = req.session.userId

    try {
        const db = connectToDB()

        // Then select all the chats with that user id
        const [rows] = await db.query("SELECT * FROM chats WHERE user_id = ?", [userId])
        return res.json(rows) 
    }

    catch(error) {
        res.status(500).json(error)
    }
})


// Add a new chat for a logged in user
router.post("/add", authorizeMiddleware, async (req, res) => {
    // Get the user id
    const userId = req.session.userId

    // Get chat title
    const title = req.body.title?.trim() ? req.body.title.trim() : "New Chat"

    try {
        const db = connectToDB()

        // Then add a new chat
        await db.query("INSERT INTO chats (`user_id`, `title`) VALUES (?, ?)", [userId, title])
        return res.status(200).json({message: "A new chat was created!"})
    }

    catch(error) {
        res.status(500).json(error)
    }
})


export default router