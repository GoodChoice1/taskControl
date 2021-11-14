const { DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require("..");

class Contract_struct extends Sequelize.Model {}

Contract_struct.init(
  {
    contract_number: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: false,
    },
    equipment_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: false,
    },
  },
  {
    sequelize: sequelize,
    underscored: true,
    modelName: "contract_structs",
    timestamps: false,
  }
);


module.exports = Contract_struct;