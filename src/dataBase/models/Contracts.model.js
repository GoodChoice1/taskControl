const { DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require("..");

class Contracts extends Sequelize.Model {}

Contracts.init(
  {
    contract_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: true,
      field: "contract_number",
      autoIncrement: false,
    },
    total: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "total",
      autoIncrement: false,
    },
    submit_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "submit_date",
      autoIncrement: false,
    },
    expiration_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "expiration_date",
      autoIncrement: false,
    },
    description: {
      type: DataTypes.STRING(250),
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "description",
      autoIncrement: false,
    },
  },
  {
    sequelize: sequelize,
    underscored: true,
    modelName: "contracts",
    timestamps: false,
  }
);

module.exports = Contracts;
