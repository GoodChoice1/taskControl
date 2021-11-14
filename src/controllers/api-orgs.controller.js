const { Router } = require("express");
const Organizations = require("../dataBase/models/Organizations.model");
const Contracts = require("../dataBase/models/Contracts.model");
const Equipment = require("../dataBase/models/Equipment.model");
const Contact_persons = require("../dataBase/models/Contact-persons.model");
const Workers = require("../dataBase/models/Workers.model");
const Contract_struct = require("../dataBase/models/Contract-struct.model");


const router = Router();

function initRoutes() {
    router.get("/", getAllOrgs);
  }

async function getAllOrgs(req, res, next) {
    let org_list = await Organizations.findAll();
    let qwe = await Contracts.findAll();
    qwe = await Equipment.findAll();
    qwe = await Contact_persons.findAll();
    qwe = await Workers.findAll();
    qwe = await Contract_struct.findAll();
    if (!org_list) throw new Error("Нет клиентов")
    res.status(200).json(org_list);
}

initRoutes();

module.exports = router;
