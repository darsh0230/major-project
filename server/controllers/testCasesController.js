import ProjModel from "../models/projModel.js"
import { StatusCodes } from "http-status-codes"
import { BadRequestError, UnauthenticatedError } from "../utils/errors.js"
import { exec } from "child_process"

export const generateTestCases = async (req, res) => {
  const { projectId, pageIds } = req.body
  if (!projectId) {
    throw new BadRequestError("Project Id is required")
  }
  res.status(StatusCodes.OK).json({})
}

export const executeTestCases = async (req, res) => {
  const { projectId, pageIds, testCasesIds } = req.body
  if (!projectId) {
    throw new BadRequestError("Project Id is required")
  }
  res.status(StatusCodes.OK).json({})
}
