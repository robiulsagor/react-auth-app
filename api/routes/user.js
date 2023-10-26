import express from 'express'
import { deleteUser, getAllUsers } from '../controllers/userController.js'
import { isAdmin, isAdminOrCurrentUser, isCurrentUser } from '../middlewares/authMiddleware.js'
const router = express.Router()

router.get("/", (req, res) => {
    res.json("testing user route.")
})
router.get('/all', isAdmin, getAllUsers)
router.delete('/delete/:id', isAdminOrCurrentUser, deleteUser)

export default router