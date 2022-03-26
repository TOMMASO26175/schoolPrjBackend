import User from "../models/model.user.js";
import Subscriptions from "../models/model.subscriptions.js";

export default class AdminDao {
  static async usList(req, res) {
    verifyToken(req, res, function (user) {
      if (!user) {
        res.status(403).send({ message: "Invalid JWT token" });
      }
      if (user.role == "admin") {
        User.find({}, function (err, users) {
          var userMap = {};

          users.forEach(function (user) {
            userMap[user._id] = user;
          });

          res.send(userMap);
        });
      } else {
        res.status(403).send({
          message: "Unauthorized access",
        });
      }
    });
  }

  static async usListSub(req, res) {
    verifyToken(req, res, function (user) {
      if (!user) {
        res.status(403).send({ message: "Invalid JWT token" });
      }
      if (user.role == "admin") {
        Subscriptions.find({}, function (err, sub) {
          var subMap = {};

          sub.forEach(function (subId) {
            subMap[subId._id] = subId;
          });

          res.send(subMap);
        });
      } else {
        res.status(403).send({
          message: "Unauthorized access",
        });
      }
    });
  }
}
