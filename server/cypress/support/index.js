cypress / support / index.js
let testAttributesToSend

// sends test results to the plugins process
// using cy.task https://on.cypress.io/task
const sendTestAttributes = () => {
  if (!testAttributesToSend) {
    return
  }

  console.log(
    "sending test attributes: %s %s",
    testAttributesToSend.title,
    testAttributesToSend.state
  )

  const attr = testAttributesToSend

  testAttributesToSend = null

  cy.task("testFinished", attr)
}

beforeEach(sendTestAttributes)

after(sendTestAttributes)

// you cannot execute async code from event callbacks
// thus we need to be patient and send the test results
// when the next test starts, or after all tests finish
Cypress.on("test:after:run", (attributes, test) => {
  console.log("attributes", attributes)
  testAttributesToSend = attributes
})
