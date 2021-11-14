const { DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require("..");

class Organizations extends Sequelize.Model {}

Organizations.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: "id",
      autoIncrement: true,
    },
    director_full_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    fax_number: {
      type: DataTypes.STRING(13),
      comment: "Номер факса\n8-812-1234567",
    },
    legal_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    ogrn: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    },
    post_number: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    inn: {
      type: DataTypes.BIGINT,
      allowNull: false,
      comment: "Individual tax number - инн",
    },
    kpp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      comment: "Из ЕГРЮЛ ",
    },
    legal_adress: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    physical_addres: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    ispotential: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      comment:
        "Является ли клиент потенциальным\nДа - потенциальный \nНет - текущий или бывший клиент",
    },
  },
  {
    sequelize: sequelize,
    underscored: true,
    modelName: "organizations",
    timestamps: false,
  }
);

module.exports = Organizations;
