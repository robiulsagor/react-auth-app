import { errorHandler } from '../middlewares/error.js';
import User from '../models/user.js'

const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find()
        return res.status(200).json({ message: "Successful", users, success: true })
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error...", status: "failed", error: error.message })
    }
}

const deleteUser = async (req, res, error) => {
    const { id } = req.params
    try {
        const user = await User.deleteOne({ _id: id })
        return res.status(200).json({ message: "User deleted", user, success: true })
    } catch (error) {
        return res.status(500).json({ message: "User can't be deleted", error: error.message, success: false })
        next(error)
    }
}

export { getAllUsers, deleteUser }