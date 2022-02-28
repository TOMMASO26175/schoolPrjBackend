import app from "./server.js";
import dotenv from "dotenv";
import userDao from "./dao/userDAO.js";
dotenv.config();

const port = process.env.PORT || 8000;

app.listen(port, () => {
  userDao.initDB();
  console.log(`Listening on port ${port}`);
});
