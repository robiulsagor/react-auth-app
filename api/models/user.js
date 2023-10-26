import mongoose from "mongoose";

const UserType = {
    USER: 'user',
    MODERATOR: 'moderator',
    ADMIN: 'admin'
}

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
    role: {
        type: String,
        enum: Object.values(UserType),
        default: UserType.USER
    },
    profilePicture: {
        type: String,
        default: ""
    }
}, { timestamps: true })

const User = mongoose.model("User", userSchema)

export default User