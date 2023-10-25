import jwt from "jsonwebtoken";

// only admin can access
const isAdmin = async (req, res, next) => {
    const { token } = req.cookies

    if (!token) {
        return res.json({ msg: "You are not authenticated!", status: "failed" })
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET)

    if (decode.role == "admin") {
        req.user = user
        next()
    } else {
        return res.json({ msg: "You are not allowed to go!", status: "failed" })
    }
}

// only the current user can access
const isCurrentUser = async (req, res, next) => {
    const { token } = req.cookies
    const { id } = req.params

    if (!token) {
        return res.json({ msg: "You are not authenticated!", status: "failed" })
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET)

    if (decode.id === id) {
        req.user = decode
        next()
    } else {
        return res.json({ msg: "This is not your account! Delete your own account, not others'", status: "failed" })
    }
}

// current user or the admin can access
const isAdminOrCurrentUser = async (req, res, next) => {
    const { token } = req.cookies
    const { id } = req.params

    if (!token) {
        return res.json({ msg: "You are not authenticated!", status: "failed" })
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET)

    if (decode.id === id || decode.role === "admin") {
        req.user = decode
        next()
    } else {
        return res.json({ msg: "This is not your account! Delete your own account, not others'", status: "failed" })
    }
}

export { isAdmin, isCurrentUser, isAdminOrCurrentUser }