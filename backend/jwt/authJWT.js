import jwt from "jsonwebtoken"
import User from "../models/model.user.js"
//WIP
export default function verifyToken(req, res){
  jwt.verify(req.body.authorization,process.env.API_KEY, function (err,decode){
    if (err){
      res.status(500).send({message: err})
      return
    }
    User.findOne({_id: decode.id}, function(err,usr){
      if (err) {
        res.status(500).send({message: err})
        return
      }
      console.log(usr)
      return usr
    })
  })
}
