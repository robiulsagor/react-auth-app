import express from 'express'
import dotenv from "dotenv"
import mongoose from 'mongoose'
const app = express()
dotenv.config()

const PORT = process.env.PORT | 5000
const DB_URI = process.env.MONGO_URI

app.get("/", (req, res) => {
    res.json({ msg: "You are testing this endpoint, right?" })
})

mongoose.connect(DB_URI)
    .then(() => console.log("Connected"))
    .catch(err => console.log("Not connected! ", err))

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})