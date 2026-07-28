import express from "express"
import mysql from "mysql2"
import cors from "cors"
import dotenv from "dotenv"

dotenv.config()

const app = express()

const db = mysql.createConnection({
    host:"localhost",
    user:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    database:"chatbottest"
})

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

app.get("/test", (req, res) => {
    res.json("hello")
})

app.listen(8000, () => {
    console.log("Connected to backend!")
})