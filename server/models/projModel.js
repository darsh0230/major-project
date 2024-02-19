import mongoose from "mongoose"

const projSchema = mongoose.Schema({
  pid: {
    type: String,
    unique: true,
  },

  uid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  pname: {
    type: String,
  },

  projectUrl: { type: String },

  testcasesPassed: { type: Number, default: 0 },
  totalTestcases: { type: Number, default: 0 },
  numPages: { type: Number, default: 0 },
})

const projModel = mongoose.model("Proj", projSchema)

export default projModel
