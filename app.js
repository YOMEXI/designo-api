const dotenv = require("dotenv").config({ path: "./config.env" })
const express = require("express")
const morgan = require("morgan")
const cors = require("cors")
const bodyParser = require("body-parser")

//
const { errorhandler } = require("./utility/errorMiddleware")
const authRouter = require("./routes/authRoutes")
const categoryRouter = require("./routes/categoryRoutes")
const imageRouter = require("./routes/imageRoutes")
//
const app = express()
if (process.env.NODE_ENV === "developement") {
  app.use(morgan("dev"))
}
app.use(morgan("dev"))
//
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
//

//
app.use("/api/v1/auth", authRouter)
app.use("/api/v1/category", categoryRouter)
app.use("/api/v1/image", imageRouter)
app.use(errorhandler)

//
app.use("/api/paypal", (req, res) => {
  res.send(process.env.CLIENT_ID)
})
//
app.use("*", (req, res, next) => {
  const error = new Error(`The url ${req.originalUrl} doesnt exist`)
  res.status(404)
})
module.exports = app
