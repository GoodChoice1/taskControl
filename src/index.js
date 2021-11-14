const express = require("express");
const http = require("http");
const cors = require("cors");
const { initDB, getTask } = require("./dataBase");
const app = express();
const apiTaskController = require("./controllers/api-task.controller");
const apiOrgsController = require("./controllers/api-orgs.controller");

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

initDB();

app.use((req, _res, next) => {
  console.log("URL = ", req.url);
  console.log("Original_URL = ", req.originalUrl);
  console.log("METHOD = ", req.method);
  console.log("HOST = ", req.headers.host);
  console.log("IsSecure = ", req.secure);
  console.log("BODY", req.body);
  console.log("QUERY", req.query);
  next();
});

app.use("/api/task", apiTaskController);
app.use("/api/orgs", apiOrgsController);

http.createServer(app).listen(3000, () => {
  console.log("Server is working on port 3000");
});