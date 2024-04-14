import { ChatOpenAI } from "@langchain/openai"
import { ChatPromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser } from "@langchain/core/output_parsers"
import dotenv from "dotenv"
import { logger } from "./logger.js"
dotenv.config()

const outputParser = new StringOutputParser()

const chatModel = new ChatOpenAI({
  apiKey: process.env.EXPAPP_OPENAPI_KEY,
  modelName: "gpt-3.5-turbo",
})

async function run_langchain(system_message, user_message) {
  const prompt = ChatPromptTemplate.fromMessages([
    ["system", system_message],
    ["user", "{user_message}"],
  ])

  const chain = prompt.pipe(chatModel).pipe(outputParser)

  var response = undefined
  await chain
    .invoke({
      user_message,
    })
    .then((resp) => {
      response = resp
    })

  return response
}

export async function lang_generate_test_cases(
  description,
  initial_test_cases_list
) {
  var system_message = `<s>[INST] As a QA tester engineer in a reputed company, your task is to generate all possible test cases based on the description of a webpage given by the user :
Output example format : 1. verify if the webpage opens
Only output the test cases and no other text
[/INST] </s>
`

  // generate list of test cases for the webpage
  const test_cases_list = new Set(initial_test_cases_list)
  for (let i = 0; i < 3; i++) {
    const chat_response = (
      await run_langchain(system_message, description)
    ).split("\n")

    for (const i in chat_response) {
      if (chat_response[i].length < 5) continue
      test_cases_list.add(
        chat_response[i].toLocaleLowerCase().replace(/\d+\./g, "").trim()
      )
    }
    test_cases_list.add(chat_response)
  }

  // remove duplicates

  system_message = `<s>[INST] You are a automated bot thats only reponsible to output the test cases without the duplicates in the same json format from the user input.
Output only the test cases without any other text
[/INST] </s>
`

  try {
    const result = JSON.parse(
      (await run_langchain(system_message, Array.from(test_cases_list)))
        .replace("```json", "")
        .replace("```", "")
    )
    return result
  } catch (e) {
    console.log(e)
    return []
  }
}

export async function lang_generate_test_case_code(
  description,
  webUrl,
  test_case
) {
  const system_message = `<s>[INST] You  As a QA tester engineer in a reputed company, your task is to generate cypress code for the given test case. You are provided with the description of the webpage along with the page url. Use these to understand the webpage elements and use the url whereever required.
Specify the placeholders in the comments of the cypress code if any.
Output only the cypress code without any other text.
[/INST] </s>
`
  const user_message = `description: ${description}
url: ${webUrl}
Test case: ${test_case}
`

  logger.info(`Generated test case code for test case: ${test_case}`)
  const chat_response = await run_langchain(system_message, user_message)
  logger.info(
    `Generated test case code (before formatting): \n${chat_response}`
  )

  var x = -1
  var y = -1
  var i = 1
  while (i <= chat_response.length) {
    if (chat_response.at(i) == "{") {
      x = i
    }
    if (chat_response.at(-i) == "}") {
      y = -i
    }
    i++
  }

  logger.info(
    `Generated test case code (after formatting): \n${chat_response.slice(
      x + 1,
      y
    )}`
  )

  return chat_response.slice(x + 1, y)
}
