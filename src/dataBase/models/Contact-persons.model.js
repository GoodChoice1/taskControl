const { DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require("..");

class Contact_persons extends Sequelize.Model {}

Contact_persons.init(
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
    time_to_call: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
      comment:
        "Время, в которое можно связваться с контактным лицом\nЕсли время любое, то null\n",
      primaryKey: false,
      field: "time_to_call",
      autoIncrement: false,
    },
  },
  {
    sequelize: sequelize,
    underscored: true,
    modelName: "сontact_persons",
    timestamps: false,
  }
);

module.exports = Contact_persons;
