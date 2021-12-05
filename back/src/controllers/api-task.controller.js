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

function dateToString(date) {
  let day = '';
  if (parseInt(date.getDate())<10){
    day = '0';
  }
  return parseInt(date.getYear())+1900 + "-" + (parseInt(date.getMonth())+1) + "-" + day + date.getDate();
}

async function getAllTasks(req, res, next) {
  const client = new Client({
    port: 5432,
    host: "localhost",
    database: "myPracticeDb",
    user: req.headers.login,
    password: req.headers.password,
  });

  try {
    client.connect();
  } catch (err) {
    throw new ErrorResponse(err, 400);
  }

  const query = `SELECT * 
  FROM tasks 
  ORDER BY (case priority
    WHEN 'Высокий' then 1
    WHEN 'Средний' then 2
    WHEN 'Низкий' then 3
    END)`;
  let result = [];

  try {
    result = await client.query(query);
  } catch (err) {
    throw new ErrorResponse(err, 400);
  } finally {
    client.end();
  }

  result = result.rows;
  for (let i=0;i<result.length;i++){
    result[i].creation_date = dateToString(result[i].creation_date);
  if (result[i].expiration_date) result[i].expiration_date = dateToString(result[i].expiration_date);
  if (result[i].completion_date) result[i].completion_date = dateToString(result[i].completion_date);
  }
  if (result.length == 0) throw new ErrorResponse("Тасков нет", 404);
  res.status(200).json(result);
}

async function getTaskById(req, res, next) {
  const client = new Client({
    port: 5432,
    host: "localhost",
    database: "myPracticeDb",
    user: req.headers.login,
    password: req.headers.password,
  });

  try {
    client.connect();
  } catch (err) {
    throw new ErrorResponse(err, 400);
  }

  let query = `SELECT *
  FROM tasks t
  JOIN contact_persons c ON c.id = contact_person_id
  JOIN persons p ON p.id = c.person_id
  JOIN organizations o ON o.id = c.org_id
  WHERE t.id = ${req.params.id}`;
  let result = true;

  try {
    result = await client.query(query);
  } catch (err) {
    throw new ErrorResponse(err, 400);
  } 

  let task = result.rows[0]

  if (result.length == 0) throw new ErrorResponse("Таска нет", 404);

  query = `SELECT *
  FROM tasks t
  JOIN workers w ON w.id = person_id_performer
  JOIN persons p ON p.id = w.person_id
  WHERE t.id = ${req.params.id}`;

  try {
    result = await client.query(query);
  } catch (err) {
    throw new ErrorResponse(err, 400);
  }

  let performer = result.rows[0]

  query = `SELECT *
  FROM tasks t
  JOIN workers w ON w.id = person_id_author
  JOIN persons p ON p.id = w.person_id
  WHERE t.id = ${req.params.id}`;

  try {
    result = await client.query(query);
  } catch (err) {
    throw new ErrorResponse(err, 400);
  } finally {
    client.end();
  }
  let author = result.rows[0]

  task.creation_date = dateToString(task.creation_date);
  if (task.expiration_date) task.expiration_date = dateToString(task.expiration_date);
  if (task.completion_date) task.completion_date = dateToString(task.completion_date);
  res.status(200).json({task,author,performer});
}

async function changeTask(req, res, next) {
  const client = new Client({
    port: 5432,
    host: "localhost",
    database: "myPracticeDb",
    user: req.headers.login,
    password: req.headers.password,
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
    user: req.headers.login,
    password: req.headers.password,
  });

  try {
    client.connect();
  } catch (err) {
    throw new ErrorResponse(err, 400);
  }

  var query = `
  SELECT id 
  FROM workers
  WHERE login = '${req.headers.login}'
  `
  try {
    var result = await client.query(query);
  } catch (err) {
    throw new ErrorResponse(err, 400);
  }

  let authorId = result.rows[0].id
  try {
    result = await client.query("select current_date");
  } catch (err) {
    throw new ErrorResponse(err, 400);
  }

  let realDate =  dateToString(result.rows[0].current_date)
  query = `
  INSERT INTO tasks (person_id_performer,person_id_author,contact_person_id,contract_number,task,priority,creation_date,expiration_date)
  VALUES (${req.body.person_id_performer},${authorId},${req.body.contact_person_id},${req.body.contract_number},'${req.body.task}','${req.body.priority}','${realDate}',${req.body.expiration_date})
  `;
  try {
    await client.query(query);
  } catch (err) {
    throw new ErrorResponse(err, 400);
  } finally {
    client.end();
  }
  res.status(200).json("Insert succesfull");
}

initRoutes();

module.exports = router;
