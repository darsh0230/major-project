import mongoose from "mongoose"

const testCaseSchema = mongoose.Schema({
  webPageId: { type: String },
  projectId: { type: String },
  uid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  testCaseName: { type: String },
  isPassed: { type: Boolean, default: false },
  code: { type: String },
  resultMsg: { type: String, default: "" },
})

const testCaseModel = mongoose.model("TestCase", testCaseSchema)

export default testCaseModel
