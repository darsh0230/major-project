import Navbar from "@/components/shared/navbar/navbar"
import { ProjModel } from "@/models/projModel"
import { useRouter } from "next/router"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { selectUser } from "@/redux/userSlice"
import { useSelector } from "react-redux"

import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye"
import EditIcon from "@mui/icons-material/Edit"
import AddIcon from "@mui/icons-material/Add"
import MemoryIcon from "@mui/icons-material/Memory"
import NotStartedIcon from "@mui/icons-material/NotStarted"

import { PageModel } from "@/models/pageModel"
import { getAllPages } from "@/services/webPages"
import Link from "next/link"

import TestcaseLogsModal from "@/components/shared/modal/testCaseLogsModal"
import { generateTestCases } from "@/services/generateTestCases"
import { executeTestCases } from "@/services/executeTestCases"

function PageRow({
  page,
  setLogs,
  setIsTestCaseLogsModalOpen,
}: {
  page: PageModel
  setLogs: Dispatch<SetStateAction<String>>
  setIsTestCaseLogsModalOpen: Dispatch<SetStateAction<boolean>>
}) {
  const handleGenerateTestCasesBtn = () => {
    setLogs("")
    setIsTestCaseLogsModalOpen(true)
    generateTestCases(setLogs, page.projectId, page.pageId).then((res) => {})
  }

  const handleExecuteTestCasesBtn = () => {
    setLogs("")
    setIsTestCaseLogsModalOpen(true)
    executeTestCases({
      setData: setLogs,
      projectId: page.projectId,
      pageId: page.pageId,
      textCaseId: undefined,
    }).then((res) => {})
  }
  return (
    <div className="w-full p-3 px-5 flex justify-between items-center rounded-md bg-zinc-900">
      <div className="basis-0 flex-1">{page.pageName}</div>
      <div className="basis-0 flex-1 text-center">
        Test Cases Passed :{" "}
        <span className="text-green-500">
          {page.testcasesPassed.toString()}/{page.totalTestcases.toString()}
        </span>
      </div>
      <div className="flex basis-0 flex-1 justify-end">
        <button
          className="p-1 rounded-full hover:hover:bg-zinc-800"
          onClick={handleGenerateTestCasesBtn}
          title="Generate Test Cases">
          <NotStartedIcon />
        </button>
        <button
          className="p-1 rounded-full hover:hover:bg-zinc-800"
          onClick={handleExecuteTestCasesBtn}
          title="Execute Test Cases">
          <MemoryIcon />
        </button>
        <Link
          className="p-1 rounded-full hover:hover:bg-zinc-800"
          href={`/project/${page.projectId}/page/${page.pageId}`}>
          <RemoveRedEyeIcon />
        </Link>
        <div className="w-1" />
        <Link
          className="p-1 rounded-full hover:hover:bg-zinc-800"
          href={`/project/${page.projectId}/edit`}>
          <EditIcon />
        </Link>
      </div>
    </div>
  )
}

function ProjDetails() {
  const router = useRouter()
  const user = useSelector(selectUser)

  const [allPages, setAllPages] = useState<PageModel[]>([])
  const [isTestCaseLogsModalOpen, setIsTestCaseLogsModalOpen] = useState(false)
  const [testCaseLogs, setTestCaseLogs] = useState<String>("")

  useEffect(() => {
    if (user && !user.token) {
      router.push("/auth/signup")
    }
  }, [user])

  useEffect(() => {
    if (!router.query.projectId) return
    ;(async () => {
      const allPages = await getAllPages(router.query.projectId as string)
      setAllPages(allPages || [])
    })()
  }, [router])

  return (
    <>
      <TestcaseLogsModal
        isModalOpen={isTestCaseLogsModalOpen}
        setIsModalOpen={setIsTestCaseLogsModalOpen}
        logs={testCaseLogs}
      />
      <div className="w-full flex flex-col p-5 gap-y-2">
        <Navbar />
        <div className="h-32" />
        {/* Pages */}
        {allPages.map((page, i) => (
          <PageRow
            page={page}
            setLogs={setTestCaseLogs}
            setIsTestCaseLogsModalOpen={setIsTestCaseLogsModalOpen}
            key={i}
          />
        ))}

        <div className="h-4" />

        <Link
          className="w-full py-3 flex justify-center items-center bg-zinc-900 hover:hover:bg-zinc-800 rounded-md"
          href={`/project/${router.query.projectId ?? ""}/page/create`}>
          <AddIcon /> <div className="w-2" /> <div>Add Page</div>
        </Link>
      </div>
    </>
  )
}

export default ProjDetails
