const { DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require("..");

class Contact_persons extends Sequelize.Model {}

Contact_persons.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: "id",
      autoIncrement: true,
    },
    time_to_call: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment:
        "Время, в которое можно связваться с контактным лицом\nЕсли время любое, то null\n",
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
