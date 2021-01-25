const User = require("./userModel")
const Image = require("./imageModel")
const { Sequelize, DataTypes } = require("sequelize")

const sequelize = new Sequelize(process.env.DATABASE_STRING, {
  logging: false,
  pool: {
    max: 5,
    min: 0,
    acquire: 300000,
    idle: 100000,
  },
})

const UserImage = sequelize.define("UserImage", {
  UserId: {
    type: DataTypes.INTEGER,
    references: {
      model: User, // 'Movies' would also work
      key: "id",
    },
  },
  ImageId: {
    type: DataTypes.INTEGER,
    references: {
      model: Image, // 'Actors' would also work
      key: "id",
    },
  },
})

UserImage.sync({ alter: true })
module.exports = UserImage
