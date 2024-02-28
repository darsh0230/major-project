import ProjectModel from "../models/projModel.js"
import WebPageModel from "../models/webPageModel.js"
import { StatusCodes } from "http-status-codes"
import { BadRequestError, UnauthenticatedError } from "../utils/errors.js"

import crypto from "crypto"

export const createWebPage = async (req, res) => {
  const { projectId, pageName, pageUrl, pageDescription } = req.body
  const uid = req.user.uid

  if (!projectId || !pageName || !pageUrl || !pageDescription) {
    throw new BadRequestError("All fields are required")
  }

  const pageId = crypto.randomBytes(6).toString("hex")

  const webPage = await WebPageModel.create({
    pageId,
    uid,
    projectId,
    pageName,
    pageUrl,
    pageDescription,
  })

  await ProjectModel.updateOne({ projectId, uid }, { $inc: { numPages: 1 } })

  if (!webPage) {
    throw new BadRequestError("WebPage creation failed")
  }

  res
    .status(StatusCodes.CREATED)
    .json({ result: { msg: "Webpage added successfully" } })
}

// ----------------------------------------------------------------------

export const getPagesList = async (req, res) => {
  const { projectId } = req.params
  const pages = await WebPageModel.find({ uid: req.user.uid, projectId }).sort({
    $natural: -1,
  })
  res.status(StatusCodes.OK).json({ result: pages })
}

// ----------------------------------------------------------------------

export const getPage = async (req, res) => {
  const { pageId } = req.params
  const proj = await WebPageModel.findOne({ pid: pageId, uid: req.user.uid })
  res.status(StatusCodes.OK).json({ result: proj })
}

// ----------------------------------------------------------------------
