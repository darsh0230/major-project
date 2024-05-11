import WebPageModel from "../models/webPageModel.js"
import TestCaseModel from "../models/testCasesModel.js"
import ExecutionQueueModel from "../models/executionQueueModel.js"
import { StatusCodes } from "http-status-codes"
import { BadRequestError, UnauthenticatedError } from "../utils/errors.js"
import cypress from "cypress"
import crypto from "crypto"
import fs from "fs"
import {
  lang_generate_test_cases,
  lang_generate_test_case_code,
} from "../utils/langchain.js"
import { logger } from "../utils/logger.js"

export const generateTestCase = async (req, res) => {
  const { projectId, pageId, testCaseName, testCaseId } = req.body
  const uid = req.user.uid

  if (!projectId) {
    throw new BadRequestError("Project Id is required")
  }
  const page = await WebPageModel.findOne({ projectId, uid, pageId })
  if (!page) {
    throw new BadRequestError("WebPage not found")
  }

  const testCaseCode = await lang_generate_test_case_code(
    page.pageDescription,
    page.pageUrl,
    testCaseName
  )

  await TestCaseModel.updateOne({ _id: testCaseId }, { code: testCaseCode })

  return res.status(StatusCodes.OK).json({ result: { code: testCaseCode } })
}

export const generateTestCases = async (req, res) => {
  res.setHeader("Content-Type", "text/plain")
  res.setHeader("Transfer-Encoding", "chunked")

  const { projectId, pageIds } = req.body
  const uid = req.user.uid

  if (!projectId) {
    throw new BadRequestError("Project Id is required")
  }

  // get the relavent pages
  const queryObject = { projectId, uid }
  if (pageIds) {
    queryObject["pageId"] = { $in: pageIds }
  }

  const pages = await WebPageModel.find(queryObject)

  // for each page
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i]
    res.write(`\nGenerating test cases for page : ${page.pageName} \n`)

    const testCasesList = await lang_generate_test_cases(
      page.pageDescription,
      page.testCasesNames
    )
    logger.info(`Generated a list of test cases \n ${testCasesList.join("\n")}`)
    res.write(`\nGenerated a list of test cases\n`)

    // const testCasesList = generateTestCaseList(page.pageDescription)

    // for each test case
    for (let j = 0; j < testCasesList.length; j++) {
      res.write(`Generating test case : ${testCasesList[j]} \n`)
      const testCaseCode = await lang_generate_test_case_code(
        page.pageDescription,
        page.pageUrl,
        testCasesList[j]
      )

      await TestCaseModel.create({
        webPageId: page.pageId,
        projectId,
        uid,
        testCaseName: testCasesList[j],
        code: testCaseCode,
      })

      // get total test cases count for a webpage
      const testCasecount = await TestCaseModel.countDocuments({
        webPageId: page.pageId,
      })

      await WebPageModel.updateOne(
        { pageId: page.pageId, uid },
        { totalTestcases: testCasecount, testCasesNames: testCasesList }
      )
    }
  }

  res.write("\nProcess Successfully Completed \n")
  res.end()

  // res.status(StatusCodes.OK).json({ testCase })
}

// ----------------------------------------------------------------------

function CypressTemplate(testCase) {
  console.log(`${testCase.testCaseName.replace('"', "").replace("'", "")}`)
  return `describe('${testCase._id.toString()}', () => {
    it('${testCase.testCaseName
      .replaceAll('"', "")
      .replaceAll("'", "")}', () => {
      ${testCase.code}
    })
  })\n\n`
}

async function executeCypressCode(testCases, sessionId) {
  const execQueueData = []
  var cypressCode = ""
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i]
    execQueueData.push({
      sessionId,
      testCaseId: testCase._id,
      testCaseName: testCase.testCaseName,
    })

    cypressCode += CypressTemplate(testCase)
  }

  await ExecutionQueueModel.insertMany(execQueueData)

  try {
    const folderName = "./cypress/e2e/" + testCases[0].projectId
    if (!fs.existsSync(folderName)) {
      fs.mkdirSync(folderName)
    }
    fs.writeFile(`${folderName}/${sessionId}.cy.js`, cypressCode, (err) => {
      if (err) {
        console.error(err)
      } else {
        // file written successfully
      }
    })
  } catch (err) {
    console.error(err)
  }

  cypress
    .run({
      headed: true,
      spec: `./cypress/e2e/${testCases[0].projectId}/${sessionId}.cy.js`,
    })
    .then((results) => {
      console.log("cypress run finished", results)
    })
    .catch((err) => {
      console.log("cypress run failed", err)
    })
}

export const executeTestCases = async (req, res) => {
  res.setHeader("Content-Type", "text/plain")
  res.setHeader("Transfer-Encoding", "chunked")

  const { projectId, pageIds, testCasesIds } = req.body
  const uid = req.user.uid
  const sessionId = crypto.randomBytes(10).toString("hex")
  if (!projectId) {
    throw new BadRequestError("Project Id is required")
  }

  const queryObject = { projectId, uid }
  if (pageIds) {
    queryObject["webPageId"] = { $in: pageIds }
  }
  if (testCasesIds) {
    queryObject["_id"] = { $in: testCasesIds }
  }
  const testCases = await TestCaseModel.find(queryObject)

  res.write(`Executing test cases for project : ${projectId} \n\n`)

  await executeCypressCode(testCases, sessionId)

  while (
    await ExecutionQueueModel.countDocuments({
      sessionId,
      executionStatus: "pending",
    })
  ) {
    const currExec = await ExecutionQueueModel.findOne({
      sessionId,
      executionStatus: "started",
    })
    if (currExec) {
      res.write(`Executing test case : ${currExec.testCaseName} \n`)
    }
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }

  await new Promise((resolve) => setTimeout(resolve, 2000))
  // get count of passed test cases
  const passedCount = await TestCaseModel.countDocuments({
    projectId,
    webPageId: testCases[0].webPageId,
    isPassed: true,
  })

  await WebPageModel.updateOne(
    { pageId: testCases[0].webPageId, uid },
    { testcasesPassed: passedCount }
  )

  res.write("\nProcess Successfully Completed \n")
  res.end()
}

export const getAllTestCases = async (req, res) => {
  const { projectId, pageId } = req.query
  if (!projectId || !pageId) {
    throw new BadRequestError("All fields are required")
  }

  const uid = req.user.uid

  const testCases = await TestCaseModel.find({
    projectId,
    webPageId: pageId,
    uid,
  })

  res.status(StatusCodes.OK).json({ result: testCases })
}

export const getTestCase = async (req, res) => {
  const { testCaseId } = req.params
  const uid = req.user.uid
  const testCase = await TestCaseModel.findOne({ testCaseId, uid })
  if (!testCase) {
    throw new BadRequestError("Test case not found")
  }
  res.status(StatusCodes.OK).json({ result: testCase })
}

// ----------------------------------------------------------------------

export const updateTestCaseCode = async (req, res) => {
  const { testCaseId, code } = req.body
  const uid = req.user.uid

  if (!testCaseId || !code) {
    throw new BadRequestError("All fields are required")
  }

  await TestCaseModel.updateOne({ _id: testCaseId, uid }, { code })

  res.status(StatusCodes.OK).json({ result: "Test case updated successfully" })
}

// ----------------------------------------------------------------------

export const updateTestCaseStatus = async (req, res) => {
  const { testCaseId, isPassed, resultMsg, sessionId } = req.body

  if (!testCaseId || !isPassed || !resultMsg) {
    throw new BadRequestError("All fields are required")
  }

  await TestCaseModel.updateOne({ _id: testCaseId }, { isPassed, resultMsg })

  if (sessionId) {
    await ExecutionQueueModel.updateOne(
      { testCaseId, sessionId },
      { executionStatus: "completed" }
    )
  }

  res.status(StatusCodes.OK).json({ result: "Test case updated successfully" })
}

export const updateExecutionStatus = async (req, res) => {
  const { testCaseId, sessionId } = req.body

  if (!testCaseId || !sessionId) {
    throw new BadRequestError("All fields are required")
  }

  await ExecutionQueueModel.updateOne(
    { testCaseId, sessionId },
    { executionStatus: "started" }
  )

  res
    .status(StatusCodes.OK)
    .json({ result: "Execution status updated successfully" })
}
