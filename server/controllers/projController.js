import ProjModel from "../models/projModel.js"
import { StatusCodes } from "http-status-codes"
import { BadRequestError, UnauthenticatedError } from "../utils/errors.js"
import { exec } from "child_process"

import crypto from "crypto"

export const createProject = async (req, res) => {
  const { pname, projectUrl } = req.body
  const uid = req.user.uid

  if (!pname || !projectUrl) {
    throw new BadRequestError("All fields are required")
  }

  const pid = crypto.randomBytes(6).toString("hex")

  const proj = await ProjModel.create({ pid, uid, pname, projectUrl })

  if (!proj) {
    throw new BadRequestError("Project creation failed")
  }

  res
    .status(StatusCodes.CREATED)
    .json({ result: { msg: "Project created successfully" } })

  // res.status(StatusCodes.CREATED).json({ result: proj });
}

// ----------------------------------------------------------------------

export const getProjList = async (req, res) => {
  const projs = await ProjModel.find({ uid: req.user.uid }).sort({
    $natural: -1,
  })
  res.status(StatusCodes.OK).json({ result: { projs } })
}

// ----------------------------------------------------------------------

export const getProj = async (req, res) => {
  const { pid } = req.params
  const proj = await ProjModel.findOne({ pid, uid: req.user.uid })
  res.status(StatusCodes.OK).json({ result: proj })
}

// ----------------------------------------------------------------------
