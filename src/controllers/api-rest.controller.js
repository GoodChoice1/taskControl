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
const { sequelize } = require("../dataBase");

const router = Router();

function initRoutes() {
  router.get("/", asyncHandler(getAllOrgs));
  router.get("/report",asyncHandler(getReport))
}

async function getAllOrgs(req, res, next) {
  let org_list = await Organizations.findAll();
  if (org_list.length == 0) throw new ErrorResponse("Нет клиентов", 404);
  res.status(200).json(org_list);
}

async function getReport(req, res, next) {
  let left = req.headers.left;
  let right =  req.headers.right;
  let id = req.headers.id;
  // await sequelize.query(`COPY (SELECT (generateXls('${left}','${right}',${id}))) TO 'C:/temp/otchet${id}.csv' CSV ENCODING 'UTF8';`);
  const [results] = await sequelize.query(`SELECT (generateXls('${left}','${right}',${id}));`);
  for (let i =0;i<results.length;i++) results[i]= results[i].generatexls;
  res.status(200).json({results});
}


initRoutes();

module.exports = router;
