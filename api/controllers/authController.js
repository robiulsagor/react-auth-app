import jwt from "jsonwebtoken"

import bcrypt from "bcrypt"
const saltRounds = 10;
import User from "../models/user.js"
import { errorHandler } from "../middlewares/error.js";

const registerUser = async (req, res, next) => {
    const { username, email, password } = req.body

    if (!username | !email | !password) {
        return next(errorHandler(502, "All fields are required!"))
    }

    const userExits = await User.findOne({ username })
    if (userExits) {
        return next(errorHandler(403, "Username already exists!"))
    }

    const emailExits = await User.findOne({ email })
    if (emailExits) {
        return next(errorHandler(403, "Email already exists!"))
    }

    try {
        const hasedPass = bcrypt.hashSync(password, 10)
        const user = await User.create({ username, email, password: hasedPass })
        return res.status(201).json({ message: "User created", user, success: true })
    } catch (error) {
        return next(errorHandler(500, "Something went wrong."))
    }
}

const loginUser = async (req, res, next) => {
    const { email, password } = req.body

    if (!email | !password) {
        return next(errorHandler(500, "All fields are required!"))
    }

    const user = await User.findOne({ email })

    if (!user) return next(errorHandler(500, "User not found!"))

    const checkPass = bcrypt.compareSync(password, user.password)

    if (checkPass === true) {
        const token = jwt.sign({ username: user.username, email: user.email, id: user._id, role: user.role },
            process.env.JWT_SECRET);

        const { password: hasedPass, ...userData } = user._doc

        return res.status(200).cookie("token", token,
            { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 })
            .status(200)
            .json({ message: "User  found!", userData, success: true })
    } else {
        return next(errorHandler(403, "Username or Password wrong!"))
    }
}

const googleAuth = async (req, res, next) => {
    const { displayName, email, photoURL } = req.body

    try {
        const user = await User.findOne({ email })
        if (user) {
            const token = jwt.sign({ username: user.username, email: user.email, id: user._id, role: user.role },
                process.env.JWT_SECRET);

            const { password: hasedPass, ...userData } = user._doc

            return res.status(200).cookie("token", token,
                { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 })
                .status(200)
                .json({ message: "User  found!", userData, success: true })
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)

            const generatedUsername = displayName.split(" ").join("").toLowerCase() + Math.floor(Math.random() * 10000)

            const hashedPass = bcrypt.hashSync(generatedPassword, 10)

            const newUser = new User({ username: generatedUsername, email, password: hashedPass, profilePicture: photoURL })
            // await newUser.save()

            const token = jwt.sign({ username: newUser.username, email: newUser.email, id: newUser._id, role: newUser.role },
                process.env.JWT_SECRET);

            const { password: pass, ...userData } = newUser._doc


            return res.status(200).cookie("token", token,
                { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 })
                .status(200)
                .json({ message: "User created!", userData, success: true })
        }
    } catch (error) {
        return next(errorHandler(500, error.message))
    }
}

export { registerUser, loginUser, googleAuth }