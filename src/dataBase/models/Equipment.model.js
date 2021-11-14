const { DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require("..");

class Equipment extends Sequelize.Model {}

Equipment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "Название оборудования указанного в контракте\n",
    },
    serial_number: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize: sequelize,
    underscored: true,
    modelName: "equipment",
    timestamps: false,
  }
);

module.exports = Equipment;
