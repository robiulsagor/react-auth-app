import jwt from "jsonwebtoken"

import bcrypt from "bcrypt"
const saltRounds = 10;
import User from "../models/user.js"

const registerUser = async (req, res) => {
    const { username, email, password } = req.body

    if (!username | !email | !password) {
        console.log("All fields are required!");
        return res.json("All fields are required!")
    }

    const userExits = await User.findOne({ username })
    if (userExits) {
        return res.status(403).json({ msg: "Username already exists!", status: "failed" })
    }

    const emailExits = await User.findOne({ email })
    if (emailExits) {
        return res.status(403).json({ msg: "Email already exists!", status: "failed" })
    }

    try {
        bcrypt.hash(password, saltRounds, async function (err, hash) {
            // Store hash in your password DB.
            const user = await User.create({ username, email, password: hash })
            return res.status(201).json({ msg: "User created", user, status: "success" })
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Something went wrong.", status: "failed" })
    }
}

const loginUser = async (req, res) => {
    const { username, email, password } = req.body

    if ((!username && !email) | !password) {
        console.log("All fields are required!");
        return res.json("All fields are required!")
    }

    let user

    username ? user = await User.findOne({ username }) : user = await User.findOne({ email })

    if (!user) {
        return res.status(401).json({ msg: "User not found!", status: "failed" })
    } else {

        bcrypt.compare(password, user.password, function (err, result) {
            if (result === true) {
                const token = jwt.sign({ username: user.username, email: user.email, id: user._id, role: user.role },
                    process.env.JWT_SECRET);

                return res.cookie("token", token,
                    { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 })
                    .status(200)
                    .json({ msg: "User  found!", user, status: "success" })
            } else {
                return res.status(403).json({ msg: "Username or Password wrong!", status: "failed" })
            }
        });

    }
}

export { registerUser, loginUser }