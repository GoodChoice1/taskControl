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
      comment: null,
      primaryKey: true,
      autoIncrement: true,
    },
    full_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "Без плюсов, пробелов, тире и скобок",
    },
    work_position: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    sequelize: sequelize,
    underscored: true,
    modelName: "persons",
    timestamps: false,
  }
);

Workers.belongsTo(Persons, { foreignKey: "person_id" });
Persons.hasOne(Workers);

Contact_persons.belongsTo(Persons, { foreignKey: "person_id" });
Persons.hasOne(Contact_persons);

Contact_persons.belongsTo(Organizations, { foreignKey: "org_id" });
Organizations.hasMany(Contact_persons);

Contracts.belongsTo(Organizations, { foreignKey: "org_id" });
Organizations.hasMany(Contracts);

Tasks.belongsTo(Workers, { foreignKey: "person_id_author" });
Tasks.belongsTo(Workers, { foreignKey: "person_id_performer" });
Workers.hasMany(Tasks);

Tasks.belongsTo(Contact_persons, { foreignKey: "contact_person_id" });
Contact_persons.hasMany(Tasks);

Tasks.belongsTo(Contracts, { foreignKey: "contract_number" });
Contracts.hasMany(Tasks);

Equipment.belongsToMany(Contracts, {
  through: Contract_struct,
  foreignKey: "equipment_id",
});

Contracts.belongsToMany(Equipment, {
  through: Contract_struct,
  foreignKey: "contract_number",
});

module.exports = Persons;
