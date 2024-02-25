import WebPageModel from "../models/webPageModel.js"
import TestCaseModel from "../models/testCasesModel.js"
import { StatusCodes } from "http-status-codes"
import { BadRequestError, UnauthenticatedError } from "../utils/errors.js"
import { exec } from "child_process"

function generateTestCaseList(pageDesc) {
  return [
    "Verify that both email and password fields are present",
    "Verify that the email field accepts valid email addresses",
    "Verify that the email field does not accept invalid email formats",
    "Verify that the password field accepts input",
    "Verify that the password field hides the entered characters",
    // "Verify that the login button is present",
    // "Verify that clicking on the login button with empty fields does not proceed with login",
    // "Verify that clicking on the login button with only email filled does not proceed with login",
    // "Verify that clicking on the login button with only password filled does not proceed with login",
    // "Verify that clicking on the login button with both email and password filled proceeds with login",
  ]
}

function generateTestCase(pageDesc, url, testCase) {
  return `console.log('Hello World')`
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

    const testCasesList = generateTestCaseList(page.pageDescription)

    // for each test case
    for (let j = 0; j < testCasesList.length; j++) {
      res.write(`Generating test case : ${testCasesList[j]} \n`)
      const testCaseCode = generateTestCase(
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
        { totalTestcases: testCasecount }
      )
    }
  }

  res.write("\nProcess Successfully Completed \n")
  res.end()

  // res.status(StatusCodes.OK).json({ testCase })
}

// ----------------------------------------------------------------------

function executeCode(code) {
  return { isPassed: true, resultMsg: "Test Passed" }
}

export const executeTestCases = async (req, res) => {
  res.setHeader("Content-Type", "text/plain")
  res.setHeader("Transfer-Encoding", "chunked")

  const { projectId, pageIds, testCasesIds } = req.body
  const uid = req.user.uid
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
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i]
    res.write(`Executing test case : ${testCase.testCaseName} \n`)
    const result = executeCode(testCase.code)
    await TestCaseModel.updateOne(
      { _id: testCase._id },
      { isPassed: result.isPassed, resultMsg: result.resultMsg }
    )

    // get count of passed test cases
    const passedCount = await TestCaseModel.countDocuments({
      projectId,
      webPageId: testCase.webPageId,
      isPassed: true,
    })

    await WebPageModel.updateOne(
      { pageId: testCase.webPageId, uid },
      { testcasesPassed: passedCount }
    )
  }
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
