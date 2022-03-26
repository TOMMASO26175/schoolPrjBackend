import express from "express";
import AdminDao from "../dao/adminDAO.js";
import verifyToken from "../jwt/authJWT.js";

const router = express.Router();
router.route("/list").get(AdminDao.usList);
router.route("/sublist").get(AdminDao.usListSub);

router.route("/").get((req, res) => {
  verifyToken(req, res, function (user) {
    if (!user) {
      res.status(403).send({ message: "Invalid JWT token" });
    }
    if (user.role == "admin") {
      res.status(200).send({
        message: "Admin Panel",
      });
    } else {
      res.status(403).send({
        message: "Unauthorized access",
      });
    }
  });
});

export default router;
