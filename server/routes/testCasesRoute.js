import express from "express"

import auth from "../middlewares/auth.js"
import {
  executeTestCases,
  generateTestCases,
  getAllTestCases,
  getTestCase,
  updateTestCaseCode,
  updateTestCaseStatus,
  updateExecutionStatus,
  generateTestCase,
} from "../controllers/testCasesController.js"

const router = express.Router()

router.post("/generate", auth, generateTestCases)
router.post("/generateTestCase", auth, generateTestCase)
router.post("/execute", auth, executeTestCases)
router.get("/getAllTestCases", auth, getAllTestCases)
router.get("/getTestCase/:testCaseId", auth, getTestCase)
router.post("/updateTestCaseCode", auth, updateTestCaseCode)

router.post("/updateTestCaseStatus", updateTestCaseStatus)
router.post("/updateExecutionStatus", updateExecutionStatus)

export default router
