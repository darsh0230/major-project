import express from "express"

import auth from "../middlewares/auth.js"
import {
  createWebPage,
  getPage,
  getPagesList,
} from "../controllers/webPageController.js"

const router = express.Router()

router.post("/create", auth, createWebPage)
router.get("/:projectId/getAll", auth, getPagesList)
router.get("/:pageId", auth, getPage)

export default router
