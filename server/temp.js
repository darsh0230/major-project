import cypress from "cypress"
import ipc from "node-ipc"
import fs from "fs"

import express from "express"
const app = express()

app.use(express.json())

ipc.config.id = "cypressListener"
ipc.config.socketRoot = "C:/temp/"

ipc.connectTo("cypressListener", () => {
  ipc.of.cypressListener.on("connect", () => {
    ipc.log("## connected to Cypress listener ##")
  })
})

app.get("/api/v1/testCases/updateTestCaseStatus", (req, res) => {})

app.listen(5001, () => {
  console.log("Server is running on port 5001")
})

// cypress
//   .run({
//     headed: true,
//     spec: "./cypress/e2e/3696a511307b/*",
//   })
//   .then((results) => {
//     console.log("cypress run finished", results)
//     ipc.server.stop()
//   })
//   .catch((err) => {
//     console.log("cypress run failed", err)
//     ipc.server.stop()
//   })

// receive stream of events
// ipc.server.on("test:after:run", (data) => {
//   console.log(
//     "test finsihed: %s",
//     // data.title
//     data.state
//     // data.duration
//   )
// })

// ipc.server.start()
