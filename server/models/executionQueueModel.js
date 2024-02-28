import mongoose from "mongoose"

const exectionQueueSchema = mongoose.Schema({
  sessionId: { type: String },
  testCaseId: { type: mongoose.Schema.Types.ObjectId, ref: "TestCase" },
  executionStatus: { type: String, default: "pending" },
  testCaseName: { type: String },
})

const exectionQueueModel = mongoose.model("exectionQueue", exectionQueueSchema)

export default exectionQueueModel
