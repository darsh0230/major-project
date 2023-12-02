import mongoose from "mongoose";

const projSchema = mongoose.Schema({
  pid: {
    type: String,
    unique: true,
  },

  uid: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  pname: {
    type: String,
  },

  githubUrl: {
    type: String,
    // unique: true,
  },

  frameWork: {
    type: String,
  },

  fVer: {
    type: String,
  },

  awsCred: {
    userId: {
      type: String,
    },
    secret: {
      type: String,
    },
  },

  pStatus: {
    type: String,
  },
});

const projModel = mongoose.model("Proj", projSchema);

export default projModel;
