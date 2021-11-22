const { Router } = require("express");
const { asyncHandler } = require("../middlewares/middlewares");
const ErrorResponse = require("../classes/error-response");
const { Client } = require("pg");
const sha256 = require('js-sha256');

const router = Router();

function initRoutes() {
  router.post("/register", asyncHandler(createUser));
}

async function createUser(req, res, _next) {
  if (req.body.role != "Менеджер" && req.body.role != "Рядовой сотрудник") throw new ErrorResponse("Неверная роль", 400);

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

  let query = `
  SELECT * 
  FROM persons 
  WHERE email = '${req.body.email}' OR phone_number = ${req.body.phone_number} OR id = ${req.body.workerId}
  `;
  let result = [];
  try {
    result = await client.query(query);
  } catch (err) {
    throw new ErrorResponse(err, 400);
  }

  result = result.rows;
  if (result.length != 0) throw new ErrorResponse("Человек с таким email или телефоном или id уже существует",400);

  query = `
   SELECT * 
   FROM workers 
   WHERE login = '${req.body.regLogin}' OR id = ${req.body.workerId}
   `;

  try {
    result = await client.query(query);
  } catch (err) {
    throw new ErrorResponse(err, 400);
  }

  result= result.rows;
  if (result.length != 0) throw new ErrorResponse("Логин или данный id занят", 400);

  query = `
  INSERT INTO persons (id,full_name,phone_number,work_position,email)
  VALUES (${req.body.personId},'${req.body.full_name}',${req.body.phone_number},'${req.body.role}','${req.body.email}');
  SELECT * FROM persons WHERE email = '${req.body.email}';
  
  `;

  try {
    result = await client.query(query);
  } catch (err) {
    throw new ErrorResponse(err, 400);
  }

  result = result[1].rows[0].id
  const shaPass = sha256(req.body.regPassword)
  console.log(result);
  query = `
  INSERT INTO workers (id,login,work_start_date,person_id)
  VALUES (${req.body.workerId},'${req.body.regLogin}','${req.body.work_start_date}',${result});
  CREATE USER ${req.body.regLogin} PASSWORD '${shaPass}';
  `;

  try {
    await client.query(query);
  } catch (err) {
    throw new ErrorResponse(err, 400);
  }

  if (req.headers.role == "manager")
    query = `GRANT managers TO ${req.body.regLogin}`;
  else query = `GRANT workers TO ${req.body.regLogin}`;

  try {
    await client.query(query);
  } catch (err) {
    throw new ErrorResponse(err, 400);
  } finally {
    client.end();
  }

  res.status(200).json("Succesfully created user");
}

initRoutes();

module.exports = router;
