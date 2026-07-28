import { Router } from "express"
import bcrypt from "bcrypt";
import connectToDB from "../db/index.js"

const router = Router()

// User sign up route
router.post('/signup', async (req, res) => {
    // Get the user's entered in username, email, and password
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password

    try {
        const db = connectToDB()

        // If this user already exists, then don't them sign in
        const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email])
        if(rows.length > 0) {
            return res.json({message: "A user associated with this email already exists."})
        }

        // Hash the user's password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Then add that new user into the database
        await db.query("INSERT INTO users (`username`, `email`, `password`) VALUES (?, ?, ?)", [username, email, hashedPassword])
        return res.status(201).json({message: "User has successfully signed in!"})
    } 

    catch(error) {
        res.status(500).json(error)
    }
})

export default router