const dotenv = require("dotenv").config({ path: "./config.env" })
const fs = require("fs")
const catchAsync = require("express-async-handler")
const formidable = require("formidable")

const { v4: uuidv4 } = require("uuid")

const Image = require("../models/imageModel")
const User = require("../models/userModel")
const UserImage = require("../models/userImage")

const AWS = require("aws-sdk")
const sequelize = require("sequelize")
const Op = sequelize.Op

//
const s3 = new AWS.S3({
  accessKeyId: process.env.ACCESS_KEY,
  secretAccessKey: process.env.SECRET_KEY,
  region: `us-east-1`,
})

//

exports.upload = catchAsync(async (req, res, next) => {
  const form = formidable({ multiples: true })
  console.log(req.user.id)

  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(404)
      throw new Error("File  Upload error")
    }

    const { description, category } = fields
    const { image } = files

    const params = {
      Bucket: "yomixmart",
      Key: `pexels/${uuidv4()}`,
      Body: fs.readFileSync(image.path),
      ACL: "public-read",
      ContentType: "image/*",
    }

    s3.upload(params, async (err, data) => {
      if (err) {
        console.log(err)
      }

      const images = await Image.create({
        description,
        category,
        imageUrl: data.Location,
        imageKey: data.Key,
      })

      const join = await UserImage.create({
        UserId: req.user.id,
        ImageId: images.id,
      })

      res.status(200).json({ images, join, message: ` Image Uploaded` })
    })
  })

  next()
})

exports.deleteImage = catchAsync(async (req, res, next) => {
  const { id } = req.body

  await Image.findByPk(id).then(data => {
    console.log(data.imageKey)

    const deleteparams = {
      Bucket: "yomixmart",
      Key: `${data.imageKey}`,
    }

    s3.deleteObject(deleteparams, function (err, data) {
      if (err) {
        console.log(err)
      } else {
        console.log(data)
      }
    })
  })

  Image.destroy({ where: { id: id } }).then(data => {
    res.status(200).json({ message: "Image Deleted" })
  })
  next()
})

//
exports.getAll = catchAsync(async (req, res, next) => {
  const image = await Image.findAll({
    include: {
      model: User,
      through: {
        model: UserImage,
      },
    },
  })

  return res.status(200).json(image.map(x => x))
  next()
})

exports.getOne = catchAsync(async (req, res, next) => {
  const { id } = req.params

  const image = await Image.findOne({
    where: { id: id },

    include: {
      model: User,
      through: {
        model: UserImage,
      },
    },
  })

  return res.status(200).json(image)
  next()
})

exports.search = catchAsync(async (req, res, next) => {
  console.log(req.query)
  const keyword = req.query.keyword

  const images = await Image.findAll({
    where: {
      [Op.or]: [
        {
          category: { [Op.iRegexp]: keyword },
        },
        {
          description: { [Op.iRegexp]: keyword },
        },
      ],
    },
    include: {
      model: User,
      through: {
        model: UserImage,
      },
    },
  })
  res.status(200).json(images)
  next()
})

exports.pay = catchAsync(async (req, res, next) => {
  const { ImageId } = req.body
  console.log(ImageId)

  const image = await Image.findByPk(ImageId)

  if (image) {
    ;(image.paidFor = true),
      (image.purchase = "purchased"),
      (image.payerId = req.user.id)
    image.save()
    res.status(200).json(image)
  }
  // res.status(200).json(image)

  next()
})

exports.myImg = catchAsync(async (req, res, next) => {
  const image = await Image.findOne({ where: { payerId: req.user.id } })

  if (image) {
    res.status(200).json(image)
  } else {
    res.status(200).json("No Logo Purchased Yet")
  }

  next()
})
