const { DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require("..");

class Tasks extends Sequelize.Model {}

Tasks.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: "id",
      autoIncrement: true,
    },
    task: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "Описание задания в текстовом виде",
    },
    priority: {
      type: DataTypes.STRING(7),
      allowNull: false,
      comment: "Низкий, Средний или Высокий",
    },
    creation_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      comment: "Не изменяется",
    },
    expiration_date: {
      type: DataTypes.DATEONLY,
      comment: "Может изменяться",
    },
    completion_date: {
      type: DataTypes.DATEONLY,
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
