import express from "express"
import verifyToken from "../jwt/authJWT.js"
const router = express.Router()

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
router.route("/").get( (req,res) => {
    var usr = verifyToken(req, res)
    console.log(usr)

})

export default router