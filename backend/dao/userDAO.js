import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/model.user.js";

export default class UserDAO {
  static async initDB() {
    try {
      mongoose.connect(process.env.DB_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
      });
      console.log("connected to db");
    } catch (error) {
      console.error(error);
    }
  }
  //FOR TESTING ONLY (ATM)
  static async usList(req,res){
    User.find({}, function(err, users) {
      var userMap = {};
  
      users.forEach(function(user) {
        userMap[user._id] = user;
      });
  
      res.send(userMap);  
    });
  }

  static async signUp(req, res) {
    const user = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      role: req.body.role,
      password: bcrypt.hashSync(req.body.password, 8),
    });

    user.save((err, user) => {
      if (err) {
        res.status(500).send({
          message: err,
        });
        return;
      } else {
        res.status(200).send({
          message: "User Registered successfully",
        });
      }
    });
  }

  static async signIn(req, res) {
    User.findOne({
      email: req.body.email,
    }).exec((err, user) => {
      if (err) {
        res.status(500).send({
          message: err,
        });
        return;
      }
      if (!user) {
        return res.status(404).send({
          message: "User Not found.",
        });
      }

      var passwordIsValid = bcrypt.compareSync(req.body.password,user.password);

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      var token = jwt.sign(
        {id: user.id},
        process.env.API_KEY,
        {expiresIn: 86400,}
      );

      res.status(200).send({
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
        },
        message: "Login successful",
        accessToken: token,
      });
      //console.log(`token: ${token}`)

    });
  }
}
