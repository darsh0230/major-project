import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
  email: {
    type: String,
    // require: [true, "Please provide email"],
    // minlength: 10,
    unique: true,
  },

  password: {
    type: String,
    require: [true, "Please provide password"],
    minlength: 6,
  },
});

userSchema.pre("save", async function () {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.createJwt = function () {
  return jwt.sign({ uid: this._id }, process.env.EXPAPP_JWT_SECRET, {
    expiresIn: process.env.EXPAPP_JWT_LIFETIME,
  });
};

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const userModel = mongoose.model("User", userSchema);

export default userModel;
