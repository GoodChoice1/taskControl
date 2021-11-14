const { DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require("..");
const Contact_persons = require("./Contact-persons.model");
const Contracts = require("./Contracts.model");
const Equipment = require("./Equipment.model");
const Organizations = require("./Organizations.model");
const Workers = require("./Workers.model");
const Tasks = require("./Tasks.model");
const Contract_struct = require("./Contract-struct.model");

class Persons extends Sequelize.Model {}

Persons.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: true,
      field: "id",
      autoIncrement: false,
    },
    full_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "full_name",
      autoIncrement: false,
    },
    phone_number: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: null,
      comment: "Без плюсов, пробелов, тире и скобок",
      primaryKey: false,
      field: "phone_number",
      autoIncrement: false,
    },
    work_position: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "work_position",
      autoIncrement: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "email",
      autoIncrement: false,
    },
  },
  {
    sequelize: sequelize,
    underscored: true,
    modelName: "persons",
    timestamps: false,
  }
);

Persons.hasOne(Workers);
Workers.belongsTo(Persons, {foreignKey: "person_id"})

Persons.hasOne(Contact_persons);
Contact_persons.belongsTo(Persons, {foreignKey: "person_id"});

Organizations.hasMany(Contact_persons);
Contact_persons.belongsTo(Organizations, {foreignKey: "org_id"});

Organizations.hasMany(Contracts);
Contracts.belongsTo(Organizations, {foreignKey: "org_id"})

Workers.hasMany(Tasks);
Tasks.belongsTo(Workers, {foreignKey: "person_id_author"});
Tasks.belongsTo(Workers, {foreignKey: "person_id_performer"});

Contact_persons.hasMany(Tasks);
Tasks.belongsTo(Contact_persons, {foreignKey: "contact_person_id"});

Contracts.hasMany(Tasks);
Tasks.belongsTo(Contracts, {foreignKey: "contract_number"});

Equipment.belongsToMany(Contracts, {
  through: Contract_struct,
  foreignKey: "equipment_id",
});

Contracts.belongsToMany(Equipment, {
  through: Contract_struct,
  foreignKey: "contract_number",
});


module.exports = Persons;
