const express = require("express")
const { authorize } = require("./../controllers/auth")
const { create, getAll } = require("./../controllers/category")
//

const router = express.Router()

router.post("/create", authorize, create)
router.get("/", authorize, getAll)

//
module.exports = router
