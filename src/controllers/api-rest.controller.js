const { Router } = require("express");
const { asyncHandler } = require("../middlewares/middlewares");
const ErrorResponse = require("../classes/error-response");
const { Client } = require("pg");

const router = Router();

function initRoutes() {
  router.get("/orgs", asyncHandler(getAllOrgs));
  router.get("/report",asyncHandler(getReport));
  router.get("/contPersons/:id",asyncHandler(getContacts));
}

async function getAllOrgs(req, res, next) {
  const client = new Client({
    port: 5432,
    host: "localhost",
    database: "myPracticeDb",
    user: req.body.login,
    password: req.body.password,
  });

  try {
    client.connect();
  } catch (err) {
    throw new ErrorResponse(err, 400);
  }

  let result = [];
  let query = `
  SELECT * FROM organizations
  `;
  try {
    result = await client.query(query);
  } catch (err) {
    throw new ErrorResponse(err, 400);
  } finally {
    client.end();
  }
  result = result.rows;
  if (result.length == 0) throw new ErrorResponse("Нет клиентов", 404);
  res.status(200).json(result);
}

async function getContacts(req, res, next) {
  const client = new Client({
    port: 5432,
    host: "localhost",
    database: "myPracticeDb",
    user: req.body.login,
    password: req.body.password,
  });

  try {
    client.connect();
  } catch (err) {
    throw new ErrorResponse(err, 400);
  }

  let result = [];
  let query = `
  SELECT full_name, phone_number, work_position, email, time_to_call FROM contact_persons
  JOIN persons p ON p.id = person_id
  WHERE org_id = ${req.params.id}
  `;
  try {
    result = await client.query(query);
  } catch (err) {
    throw new ErrorResponse(err, 400);
  } finally {
    client.end();
  }
  result = result.rows;
  if (result.length == 0) throw new ErrorResponse("Нет контактных лиц", 404);
  res.status(200).json(result);
}

async function getReport(req, res, next) {
  const client = new Client({
    port: 5432,
    host: "localhost",
    database: "myPracticeDb",
    user: req.body.login,
    password: req.body.password,
  });

  try {
    client.connect();
  } catch (err) {
    throw new ErrorResponse(err, 400);
  }

  const query = `SELECT (generateXls(${req.body.left},${req.body.right},${req.body.id}));`;
  let result = [];

  try {
    result = await client.query(query);
  } catch (err) {
    throw new ErrorResponse(err, 400);
  } finally {
    client.end();
  }
  result = result.rows;
  for (let i =0;i<result.length;i++) result[i]= result[i].generatexls;
  res.status(200).json({result});
}


initRoutes();

module.exports = router;
