import User from "../models/userModel.js";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, UnauthenticatedError } from "../utils/errors.js";

export const login = async (req, res) => {
  const { email, password } = req.body;

  const userExists = await User.findOne({ email }).select("-__v");

  if (!userExists)
    throw new UnauthenticatedError("User Doesn't Exists , please Signup");

  const passwordMatch = await userExists.comparePassword(password);

  if (!passwordMatch) throw new BadRequestError("Invalid Credentials");

  const token = userExists.createJwt();

  res.status(StatusCodes.OK).json({
    result: {
      user: {
        email: userExists.email,
      },
      token,
    },
  });
};

export const register = async (req, res) => {
  const { password, email } = req.body;

  console.log(password);

  const userExists = await User.findOne({ email });

  if (userExists)
    throw new BadRequestError("User already Exists , Please Login");

  const user = await User.create({
    email,
    password,
  });
  const token = user.createJwt();
  res.status(StatusCodes.CREATED).json({ user, token });
};
