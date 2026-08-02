import { Router } from "express"
import bcrypt from "bcrypt";
import connectToDB from "../db/index.js"
import { authorizeMiddleware } from "../middleware/authorize.js"

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
            return res.status(409).json({message: "A user associated with this email already exists."})
        }

        // Hash the user's password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Then add that new user into the database
        await db.query("INSERT INTO users (`username`, `email`, `password`) VALUES (?, ?, ?)", [username, email, hashedPassword])
        return res.status(201).json({message: "User has successfully signed up!"})
    } 

    catch(error) {
        res.status(500).json(error)
    }
})


// User login route
router.post('/login', async (req, res) => {
    // Get the user's entered in username, email, and password
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password

    try {
        const db = connectToDB()

        // If user does not exists, then don't log them in
        const [rows] = await db.query('SELECT * FROM users WHERE username = ? AND email = ?', [username, email])
        if(rows.length === 0) {
            return res.status(404).json({message: "There is no user associated with this username and email."})
        }

        // Also make sure that the password matches
        const checkPassword = await bcrypt.compare(password, rows[0].password)
        if(!checkPassword) {
            return res.status(401).json({message: "Incorrect password."})
        }

        // Create the user session
        req.session.userId = rows[0].id;
        req.session.userName = username;
        
        return res.status(200).json({userId: rows[0].id, username: username})
    } 

    catch(error) {
        res.status(500).json(error)
    }
})


// User logout route
router.post('/logout', (req, res) => {
    // Destory the user session
    req.session.destroy((error) => {
        if(error) {
            return res.status(500).json({message: "Logout failed."})
        }
        res.clearCookie('connect.sid');
        return res.status(200).json({message: "User has successfully logged out!"})
    })
})


// Return session information if the user is logged in 
router.get("/user", authorizeMiddleware, (req, res) => {
    return res.json({
        userId: req.session.userId,
        username: req.session.userName
    })
})

export default router