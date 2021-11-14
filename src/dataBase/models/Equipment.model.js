const { DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require("..");

class Equipment extends Sequelize.Model {}

Equipment.init(
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
    name: {
      type: DataTypes.CHAR(50),
      allowNull: false,
      defaultValue: null,
      comment: "Название оборудования указанного в контракте\n",
      primaryKey: false,
      field: "name",
      autoIncrement: false,
    },
    serial_number: {
      type: DataTypes.CHAR(50),
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "serial_number",
      autoIncrement: false,
      unique: "equipment_serial_number_key",
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
