import { errorHandler } from '../middlewares/error.js';
import User from '../models/user.js'
import bcrypt from 'bcrypt'

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

// update user funtion
const updateUser = async (req, res, next) => {
    let { profilePicture, username, email, password } = req.body
    const id = req.params.id

    try {
        let updatedUser;

        if (password) {
            const hasedPass = bcrypt.hashSync(password, 10)
            updatedUser = await User.findByIdAndUpdate(id,
                {
                    $set: {
                        profilePicture, username, email, password: hasedPass
                    }
                }, { new: true })
        } else {
            updatedUser = await User.findByIdAndUpdate(id,
                {
                    $set: {
                        profilePicture, username, email
                    }
                }, { new: true })
        }
        const { password: pass, ...rest } = updatedUser._doc

        return res.status(200).json({ message: "Successfully updated user!", rest, success: true })

    } catch (error) {
        console.log(error);
        next(errorHandler(500, "Can't update user!"))
    }

}

export { getAllUsers, deleteUser, updateUser }