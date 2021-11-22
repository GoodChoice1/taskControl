const { Router } = require("express");
const ErrorResponse = require("../classes/error-response");
const { asyncHandler } = require("../middlewares/middlewares");
const { Client } = require("pg");

const router = Router();

function initRoutes() {
  router.get("/", asyncHandler(getAllTasks));
  router.get("/:id", asyncHandler(getTaskById));
  router.post("/", asyncHandler(createTask));
  router.patch("/:id", asyncHandler(changeTask));
}

async function getAllTasks(req, res, next) {
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

  const query = `SELECT id, task, priority, completion_date, creation_date, expiration_date FROM tasks`;
  let result = [];

  try {
    result = await client.query(query);
  } catch (err) {
    throw new ErrorResponse(err, 400);
  } finally {
    client.end();
  }

  result = result.rows;
  if (result.length == 0) throw new ErrorResponse("Тасков нет", 404);
  res.status(200).json(result);
}

async function getTaskById(req, res, next) {
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

  const query = `SELECT task, priority, completion_date, creation_date, expiration_date, full_name AS cont_name, phone_number, work_position, email, time_to_call, legal_name, physical_addres
  FROM tasks t
  JOIN contact_persons c ON c.id = contact_person_id
  JOIN persons p ON p.id = c.person_id
  JOIN organizations o ON o.id = c.org_id
  WHERE t.id = ${req.params.id}`;
  let result = [];

  try {
    result = await client.query(query);
  } catch (err) {
    throw new ErrorResponse(err, 400);
  } finally {
    client.end();
  }

  result = result.rows;
  if (result.length == 0) throw new ErrorResponse("Таска нет", 404);
  res.status(200).json(result);
}

async function changeTask(req, res, next) {
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

  let query = `SELECT * FROM tasks WHERE id = ${req.params.id}`;
  let result = [];

  try {
    result = await client.query(query);
  } catch (err) {
    throw new ErrorResponse(err, 400);
  }

  result = result.rows;

  if (result.length == 0) throw new ErrorResponse("Таска нет", 404);

  query = `UPDATE tasks SET completion_date = ${req.body.completion_date} WHERE id = ${req.params.id}`;
  try {
    result = await client.query(query);
  } catch (err) {
    throw new ErrorResponse(err, 400);
  } finally {
    client.end();
  }

  res.status(200).json({ message: "Updated" });
}

async function createTask(req, res, next) {
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

  const query = `
  INSERT INTO tasks (person_id_performer,person_id_author,contact_person_id,contract_number,task,priority,creation_date,expiration_date,completion_date)
  VALUES (${req.body.person_id_performer},${req.body.person_id_author},${req.body.contact_person_id},${req.body.contract_number},${req.body.task},${req.body.priority},${req.body.creation_date},${req.body.expiration_date},${req.body.completion_date})
  `;

  try {
    result = await client.query(query);
  } catch (err) {
    throw new ErrorResponse(err, 400);
  } finally {
    client.end();
  }

  res.status(200).json({ message: "Insert succesfull" });
}

initRoutes();

module.exports = router;
