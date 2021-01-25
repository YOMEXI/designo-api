const { Sequelize, DataTypes } = require("sequelize")
const bcrypt = require("bcrypt")

const Category = require("./categoryModel")
const Image = require("./imageModel")
const UserImage = require("./userImage")

//
const sequelize = new Sequelize(process.env.DATABASE_STRING, {
  logging: false,
  pool: {
    max: 11,
    min: 0,
    acquire: 300000,
    idle: 100000,
  },
})

const User = sequelize.define(
  "User",
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    firstname: { type: DataTypes.STRING, allowNull: false },
    lastname: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },

    role: { type: DataTypes.STRING, defaultValue: "designer" },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    user: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    number: {
      type: DataTypes.INTEGER,
    },
    purchase: {
      type: DataTypes.INTEGER,
    },
  },
  {
    // Other model options go here
    timestamps: true,
    freezeTableName: true,
  }
)

User.hasMany(Category, {
  foreignKey: {
    name: "userId",
    type: DataTypes.INTEGER,
  },
  sourceKey: "id",
})

User.belongsToMany(Image, { through: UserImage, foreignKey: "UserId" })
Image.belongsToMany(User, { through: UserImage, foreignKey: "ImageId" })

User.beforeCreate(async (user, options) => {
  const hashedPassword = await bcrypt.hash(user.password, 11)
  user.password = hashedPassword
})

User.sync({ alter: true })
module.exports = User
