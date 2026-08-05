import { Router } from "express"
import connectToDB from "../db/index.js"
import { authorizeMiddleware } from "../middleware/authorize.js"
import { chatbot } from "../ai/get_ai_response.js"

const router = Router()

// Select all messages from a specific, selected chat
router.get("/get/:id", authorizeMiddleware, async (req, res) => {
    // Get the user id
    const userId = req.session.userId

    // Get the chat id
    const chatId = req.params.id

    try {
        const db = connectToDB()

        // First see if the selected chat has the same user id as the current logged in user
        const [selectedChat] = await db.query(
            `SELECT * FROM chats 
            INNER JOIN users ON users.id = chats.user_id 
            WHERE chats.id = ? AND users.id = ?`,
            [chatId, userId]
        )

        // If the user is attempting to gets messages from a chat that does not belong to the current user, send an error message
        if(selectedChat.length === 0) {
            return res.status(404).json({message: "Cannot get messages from a chat that does not belong to the current user."})
        }

        // Then select all the messages from the selected chat from a logged in user
        const [allMessages] = await db.query(`SELECT * FROM messages WHERE messages.chat_id = ?`, [chatId])
        return res.json(allMessages) 
    }

    catch(error) {
        res.status(500).json(error)
    }
})


// Add and save a new user message to the selected chat
router.post("/add_user_question/:id", authorizeMiddleware, async (req, res) => {
    // Get the user id
    const userId = req.session.userId

    // Get the chat id
    const chatId = req.params.id

    // Get the content
    const content = req.body.content

    try {
        const db = connectToDB()

        // First see if the selected chat has the same user id as the current logged in user
        const [selectedChat] = await db.query(
            `SELECT * FROM chats 
            INNER JOIN users ON users.id = chats.user_id 
            WHERE chats.id = ? AND users.id = ?`,
            [chatId, userId]
        )

        // If the user is attempting to add a message to a chat that does not belong to the current user, send an error message
        if(selectedChat.length === 0) {
            return res.status(404).json({message: "Cannot add a new message to a chat that does not belong to the current user."})
        }

        // Then, add the new message
        const [result] = await db.query("INSERT INTO messages (chat_id, role, content) VALUES (?, ?, ?)", [chatId, "user", content])

        // Finally, get back the newely added message and return that back
        const newMessage = await db.query("SELECT * FROM messages WHERE id = ?", [result.insertId])
        return res.status(201).json(newMessage[0])
    }

    catch(error) {
        res.status(500).json(error)
    }
})


// Get a response from the AI chatbot based on the previous chat history of the selected chat, then save that response afterwards
// It is assumed that the above route was ran before this one meaning the latest message will be a question from the user
router.post("/add_AI_response/:id", authorizeMiddleware, async (req, res) => {
    // Get the user id
    const userId = req.session.userId

    // Get the chat id
    const chatId = req.params.id

    try {
        const db = connectToDB()

        // First see if the specified chat has the same user id as the current logged in user
        const [selectedChat] = await db.query(
            `SELECT * FROM chats 
            INNER JOIN users ON users.id = chats.user_id 
            WHERE chats.id = ? AND users.id = ?`,
            [chatId, userId]
        )

        // If the user is attempting to add a message to a chat that does not belong to the current user, send an error message
        if(selectedChat.length === 0) {
            return res.status(404).json({message: "Cannot add a new message to a chat that does not belong to the current user."})
        }

        // Get the message history of the specified chat
        const [chatHistory] = await db.query(
            `SELECT messages.role, messages.content FROM messages 
            INNER JOIN chats ON chats.id = messages.chat_id
            WHERE messages.chat_id = ?
            ORDER BY messages.created_at ASC`,
            [chatId]
        )

        // Provide this message history to the chatbot and get a response back
        const ai_response = await chatbot(chatHistory)

        // Then, add the ai_response to the database
        const [result] = await db.query("INSERT INTO messages (chat_id, role, content) VALUES (?, ?, ?)", [chatId, "assistant", ai_response])
        
        // Finally, get back the newely added message and return that back
        const [newMessage] = await db.query("SELECT * FROM messages WHERE id = ?", [result.insertId])
        return res.status(201).json(newMessage[0])
    }

    catch(error) {
        res.status(500).json(error)
    }
})


export default router