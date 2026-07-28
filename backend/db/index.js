import mysql from "mysql2/promise"
import dotenv from "dotenv"

dotenv.config()

const connectToDB = () => {
    const db = mysql.createPool({
        host:"localhost",
        user:process.env.DB_USERNAME,
        password:process.env.DB_PASSWORD,
        database:"chatbottest"
    })
    return db
}

export default connectToDB