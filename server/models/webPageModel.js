import mongoose from "mongoose"

const webPageSchema = mongoose.Schema({
  projectId: { type: String },
  uid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  pageId: {
    type: String,
    unique: true,
  },

  pageName: { type: String },
  pageUrl: { type: String },
  pageDescription: { type: String },

  testCasesNames: { type: [String], default: [] },

  testcasesPassed: { type: Number, default: 0 },
  totalTestcases: { type: Number, default: 0 },
})

const webPageModel = mongoose.model("WebPage", webPageSchema)

export default webPageModel
