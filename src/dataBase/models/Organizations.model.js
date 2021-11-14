const { DataTypes, Sequelize } = require("sequelize");
const { sequelize } = require("..");

class Organizations extends Sequelize.Model {}

Organizations.init(
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
    director_full_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "director_full_name",
      autoIncrement: false,
    },
    fax_number: {
      type: DataTypes.STRING(13),
      allowNull: true,
      defaultValue: null,
      comment: "Номер факса\n8-812-1234567",
      primaryKey: false,
      field: "fax_number",
      autoIncrement: false,
    },
    legal_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "legal_name",
      autoIncrement: false,
      unique: "organizations_legal_name_key",
    },
    ogrn: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "ogrn",
      autoIncrement: false,
      unique: "organizations_ogrn_key",
    },
    post_number: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "post_number",
      autoIncrement: false,
    },
    inn: {
      type: DataTypes.BIGINT,
      allowNull: false,
      defaultValue: null,
      comment: "Individual tax number - инн",
      primaryKey: false,
      field: "inn",
      autoIncrement: false,
    },
    kpp: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: null,
      comment: "Из ЕГРЮЛ ",
      primaryKey: false,
      field: "kpp",
      autoIncrement: false,
      unique: "organizations_kpp_key",
    },
    legal_adress: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "legal_adress",
      autoIncrement: false,
    },
    physical_addres: {
      type: DataTypes.STRING(200),
      allowNull: false,
      defaultValue: null,
      comment: null,
      primaryKey: false,
      field: "physical_addres",
      autoIncrement: false,
    },
    ispotential: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: null,
      comment:
        "Является ли клиент потенциальным\nДа - потенциальный \nНет - текущий или бывший клиент",
      primaryKey: false,
      field: "ispotential",
      autoIncrement: false,
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
