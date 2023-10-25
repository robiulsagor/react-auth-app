import express from 'express'
import { deleteUser, getAllUsers } from '../controllers/userController.js'
const router = express.Router()

router.get("/", (req, res) => {
    res.json("testing user route.")
})

router.get('/all', getAllUsers)
router.delete('/delete/:id', deleteUser)

export default router