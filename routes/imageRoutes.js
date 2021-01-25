const express = require("express")

const {
  upload,
  getAll,
  deleteImage,
  getOne,
  search,
  pay,
  myImg,
} = require("./../controllers/image")
const { authorize } = require("./../controllers/auth")
//

const router = express.Router()
router.get("/getall", getAll)
router.get("/myimg", authorize, myImg)
router.get("/getone/:id", getOne)
router.post("/search", search)
router.post("/pay", authorize, pay)
router.post("/upload", authorize, upload)
router.post("/delete", authorize, deleteImage)

//
module.exports = router
