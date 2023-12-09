import Navbar from "@/components/shared/navbar/navbar"
import { ProjModel } from "@/models/projModel"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { selectUser } from "@/redux/userSlice"
import { useSelector } from "react-redux"

import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye"
import EditIcon from "@mui/icons-material/Edit"
import AddIcon from "@mui/icons-material/Add"

import { PageModel } from "@/models/pageModel"

function PageRow({ pageModel }: { pageModel: PageModel }) {
  return (
    <div className="w-full p-3 px-5 flex justify-between items-center rounded-md bg-zinc-900">
      <div className="basis-0 flex-1">{pageModel.PageName}</div>
      <div className="basis-0 flex-1 text-center">
        Test Cases Passed : <span className="text-green-500">5/7</span>
      </div>
      <div className="flex basis-0 flex-1 justify-end">
        <button className="p-1 rounded-full hover:hover:bg-zinc-800">
          <RemoveRedEyeIcon />
        </button>
        <div className="w-1" />
        <button className="p-1 rounded-full hover:hover:bg-zinc-800">
          <EditIcon />
        </button>
      </div>
    </div>
  )
}

function ProjDetails() {
  const router = useRouter()
  const user = useSelector(selectUser)

  const { pid } = router.query

  const [allPages, setAllPages] = useState<PageModel[]>([])

  useEffect(() => {
    if (user && !user.token) {
      router.push("/auth/signup")
    }
  }, [user])

  useEffect(() => {
    setAllPages([
      {
        pid: "string",
        pageId: "string",
        PageName: "Home Page",
        pageUrl: "string",
        pageDescription: "string",
        testcasesPassed: 0,
        totalTestcases: 0,
      },
      {
        pid: "string",
        pageId: "string",
        PageName: "Login Page",
        pageUrl: "string",
        pageDescription: "string",
        testcasesPassed: 0,
        totalTestcases: 0,
      },
      {
        pid: "string",
        pageId: "string",
        PageName: "Sign Up Page",
        pageUrl: "string",
        pageDescription: "string",
        testcasesPassed: 0,
        totalTestcases: 0,
      },
    ])
  }, [])

  return (
    <div className="w-full flex flex-col p-5 gap-y-2">
      <Navbar />
      <div className="h-32" />
      {/* Pages */}
      {allPages.map((pageModel, i) => (
        <PageRow pageModel={pageModel} key={i} />
      ))}

      <div className="h-4" />

      <button className="w-full py-3 flex justify-center items-center bg-zinc-900 hover:hover:bg-zinc-800 rounded-md">
        <AddIcon /> <div className="w-2" /> <div>Add Page</div>
      </button>
    </div>
  )
}

export default ProjDetails
