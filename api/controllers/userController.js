import User from '../models/user.js'

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
        // const { password, ...others } = users
        return res.json({ msg: "Successful", users, status: "success" })
    } catch (error) {
        console.log(error);
        return res.json({ msg: "Error...", status: "failed" })
    }
}

const deleteUser = async (req, res) => {
    const { id } = req.params
    try {
        const user = await User.deleteOne({ _id: id })
        return res.json({ msg: "User deleted", user })
    } catch (error) {
        return res.json({ msg: "User can't be deleted" })
    }
}

export { getAllUsers, deleteUser }