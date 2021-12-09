const { Router } = require("express");
const { asyncHandler } = require("../middlewares/middlewares");
const ErrorResponse = require("../classes/error-response");
const { Client } = require("pg");
const router = Router();

function initRoutes() {
  router.post("/register", asyncHandler(createUser));
  router.post("/login", asyncHandler(loginUser));
}

async function createUser(req, res, _next) {
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
  WHERE email = '${req.body.email}' OR phone_number = ${req.body.phone_number}
  `;
  try {
   var result = await client.query(query);
  } catch (err) {
    throw new ErrorResponse(err, 400);
  }

  result = result.rows;
  if (result.length != 0) throw new ErrorResponse("Человек с таким email или телефоном",400);

  query = `
   SELECT * 
   FROM workers 
   WHERE login = '${req.body.regLogin}'
   `;

  try {
    result = await client.query(query);
  } catch (err) {
    throw new ErrorResponse(err, 400);
  }

  result= result.rows;
  if (result.length != 0) throw new ErrorResponse("Логин занят", 400);

  query = `
  INSERT INTO persons (full_name,phone_number,work_position,email)
  VALUES ('${req.body.full_name}',${req.body.phone_number},'${req.body.role}','${req.body.email}');
  SELECT * FROM persons WHERE email = '${req.body.email}';
  
  `;

  try {
    result = await client.query(query);
  } catch (err) {
    throw new ErrorResponse(err, 400);
  }

  result = result[1].rows[0].id
  query = `
  INSERT INTO workers (login,person_id)
  VALUES ('${req.body.regLogin}',${result});
  CREATE USER ${req.body.regLogin} PASSWORD '${req.body.regPassword}';
  `;

  try {
    await client.query(query);
  } catch (err) {
    throw new ErrorResponse(err, 400);
  }

  if (req.body.role == "Менеджер")
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

async function loginUser(req, res, next) {

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

  let query = `SELECT work_position FROM workers w
  JOIN persons p ON p.id = w.person_id
  WHERE w.login = '${req.body.login}'`;
  let result = false;
  try {
    result =  await client.query(query);
  } catch (err) {
    throw new ErrorResponse(err, 400);
  } finally {
    client.end();
  }
  result = result.rows[0].work_position
  if (!result) throw new ErrorResponse(err, 400);
  res.status(200).json(result);
}

initRoutes();

module.exports = router;
