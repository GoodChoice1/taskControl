const { DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require("..");

class Workers extends Sequelize.Model {}

Workers.init(
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
    work_start_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "work_start_date",
      autoIncrement: false,
    },
    login: {
      type: DataTypes.CHAR(50),
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "login",
      autoIncrement: false,
      unique: "workers_login_key",
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
