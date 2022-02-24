import express from "express";
import UserDAO from "../dao/userDAO.js";
import verifyToken from "../jwt/authJWT.js";
const router = express.Router();

router.route("/register").post(UserDAO.signUp);
router.route("/login").post(UserDAO.signIn);
router.route("/list").get(UserDAO.usList);
router.route("/sublist").get(UserDAO.usListSub);
//WIP
router.get("/home", function (req, res) {
  verifyToken(req, res, function (cb) {
    var user = cb;
    UserDAO.checkSubscription(user, res, true, function (sub) {
      if (!sub) {
        res.status(200).send({
          message: "You don't have a subscription, APPLY NOW!",
        });
      }
    });
  });
});

router.post("/subscribe", function (req, res) {
  verifyToken(req, res, function (cb) {
    var user = cb;
    UserDAO.checkSubscription(user, res, false, function (sub) {
      if (!sub) {
        UserDAO.createSubscription(req, res, user);
      } else {
        res.status(200).send({
          message: "You already got a subscription",
        });
      }
    });
  });
});

router.delete("/deletesub", function (req, res) {
  verifyToken(req, res, function (cb) {
    var user = cb;
    UserDAO.checkSubscription(user, res, false, function (sub) {
      if (!sub) {
        res.status(200).send({
          message: "You don't have a subscription to delete",
        });
      } else {
        UserDAO.deleteSub(user, res);
      }
    });
  });
});

router.put("/updatesub", function (req, res) {
  verifyToken(req, res, function (cb) {
    var user = cb;
    UserDAO.checkSubscription(user, res, false, function (sub) {
      if (!sub) {
        res.status(200).send({
          message: "You don't have a subscription to update",
        });
      } else {
        UserDAO.updateSub(req, res, user);
      }
    });
  });
});

export default router;
