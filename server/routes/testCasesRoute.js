import express from "express"

import auth from "../middlewares/auth.js"
import {
  executeTestCases,
  generateTestCases,
  getAllTestCases,
  getTestCase,
  updateTestCaseCode,
} from "../controllers/testCasesController.js"

const router = express.Router()

router.post("/generate", auth, generateTestCases)
router.post("/execute", auth, executeTestCases)
router.get("/getAllTestCases", auth, getAllTestCases)
router.get("/getTestCase/:testCaseId", auth, getTestCase)
router.post("/updateTestCaseCode", auth, updateTestCaseCode)

export default router
