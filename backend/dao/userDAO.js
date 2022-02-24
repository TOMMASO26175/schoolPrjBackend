import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import User from "../models/model.user.js";
import Subscriptions from "../models/model.subscriptions.js";

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

  static async usListSub(req,res){
    Subscriptions.find({}, function(err, sub) {
      var subMap = {};
  
      sub.forEach(function(subId) {
        subMap[subId._id] = subId;
      });
  
      res.send(subMap);  
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

  //LOGGED USER FUNCTIONS

  static async checkSubscription(user,res,returnSub,cb){
    const sub = user.subscription 
    if(!sub){
      return cb(false)
    }
    cb(true)
    if(returnSub){
      Subscriptions.findById(sub._id,(err,obj) =>{
        if(err){
          console.log(err)
        }
        return res.status(200).send({
          message: "Here's your subscription!",
          data:{
            _id: obj._id,
            renewalDate: obj.renewalDate,
            type: obj.type
          }
        })
      })
    }
  }

  static async getDate(){
    let date = new Date()
    return date.getFullYear().toString() + "-" + (date.getMonth()+1).toString() + "-" + (date.getDate()+1).toString()
  }

  static async createSubscription(req,res,user){
    const sub = new Subscriptions({
      renewalDate: req.body.renewalDate || await this.getDate(),
      type: req.body.type,
    });
    

    const filter = { email: user.email };
    const update = { subscription: sub._id};

    sub.save((err, user) => {
      if (err) {
        res.status(500).send({
          message: err,
        });
        return;
      } else {
        User.updateOne(filter, 
          update, function (err, docs) {
          if (err){
              console.log(err)
          }
          else{
              console.log("USER | Updated : ", docs.modifiedCount);
          }
        });
        res.status(200).send({
          message: "User Subscribed successfully",
        });
      }
    });
  }

  static async deleteSub(user,res){
    const filter = { email: user.email };
    const update = { subscription: null};
    User.updateOne(filter, 
      update, function (err, docs) {
      if (err){
          console.log(err)
      }
      else{
          console.log("USER | Updated : ", docs.modifiedCount);
      }
    });
    Subscriptions.deleteOne(user.subscription,function(err,docs){
      if(err){
        console.log(err)
      }else{
        console.log("SUBSCRIPTIONS | Deleted : ", docs.deletedCount)
      }
  
    })

    res.status(200).send({
      message: "Subscription deleted successfully",
    });

  }

  static async updateSub(req,res,user){
    const filter = {
      _id: user.subscription
    }
    const update = {
      renewalDate: await this.getDate(),
      type: req.body.type
    }
    Subscriptions.updateOne(filter,update,function(err,docs){
      if(err){
        console.log(err)
      }else{
        console.log("SUBSCRIPTIONS | Updated : ", docs.modifiedCount)
      }
  
    })

    res.status(200).send({
      message: "Subscription updated successfully",
    });

  }
}
