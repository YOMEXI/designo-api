const User = require("./userModel")
const { Sequelize, DataTypes } = require("sequelize")

//
const sequelize = new Sequelize(process.env.DATABASE_STRING, {
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 300000,
    idle: 100000,
  },
})

const Category = sequelize.define(
  "Category",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    name: { type: DataTypes.STRING, allowNull: false },
    ID: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4 },
    userId: {
      type: DataTypes.INTEGER,
      references: { model: { User }, key: "id" },
    },
  },
  {
    // Other model options go here
    timestamps: true,
    freezeTableName: true,
  }
)

Category.sync({ alter: true })
module.exports = Category
