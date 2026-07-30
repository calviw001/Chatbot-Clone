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


// Add a new message to the specified chat
router.post("/add/:id", authorizeMiddleware, async (req, res) => {
    // Get the user id
    const userId = req.session.userId

    // Get the chat id
    const chatId = req.params.id

    // Get the role and content
    const role = req.body.role
    const content = req.body.content

    try {
        const db = connectToDB()

        // First see if the specified chat has the same user id as the current logged in user
        const [rows] = await db.query(
            `SELECT * FROM chats 
            INNER JOIN users ON users.id = chats.user_id 
            WHERE chats.id = ? AND users.id = ?`,
            [chatId, userId]
        )

        // If the user is attempting to add a message to a chat that does not belong to the current user, send an error message
        if(rows.length === 0) {
            return res.status(404).json({message: "Cannot add a new message to a chat that does not belong to the current user."})
        }

        // Then, add the new message
        await db.query("INSERT INTO messages (chat_id, role, content) VALUES (?, ?, ?)", [chatId, role, content])
        return res.status(201).json({message: "A new message was added to the current chat!"})
    }

    catch(error) {
        res.status(500).json(error)
    }
})


export default router