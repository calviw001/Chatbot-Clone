import { Router } from "express"
import bcrypt from "bcrypt";
import connectToDB from "../db/index.js"
import { authorizeMiddleware } from "../middleware/authorize.js"

const router = Router()

// Select all messages from a specific chat
router.get("/get/:id", authorizeMiddleware, async (req, res) => {
    // Get the user id
    const userId = req.session.userId

    // Get the chat id
    const chatId = req.params.id

    try {
        const db = connectToDB()

        // Then select all the messages from the selected chat from a logged in user
        const [rows] = await db.query(
            `SELECT * FROM messages 
            INNER JOIN chats ON chats.id = messages.chat_id 
            INNER JOIN users ON users.id = chats.user_id 
            WHERE messages.chat_id = ? AND users.id = ?`,
            [chatId, userId]
        )
        return res.json(rows) 
    }

    catch(error) {
        res.status(500).json(error)
    }
})

export default router