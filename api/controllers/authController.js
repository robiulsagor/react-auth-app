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
        const user = await User.create({ username, email, password })
        return res.status(201).json({ msg: "User created", user, status: "success" })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ msg: "Something went wrong.", status: "failed" })
    }
}

export { registerUser }