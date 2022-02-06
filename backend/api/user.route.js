import express from "express"
import UserDAO from "../dao/userDAO.js"
import verifyToken from "../jwt/authJWT.js"
const router = express.Router()

router.route("/register").post(UserDAO.signUp)
router.route("/login").post(UserDAO.signIn)
router.route("/list").get(UserDAO.usList)

router.get('/home',function(req,res){
    verifyToken(req,res,function(cb){
        var user = cb
        UserDAO.checkSubscription(user,res)
    })
})

export default router