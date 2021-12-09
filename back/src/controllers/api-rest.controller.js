const { Router } = require("express");
const { asyncHandler } = require("../middlewares/middlewares");
const ErrorResponse = require("../classes/error-response");
const { Client } = require("pg");

const router = Router();

function initRoutes() {
  router.get("/orgs", asyncHandler(getAllOrgs));
  router.get("/report",asyncHandler(getReport));
  router.get("/contPersons",asyncHandler(getContacts));
  router.get("/users",asyncHandler(getUsers));
}

async function getAllOrgs(req, res, next) {
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

  let result = true;
  let query = `
  SELECT * FROM organizations
  `;
  try {
    result = await client.query(query);
  } catch (err) {
    throw new ErrorResponse(err, 400);
  }

  result = result.rows;
  if (result.length == 0) throw new ErrorResponse("Нет клиентов", 404);
  
  let legalClientList = result
  try {
    result = await client.query(`SELECT * 
    FROM contact_persons c 
    JOIN persons p ON c.person_id = p.id
    `);
  } catch (err) {
    throw new ErrorResponse(err, 400);
  }
  let contList = result.rows

  for (let i =0;i<legalClientList.length; i++){
    legalClientList[i].contactPersList = [];
    for (let j =0;j<contList.length; j++){
      if (legalClientList[i].id == contList[j].org_id){
        legalClientList[i].contactPersList.push(contList[j]);
      }
    }
  }

  try {
    result = await client.query(`SELECT * 
    FROM contracts
    `);
  } catch (err) {
    throw new ErrorResponse(err, 400);
  } 

  let contractsList = result.rows

  for (let i =0;i<legalClientList.length; i++){
    legalClientList[i].contractList = [];
    for (let j =0;j<contractsList.length; j++){
      if (legalClientList[i].id == contractsList[j].org_id){
        legalClientList[i].contractList.push(contractsList[j]);
      }
    }
  }

  try {
    result = await client.query(`
    SELECT * 
      FROM contract_structs cs
      JOIN equipment e ON e.id = cs.equipment_id 
    `);
  } catch (err) {
    throw new ErrorResponse(err, 400);
  } finally {
    client.end();
  }
  let equipmentList = result.rows

  for (let i =0;i<legalClientList.length; i++){
    for (let j =0;j<legalClientList[i].contractList.length; j++){
      legalClientList[i].contractList[j].eqList = [];
      for (let k =0;k<equipmentList.length; k++){
        if (legalClientList[i].contractList[j].contract_number == equipmentList[k].contract_number){
          legalClientList[i].contractList[j].eqList.push(equipmentList[k]);
        }
      }
    }
  }

  res.status(200).json(legalClientList);
}

async function getContacts(req, res, next) {
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

  let result = [];
  let query = `
  SELECT * FROM contact_persons
  JOIN persons p ON p.id = person_id
  JOIN organizations o ON o.id = org_id
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
    user: req.headers.login,
    password: req.headers.password,
  });

  try {
    client.connect();
  } catch (err) {
    throw new ErrorResponse(err, 400);
  }

  let result = true;

  try {
    result = await client.query(`SELECT id FROM workers WHERE login = '${req.headers.login}'`);
  } catch (err) {
    throw new ErrorResponse(err, 400);
  }

  result = result.rows[0].id

  const query = `SELECT (generateXls('${req.headers.left}','${req.headers.right}',${result}));`;

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

async function getUsers(req, res, next) {
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

  let result = [];
  let query = `
  SELECT * FROM workers
  JOIN persons p ON p.id = person_id
  WHERE work_position = 'Рядовой сотрудник' OR login = '${req.headers.login}'
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

initRoutes();

module.exports = router;
