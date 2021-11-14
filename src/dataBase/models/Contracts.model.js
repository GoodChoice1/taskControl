const { DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require("..");

class Contracts extends Sequelize.Model {}

Contracts.init(
  {
    contract_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
    },
    total: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    submit_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    expiration_date: {
      type: DataTypes.DATEONLY,
    },
    description: {
      type: DataTypes.STRING(250),
      allowNull: false,
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
