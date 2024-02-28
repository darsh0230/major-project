const updateTestCaseResult = async () => {
  const isPassed = cy.state("runnable").ctx.currentTest.state == "passed"
  const errorMsg = cy.state("runnable").ctx.currentTest.err
  const testCaseId = cy.state("runnable").ctx.currentTest.parent.title
  const sessionId = cy
    .state("runnable")
    .ctx.currentTest.parent.parent.file.split("\\")
    .at(-1)
    .split(".")[0]

  var resultMsg = ""

  if (isPassed) {
    resultMsg = "Test Passed"
  } else {
    resultMsg = `Test Failed\nName: ${errorMsg.name}\nType: ${errorMsg.type}\nMessage: ${errorMsg.message}`
  }

  await fetch("http://localhost:5000/api/v1/testCases/updateTestCaseStatus", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ isPassed, resultMsg, testCaseId, sessionId }),
  }).catch((e) => {})

  // const propObj = cy.state("runnable").ctx.currentTest.err
  // for (const prop in propObj) {
  //   cy.log(prop, propObj[prop])
  // }
}

const updateExecutionQueue = async () => {
  const sessionId = cy
    .state("runnable")
    .ctx.currentTest.parent.parent.file.split("\\")
    .at(-1)
    .split(".")[0]

  const testCaseId = cy.state("runnable").ctx.currentTest.parent.title

  await fetch("http://localhost:5000/api/v1/testCases/updateExecutionStatus", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ sessionId, testCaseId }),
  }).catch((e) => {})
}

beforeEach(updateExecutionQueue)
afterEach(updateTestCaseResult)
