const { Router } = require("express");
const ErrorResponse = require("../classes/error-response");
const Tasks = require("../dataBase/models/Tasks.model");
const { asyncHandler } = require("../middlewares/middlewares");

const router = Router();

function initRoutes() {
  router.get("/", asyncHandler(getAllTasks));
  router.get("/:id", asyncHandler(getTaskById));
  router.post("/", asyncHandler(createTask));
}

async function getAllTasks(req, res, next) {
  let task_list = await Tasks.findAll();
  if (task_list.length == 0) throw new ErrorResponse("Тасков нет", 404);
  res.status(200).json(task_list);
}

async function getTaskById(req, res, next) {
  let task = await Tasks.findByPk(req.params.id);
  if (!task) throw new ErrorResponse("Таска нет", 404);
  res.status(200).json(task);
}

async function createTask(req, res, next) {
  let task = await Tasks.create({
    person_id_performer: req.headers.person_id_performer,
    person_id_author: req.headers.person_id_author,
    contact_person_id: req.headers.contact_person_id,
    contract_number: req.headers.contract_number,
    task: req.headers.task,
    priority: req.headers.priority,
    creation_date: req.headers.creation_date,
    expiration_date: req.headers.expiration_date,
    completion_date: req.headers.completion_date,
  });
  res.status(200).json(task);
}

initRoutes();

module.exports = router;
