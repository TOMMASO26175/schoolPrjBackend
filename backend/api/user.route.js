import express from "express"
import UserDAO from "../dao/userDAO.js"
//import verifyToken from "../jwt/authJWT.js"
const router = express.Router()

router.route("/register").post(UserDAO.signUp)
router.route("/login").post(UserDAO.signIn)

router.route("/list").get(UserDAO.usList)


//WIP
/*router.get("/admin",verifyToken, function(req,res){
    if (!user) {
        res.status(403)
          .send({
            message: "Invalid JWT token"
          });
      }
      if (req.user == "admin") {
        res.status(200)
          .send({
            message: "Logging into admin session"
          });
      } else {
        res.status(403)
          .send({
            message: "Unauthorised access"
          });
      }    
})*/

export default router