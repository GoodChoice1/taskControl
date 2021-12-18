const { Router } = require("express");
const ErrorResponse = require("../classes/error-response");
const {
  asyncHandler,
  connectionHandler,
} = require("../middlewares/middlewares");

const router = Router();

function initRoutes() {
  router.get("/", asyncHandler(connectionHandler), asyncHandler(getAllTasks));
  router.get(
    "/:id",
    asyncHandler(connectionHandler),
    asyncHandler(getTaskById)
  );
  router.post("/", asyncHandler(connectionHandler), asyncHandler(createTask));
  router.patch(
    "/:id",
    asyncHandler(connectionHandler),
    asyncHandler(changeTask)
  );
  router.patch(
    "/complete/:id",
    asyncHandler(connectionHandler),
    asyncHandler(completeTask)
  );
  router.get(
    "/isAuthor/:id",
    asyncHandler(connectionHandler),
    asyncHandler(isAuthor)
  );
  router.delete(
    "/:id",
    asyncHandler(connectionHandler),
    asyncHandler(deleteTask)
  );
}

function dateToString(date) {
  let day = "";
  if (parseInt(date.getDate()) < 10) {
    day = "0";
  }
  return (
    parseInt(date.getYear()) +
    1900 +
    "-" +
    (parseInt(date.getMonth()) + 1) +
    "-" +
    day +
    date.getDate()
  );
}

async function getAllTasks(req, res, _next) {
  let client = req.client;
  await client.connect();

  const query = `SELECT * 
  FROM tasks 
  ORDER BY (case priority
    WHEN 'Высокий' then 1
    WHEN 'Средний' then 2
    WHEN 'Низкий' then 3
    END)`;

  let result = await client.query(query);
  client.end();

  result = result.rows;
  for (let i = 0; i < result.length; i++) {
    result[i].creation_date = dateToString(result[i].creation_date);
    if (result[i].expiration_date)
      result[i].expiration_date = dateToString(result[i].expiration_date);
    if (result[i].completion_date)
      result[i].completion_date = dateToString(result[i].completion_date);
  }
  if (result.length == 0) throw new ErrorResponse("Тасков нет", 404);
  res.status(200).json(result);
}

async function getTaskById(req, res, _next) {
  let client = req.client;

  await client.connect();

  let query = `SELECT *
  FROM tasks t
  JOIN contact_persons c ON c.id = contact_person_id
  JOIN persons p ON p.id = c.person_id
  JOIN organizations o ON o.id = c.org_id
  WHERE t.id = ${req.params.id}`;

  let result = await client.query(query);
  let task = result.rows[0];

  if (result.length == 0) throw new ErrorResponse("Таска нет", 404);

  query = `SELECT *
  FROM tasks t
  JOIN workers w ON w.id = person_id_performer
  JOIN persons p ON p.id = w.person_id
  WHERE t.id = ${req.params.id}`;

  result = await client.query(query);
  let performer = result.rows[0];

  query = `SELECT *
  FROM tasks t
  JOIN workers w ON w.id = person_id_author
  JOIN persons p ON p.id = w.person_id
  WHERE t.id = ${req.params.id}`;

  result = await client.query(query);
  client.end();
  let author = result.rows[0];
  task.creation_date = dateToString(task.creation_date);
  if (task.expiration_date)
    task.expiration_date = dateToString(task.expiration_date);
  if (task.completion_date)
    task.completion_date = dateToString(task.completion_date);
  res.status(200).json({ task, author, performer });
}

async function changeTask(req, res, _next) {
  let client = req.client;

  await client.connect();

  let query = `SELECT * FROM tasks WHERE id = ${req.params.id}`;
  let result = await client.query(query);
  result = result.rows;

  if (result.length == 0) throw new ErrorResponse("Таска нет", 404);

  let author = "";
  if (req.body.person_id_author) {
    author = "person_id_author = " + req.body.person_id_author + ",";
  }
  query = `UPDATE tasks SET ` + author;
  let query2 = `
  person_id_performer = ${req.body.person_id_performer},
  contact_person_id = ${req.body.contact_person_id},
  contract_number = ${req.body.contract_number},
  task = '${req.body.task}',
  priority = '${req.body.priority}',
  expiration_date = ${req.body.date}
  WHERE id = ${req.params.id}`;
  query = query + query2;
  console.log(query);
  result = await client.query(query);
  client.end();
  res.status(200).json({ message: "Updated" });
}

async function createTask(req, res, _next) {
  let client = req.client;
  await client.connect();

  let query = `
  SELECT id 
  FROM workers
  WHERE login = '${req.headers.login}'
  `;
  let result = await client.query(query);

  let authorId = result.rows[0].id;
  result = await client.query("select current_date");

  let realDate = dateToString(result.rows[0].current_date);
  query = `
  INSERT INTO tasks (person_id_performer,person_id_author,contact_person_id,contract_number,task,priority,creation_date,expiration_date)
  VALUES (${req.body.person_id_performer},${authorId},${req.body.contact_person_id},${req.body.contract_number},'${req.body.task}','${req.body.priority}','${realDate}',${req.body.expiration_date})
  `;
  await client.query(query);
  client.end();
  res.status(200).json("Insert succesfull");
}

async function completeTask(req, res, _next) {
  let client = req.client;

  await client.connect();
  let result = await client.query("select current_date");

  let realDate = dateToString(result.rows[0].current_date);

  let query = `UPDATE tasks SET completion_date = '${realDate}' WHERE id = ${req.params.id}`;
  result = await client.query(query);
  client.end();
  console.log(result.rows);
  res.status(200).json("Update succesfull");
}

async function isAuthor(req, res, _next) {
  let client = req.client;

  await client.connect();

  let query = `SELECT (current_user = (SELECT login FROM tasks t
    JOIN workers w ON w.id = t.person_id_author
    WHERE t.id = ${req.params.id} )) AS resp`;

  let result = await client.query(query);
  client.end();

  res.status(200).json(result.rows[0].resp);
}

async function deleteTask(req, res, _next) {
  let client = req.client;
  await client.connect();

  let query = `DELETE FROM tasks WHERE id = ${req.params.id}`;
  let result = await client.query(query);
  client.end();

  res.status(200).json(result.rows[0]);
}

initRoutes();

module.exports = router;
