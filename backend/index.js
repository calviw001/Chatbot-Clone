import express from "express"
import session from "express-session"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()

app.use(express.json({limit: "16kb"})); // Support the json in my application so that anyone can send me json data

// cors configurations
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || ["http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type"],
  })
);

// express-session configurations
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,   // Only transmit cookie over https and not localhost if true (set to true for production)
      httpOnly: true,  // Prevent client side JS from reading the cookie
      maxAge: 1000 * 60 * 30
    }
  })
)

// import routes
import authRouter from "./routes/auth.routes.js"
import chatsRouter from "./routes/chats.routes.js"
import messagesRouter from "./routes/messages.routes.js"

app.use("/auth", authRouter)
app.use("/chats", chatsRouter)
app.use("/chats/messages", messagesRouter)

app.get("/test", (req, res) => {
    res.json("hello")
})

app.listen(8000, () => {
    console.log("Connected to backend!")
})