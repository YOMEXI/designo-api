const catchAsync = require("express-async-handler")

const Category = require("../models/categoryModel")
const User = require("../models/userModel")

exports.create = catchAsync(async (req, res, next) => {
  const { name } = req.body
  const nameExist = await Category.findOne({ where: { name: name } })

  if (nameExist) {
    res.status(404)
    throw new Error("Category Exists")
  }
  const category = await Category.create({ name, userId: req.user.id })

  res.json({ category, message: `${category.name} Category created` })
  next()
})

exports.getAll = catchAsync(async (req, res, next) => {
  const category = await Category.findAll()

  res.json(category)
  next()
})
