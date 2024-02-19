import express from "express"

import auth from "../middlewares/auth.js"
import {
  executeTestCases,
  generateTestCases,
} from "../controllers/testCasesController.js"

const router = express.Router()

router.post("/generate", auth, generateTestCases)
router.post("/execute", auth, executeTestCases)

export default router
