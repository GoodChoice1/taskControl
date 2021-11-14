const { Router } = require("express");
const { asyncHandler } = require("../middlewares/middlewares");
const Persons = require("../dataBase/models/Persons.model");
const ErrorResponse = require("../classes/error-response");
let { sequelize } = require("../dataBase");
const Sequelize = require("sequelize");

const router = Router();

function initRoutes() {
  router.post("/register", asyncHandler(createUser));
  router.post("/login", asyncHandler(login));
}

// Добавляет пользователя в бд и создает по его логину юзера с паролем передающимся в хешированом виде
async function createUser(req, res, next) {
  let person = await Persons.findOne({
    where: {
      [Op.or]: {
        email: req.headers.email,
        phone_number: req.headers.phone_number,
      },
    },
  });

  let worker = await Worker.findOne({
    where: {
      login: req.headers.login,
    },
  });

  if (person) throw new ErrorResponse("Человек с таким email или телефоном уже существует",400);
  if (worker) throw new ErrorResponse("Логин занят", 400);
  if (req.headers.role != "Менеджер" && req.headers.role != "Рядовой сотрудник") throw new ErrorResponse("Неверная роль", 400);

  person = await Persons.create({
    full_name: req.headers.full_name,
    phone_number: req.headers.phone_number,
    work_position: req.headers.work_position,
    email: req.headers.email,
  });

  worker = await Worker.create({
    login: req.headers.login,
    work_start_date: req.headers.work_start_date,
    person_id: person.id,
  });

  const msgBuffer = new TextEncoder().encode(req.headers.password);
  const shaPass = await crypto.subtle.digest("SHA-256", msgBuffer);
  await sequelize.query(`CREATE USER ${req.headers.login} PASSWORD ${shaPass}`);
  if (req.headers.role == "Менеджер")
    await sequelize.query(`GRANT manager TO ${req.headers.login}`);
  else sequelize.query(`GRANT worker TO ${req.headers.login}`);
  res.status(200).json(worker, person);
}

//попытка логина, в комменте хеш пароля
async function login(req, res, next) {
  //   const msgBuffer = new TextEncoder().encode(req.headers.password);
  //   const shaPass = await crypto.subtle.digest("SHA-256", msgBuffer);
  sequelize = new Sequelize({
    port: 5432,
    dialect: "postgres",
    host: "localhost",
    database: "myPracticeDb",
    username: req.headers.login,
    password: req.headers.password,
  });
  await sequelize.authenticate();
  console.log("Connected to DB");
  const [results] = await sequelize.query("select current_user");
  res.status(200).json(results);
}

initRoutes();

module.exports = router;
