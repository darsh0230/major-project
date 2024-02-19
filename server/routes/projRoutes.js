import express from "express"
import {
  createProject,
  getProj,
  getProjList,
} from "../controllers/projController.js"
import auth from "../middlewares/auth.js"

const router = express.Router()

router.post("/create", auth, createProject)
router.get("/getAll", auth, getProjList)
router.get("/:pid", auth, getProj)

export default router
