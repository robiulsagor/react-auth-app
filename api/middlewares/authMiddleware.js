import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";

// only admin can access
const isAdmin = async (req, res, next) => {
    const { token } = req.cookies

    if (!token) {
        return next(errorHandler(401, "You are not authenticated! error"))
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET)

    if (decode.role == "admin") {
        req.user = decode
        next()
    } else {
        return next(errorHandler(401, "You are not allowed to go!"))
    }
}

// only the current user can access
const isCurrentUser = async (req, res, next) => {
    const { token } = req.cookies
    const { id } = req.params

    if (!token) {
        return next(errorHandler(401, "You are not authenticated!"))
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET)

    if (decode.id === id) {
        req.user = decode
        next()
    } else {
        return next(errorHandler(403, "This is not your account! Delete your own account, not others'"))
    }
}

// current user or the admin can access
const isAdminOrCurrentUser = async (req, res, next) => {
    const { token } = req.cookies
    const { id } = req.params

    if (!token) {
        return next(errorHandler(401, "You are not authenticated!"))
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET)

    if (decode.id === id || decode.role === "admin") {
        req.user = decode
        next()
    } else {
        return next(errorHandler(403, "This is not your account! Delete your own account, not others'"))
    }
}

export { isAdmin, isCurrentUser, isAdminOrCurrentUser }