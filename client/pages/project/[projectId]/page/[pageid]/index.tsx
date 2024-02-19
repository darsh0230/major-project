import Navbar from "@/components/shared/navbar/navbar"
import { ProjModel } from "@/models/projModel"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { selectUser } from "@/redux/userSlice"
import { useSelector } from "react-redux"

import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye"
import EditIcon from "@mui/icons-material/Edit"
import AddIcon from "@mui/icons-material/Add"
import { CopyBlock, dracula } from "react-code-blocks"
import Editor from "react-simple-code-editor"
// import { highlight, languages } from "prismjs/components/prism-core"
import { highlight, languages, highlightElement } from "prismjs"

import { PageModel } from "@/models/pageModel"
import { TestCaseModel } from "@/models/testCaseModel"

function PageRow({ testCase }: { testCase: TestCaseModel }) {
  const [code, setCode] = useState(testCase.code)

  return (
    <div className="w-full p-3 px-5 flex flex-col rounded-md bg-zinc-900">
      {/* test cases header */}
      <div className="w-full flex justify-between">
        <div className="font-semibold">
          Test Case :{" "}
          <span className="font-extralight">{testCase.testCaseName}</span>
        </div>
        <div className={testCase.isPassed ? "text-green-500" : "text-red-500"}>
          {testCase.isPassed ? "Passed" : "Failed"}
        </div>
      </div>
      {/* test cases code and result */}
      <div className="h-4" />
      <div className="w-full flex">
        <div className="w-full">
          {/* <Editor
            value={code}
            className="w-full p-2 bg-zinc-800 rounded-md"
            onValueChange={(code) => setCode(code)}
            highlight={(code) => highlight(code, languages.js, "javascript")}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 14,
            }}
          /> */}

          <CopyBlock
            text={code}
            language={"javascript"}
            showLineNumbers={true}
            theme={dracula}
          />
        </div>
        <div className="w-6" />
        <code className="w-full p-2 bg-zinc-800 rounded-md">
          {testCase.resultMsg}
        </code>
      </div>
      <div className="h-4" />
    </div>
  )
}

function ProjDetails() {
  const router = useRouter()
  const user = useSelector(selectUser)

  const { pid, pageid } = router.query

  const [allTestCases, setAllTestCases] = useState<TestCaseModel[]>([])

  useEffect(() => {
    if (user && !user.token) {
      router.push("/auth/signup")
    }
  }, [user])

  useEffect(() => {
    setAllTestCases([
      {
        pid: "string",
        pageId: "string",
        testCaseId: "string",
        testCaseName: "Check if page is loading",
        isPassed: true,
        code: "var i = 10",
        resultMsg: "Executed successfully",
      },
      {
        pid: "string",
        pageId: "string",
        testCaseId: "string",
        testCaseName: "string",
        isPassed: false,
        code: "string",
        resultMsg: "string",
      },
      {
        pid: "string",
        pageId: "string",
        testCaseId: "string",
        testCaseName: "string",
        isPassed: true,
        code: "string",
        resultMsg: "string",
      },
    ])
  }, [])

  return (
    <div className="w-full flex flex-col p-5 gap-y-2">
      <Navbar />
      <div className="h-32" />
      {/* Pages */}
      {allTestCases.map((testCase, i) => (
        <PageRow testCase={testCase} key={i} />
      ))}

      <div className="h-4" />

      <button className="w-full py-3 flex justify-center items-center bg-zinc-900 hover:hover:bg-zinc-800 rounded-md">
        <AddIcon /> <div className="w-2" /> <div>Add Page</div>
      </button>
    </div>
  )
}

export default ProjDetails
