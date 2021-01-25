const User = require("../models/userModel")
const { promisify } = require("util")
//
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const catchAsync = require("express-async-handler")

//
exports.signup = catchAsync(async (req, res, next) => {
  const { firstname, lastname, email, password } = req.body

  const Email = await User.findOne({ where: { email: email } })

  if (Email) {
    res.status(404)
    throw new Error("Email already exist")
  }

  const user = await User.create(req.body)

  //
  // const token = jwt.sign(
  //   { firstname, lastname, email, password },
  //   process.env.JWT_SECRET,
  //   {
  //     expiresIn: process.env.JWT_EXPIRES,
  //   }
  // )
  res.json({ message: "registration successful Please Login" })
  next()
})

//
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(404)
    throw new Error("Email Doesnt exist")
  }
  //
  const user = await User.findOne({ where: { email: email } })

  //
  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(404)
    throw new Error("Please input your correct email or password")
  }
  const { id, firstname, lastname, role, isAdmin } = user
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  })

  return res.json({
    id,
    firstname,
    lastname,
    email,
    role,
    isAdmin,
    token,
    message: "Welcome",
  })

  next()
})

//
exports.authorize = catchAsync(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1]
  }
  if (!token) {
    res.status(401)
    throw new Error("Please Log In")
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)
  const stillTheUser = await User.findByPk(decoded.id)

  if (!stillTheUser) {
    res.status(401)
    throw new Error("User No Longer Exist")
  }

  req.user = stillTheUser
  next()
})

exports.userDetail = catchAsync(async (req, res, next) => {
  console.log(req.user.id)
  const user = await User.findAll({
    where: { id: req.user.id },
    attributes: { exclude: ["password"] },
  })

  res.status(200).json(user)
  next()
})
