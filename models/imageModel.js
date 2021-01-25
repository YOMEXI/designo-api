const { Sequelize, DataTypes } = require("sequelize")
const User = require("./userModel")

var pg = require("pg")
pg.defaults.ssl = true

const sequelize = new Sequelize(process.env.DATABASE_STRING, {
  logging: false,
  pool: {
    max: 9,
    min: 0,
    acquire: 300000,
    idle: 100000,
  },
})

//

const Image = sequelize.define("Image", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  category: {
    type: DataTypes.STRING,
    // allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imageKey: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  paidFor: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  purchase: {
    type: DataTypes.STRING,
  },
  payerId: {
    type: DataTypes.INTEGER,
  },
})

Image.sync({ alter: true })
module.exports = Image
