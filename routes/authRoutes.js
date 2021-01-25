const express = require("express")
const {
  signup,
  login,
  userDetail,
  authorize,
} = require("./../controllers/auth")
//

const router = express.Router()

router.post("/signup", signup)
router.post("/login", login)
router.get("/userdetails", authorize, userDetail)
//
module.exports = router
