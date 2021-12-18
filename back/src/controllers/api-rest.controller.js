const { Router } = require("express");
const {
  asyncHandler,
  connectionHandler,
} = require("../middlewares/middlewares");
const ErrorResponse = require("../classes/error-response");
const router = Router();

function initRoutes() {
  router.get(
    "/orgs",
    asyncHandler(connectionHandler),
    asyncHandler(getAllOrgs)
  );
  router.get(
    "/report",
    asyncHandler(connectionHandler),
    asyncHandler(getReport)
  );
  router.get(
    "/contPersons",
    asyncHandler(connectionHandler),
    asyncHandler(getContacts)
  );
  router.get("/users", asyncHandler(connectionHandler), asyncHandler(getUsers));
  router.get(
    "/allusers",
    asyncHandler(connectionHandler),
    asyncHandler(getUsersAll)
  );
}

async function getAllOrgs(req, res, _next) {
  let client = req.client;
  await client.connect();

  let result = true;
  let query = `
  SELECT * FROM organizations
  `;

  result = await client.query(query);

  result = result.rows;
  if (result.length == 0) throw new ErrorResponse("Нет клиентов", 404);

  let legalClientList = result;
  result = await client.query(`SELECT * 
  FROM contact_persons c 
  JOIN persons p ON c.person_id = p.id
  `);

  let contList = result.rows;

  for (let i = 0; i < legalClientList.length; i++) {
    legalClientList[i].contactPersList = [];
    for (let j = 0; j < contList.length; j++) {
      if (legalClientList[i].id == contList[j].org_id) {
        legalClientList[i].contactPersList.push(contList[j]);
      }
    }
  }

  result = await client.query(`SELECT * 
  FROM contracts
  `);

  let contractsList = result.rows;

  for (let i = 0; i < legalClientList.length; i++) {
    legalClientList[i].contractList = [];
    for (let j = 0; j < contractsList.length; j++) {
      if (legalClientList[i].id == contractsList[j].org_id) {
        legalClientList[i].contractList.push(contractsList[j]);
      }
    }
  }

  result = await client.query(`
  SELECT * 
    FROM contract_structs cs
    JOIN equipment e ON e.id = cs.equipment_id 
  `);
  client.end();

  let equipmentList = result.rows;

  for (let i = 0; i < legalClientList.length; i++) {
    for (let j = 0; j < legalClientList[i].contractList.length; j++) {
      legalClientList[i].contractList[j].eqList = [];
      for (let k = 0; k < equipmentList.length; k++) {
        if (
          legalClientList[i].contractList[j].contract_number ==
          equipmentList[k].contract_number
        ) {
          legalClientList[i].contractList[j].eqList.push(equipmentList[k]);
        }
      }
    }
  }

  res.status(200).json(legalClientList);
}

async function getContacts(req, res, _next) {
  let client = req.client;
  await client.connect();

  let query = `
  SELECT contact_persons.id, full_name, legal_name FROM contact_persons
  JOIN persons p ON p.id = person_id
  JOIN organizations o ON o.id = org_id
  `;
  let result = await client.query(query);
  client.end();

  result = result.rows;
  if (result.length == 0) throw new ErrorResponse("Нет контактных лиц", 404);
  res.status(200).json(result);
}

async function getReport(req, res, _next) {
  let client = req.client;

  await client.connect();
  let result = await client.query(
    `SELECT id FROM workers WHERE login = '${req.headers.login}'`
  );
  result = result.rows[0].id;

  const query = `SELECT (generateXls('${req.headers.left}','${req.headers.right}',${result}));`;

  result = await client.query(query);
  client.end();

  result = result.rows;
  for (let i = 0; i < result.length; i++) result[i] = result[i].generatexls;
  res.status(200).json({ result });
}

async function getUsers(req, res, _next) {
  let client = req.client;

  await client.connect();

  let query = `
  SELECT workers.id, full_name FROM workers
  JOIN persons p ON p.id = person_id
  WHERE work_position = 'Рядовой сотрудник' OR login = '${req.headers.login}'
  `;
  let result = await client.query(query);
  client.end();

  result = result.rows;
  if (result.length == 0) throw new ErrorResponse("Нет контактных лиц", 404);
  res.status(200).json(result);
}

async function getUsersAll(req, res, _next) {
  let client = req.client;

  await client.connect();

  let query = `
  SELECT workers.id, full_name FROM workers
  JOIN persons p ON p.id = person_id
  `;

  let result = await client.query(query);
  client.end();
  result = result.rows;
  if (result.length == 0) throw new ErrorResponse("Нет контактных лиц", 404);
  res.status(200).json(result);
}

initRoutes();

module.exports = router;
