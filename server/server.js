import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
import cors from "cors"
import dotenv from "dotenv"
dotenv.config()
import "express-async-errors"
import morgan from "morgan"
import mongoSanitize from "express-mongo-sanitize"
import fs from "fs"

// routes
import AuthRoute from "./routes/authRoute.js"
import ProjRoute from "./routes/projRoutes.js"
import PageRoute from "./routes/webPageRoute.js"
import TestCasesRoute from "./routes/testCasesRoute.js"

//middlewares
import notFoundMiddleware from "./middlewares/not_found.js"
import errorHandlerMiddleware from "./middlewares/error_handler.js"

// constants
const BASE_URL_PATH = "/api/v1/"
const CONNECTION_URL =
  process.env.EXPAPP_MONGO_URL || process.env.EXPAPP_MONGO_LOCAL_URL
const PORT = process.env.PORT || process.env.EXPAPP_PORT || 5000

const app = express()

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"))
}

app.use(bodyParser.json({ limit: "30mb", extended: true }))
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }))
app.use(cors())

app.use(
  mongoSanitize({
    replaceWith: "_",
    onSanitize: ({ req, key }) => {
      console.warn(`This request[${key}] is sanitized`, req)
    },
  })
)

app.use(`${BASE_URL_PATH}auth`, AuthRoute)
app.use(`${BASE_URL_PATH}project`, ProjRoute)
app.use(`${BASE_URL_PATH}page`, PageRoute)
app.use(`${BASE_URL_PATH}testCases`, TestCasesRoute)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

mongoose.set("strictQuery", true)
mongoose
  .connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () =>
      console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`)
    )
  )
  .catch((error) => console.log(error.message))
