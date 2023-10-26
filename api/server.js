import express from 'express'
import dotenv from "dotenv"
import mongoose from 'mongoose'
import cookieParser from 'cookie-parser'
import path from 'path'
const app = express()
dotenv.config()

const PORT = process.env.PORT | 5000
const DB_URI = process.env.MONGO_URI

import userRoutes from "./routes/user.js"
import authRoute from "./routes/auth.js"

const __dirname = path.resolve()
app.use(express.static(path.join(__dirname, '/client/dist')))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"))
})

app.use(express.json())
app.use(cookieParser(process.env.COOKIE_SECRET))


app.use('/api/user', userRoutes)
app.use('/api/auth', authRoute)

mongoose.connect(DB_URI)
    .then(() => console.log("Connected"))
    .catch(err => console.log("Not connected! ", err))

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})

// error handler
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error!"

    return res.status(statusCode).json({
        success: false,
        message,
        statusCode
    })
})