const { DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require("..");

class Workers extends Sequelize.Model {}

Workers.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    work_start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    login: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize: sequelize,
    underscored: true,
    modelName: "workers",
    timestamps: false,
  }
);

module.exports = Workers;
