const { Router } = require("express");
const Tasks = require("../dataBase/models/Tasks.model");



const router = Router();

function initRoutes() {
  router.get("/", getTask);
}








async function getTask(req, res, next) {
    let tasks = await Tasks.findAll();
    res.status(200).json(tasks);
  }

initRoutes();

module.exports = router;