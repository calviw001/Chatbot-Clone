import { Router } from "express";
import bcrypt from "bcrypt";
import connectToDB from "../db/index.js";
import { authorizeMiddleware } from "../middleware/authorize.js";

const router = Router();

// Select all chats from a logged in user
router.get("/get", authorizeMiddleware, async (req, res) => {
  // Get the user id
  const userId = req.session.userId;

  try {
    const db = connectToDB();

    // Then select all the chats with that user id
    const [allChats] = await db.query(
      "SELECT * FROM chats WHERE user_id = ? ORDER BY created_at DESC",
      [userId],
    );
    return res.json(allChats);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Select just a selected chat from the user
router.get("/get/:id", authorizeMiddleware, async (req, res) => {
  // Get the chat id
  const chatId = req.params.id;

  // Get the user id
  const userId = req.session.userId;

  try {
    const db = connectToDB();

    // Then select the just the selected chat
    const [selectedChat] = await db.query(
      "SELECT * FROM chats WHERE id = ? AND user_id = ?",
      [chatId, userId],
    );
    return res.json(selectedChat);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Add a new chat for a logged in user
router.post("/add", authorizeMiddleware, async (req, res) => {
  // Get the chat id
  const chatId = req.params.id;

  // Get the user id
  const userId = req.session.userId;

  // Get chat title
  const title = req.body.title?.trim() ? req.body.title.trim() : "New Chat";

  try {
    const db = connectToDB();

    // Then add a new chat
    const [result] = await db.query(
      "INSERT INTO chats (`user_id`, `title`) VALUES (?, ?)",
      [userId, title],
    );
    return res.status(201).json({ chatId: result.insertId });
  } catch (error) {
    res.status(500).json(error);
  }
});

// Delete a selected chat from a logged in user
router.delete("/delete/:id", authorizeMiddleware, async (req, res) => {
  // Get the chat id
  const chatId = req.params.id;

  // Get the user id
  const userId = req.session.userId;

  try {
    const db = connectToDB();

    // Then delete the chat
    const [deletedChat] = await db.query(
      "DELETE FROM chats WHERE id = ? AND user_id = ?",
      [chatId, userId],
    );

    // Send a failure message if nothing was deleted
    if (!deletedChat.affectedRows || deletedChat.affectedRows === 0) {
      return res.status(404).json({ message: "Chat failed to delete." });
    }
    return res.status(200).json({ message: "Chat was deleted." });
  } catch (error) {
    res.status(500).json(error);
  }
});

export default router;
