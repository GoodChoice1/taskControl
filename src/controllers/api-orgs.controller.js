const { Router } = require("express");
const Organizations = require("../dataBase/models/Organizations.model");
const { asyncHandler } = require("../middlewares/middlewares");
const ErrorResponse = require("../classes/error-response");
const Contracts = require("../dataBase/models/Contracts.model");
const Equipment = require("../dataBase/models/Equipment.model");
const Contact_persons = require("../dataBase/models/Contact-persons.model");
const Workers = require("../dataBase/models/Workers.model");
const Contract_struct = require("../dataBase/models/Contract-struct.model");
const Persons = require("../dataBase/models/Persons.model");

const router = Router();

function initRoutes() {
  router.get("/", asyncHandler(getAllOrgs));
}

async function getAllOrgs(req, res, next) {
  let org_list = await Organizations.findAll();
  if (org_list.length == 0) throw new ErrorResponse("Нет клиентов", 404);
  res.status(200).json(org_list);
}

initRoutes();

module.exports = router;
