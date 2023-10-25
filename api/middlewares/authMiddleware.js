import jwt from "jsonwebtoken";

const isAdmin = async (req, res, next) => {
    const { token } = req.cookies

    if (!token) {
        return res.json({ msg: "You are not authenticated!", status: "failed" })
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET)

    if (decode.role == "admin") {
        next()
    } else {
        return res.json({ msg: "You are not allowed to go!", status: "failed" })
    }
}

export { isAdmin }