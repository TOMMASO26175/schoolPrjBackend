import express from "express";
import cors from "cors";
import users from "./api/user.route.js";
import admins from "./api/admin.route.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use("/user", users);
app.use("/admin", admins);

app.use("*", (req, res) => res.status(404).json({ error: "not found" }));

export default app;
