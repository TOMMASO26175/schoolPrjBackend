import express from "express"
import UserDAO from "../dao/userDAO.js"
const router = express.Router()

router.route("/register").post(UserDAO.signUp)
router.route("/login").post(UserDAO.signIn)
router.route("/list").get(UserDAO.usList)

export default router