const { DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require("..");

class Tasks extends Sequelize.Model {}

Tasks.init(
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
    task: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: null,
      comment: "Описание задания в текстовом виде",
      primaryKey: false,
      field: "task",
      autoIncrement: false,
    },
    priority: {
      type: DataTypes.STRING(7),
      allowNull: false,
      defaultValue: null,
      comment: "Низкий, Средний или Высокий",
      primaryKey: false,
      field: "priority",
      autoIncrement: false,
    },
    creation_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: null,
      comment: "Не изменяется",
      primaryKey: false,
      field: "creation_date",
      autoIncrement: false,
    },
    expiration_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
      comment: "Может изменяться",
      primaryKey: false,
      field: "expiration_date",
      autoIncrement: false,
    },
    completion_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "completion_date",
      autoIncrement: false,
    },
  },
  {
    sequelize: sequelize,
    underscored: true,
    modelName: "tasks",
    timestamps: false,
  }
);

module.exports = Tasks;
