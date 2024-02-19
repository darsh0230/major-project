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
import { getAllPages } from "@/services/webPages"
import Link from "next/link"

function PageRow({ page }: { page: PageModel }) {
  return (
    <div className="w-full p-3 px-5 flex justify-between items-center rounded-md bg-zinc-900">
      <div className="basis-0 flex-1">{page.PageName}</div>
      <div className="basis-0 flex-1 text-center">
        Test Cases Passed :{" "}
        <span className="text-green-500">
          {page.testcasesPassed.toString()}/{page.totalTestcases.toString()}
        </span>
      </div>
      <div className="flex basis-0 flex-1 justify-end">
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

  useEffect(() => {
    if (user && !user.token) {
      router.push("/auth/signup")
    }
  }, [user])

  useEffect(() => {
    console.log(router.query)
    ;(async () => {
      const allPages = await getAllPages(router.query.projectId as string)
      setAllPages(allPages || [])
    })()
  }, [])

  return (
    <div className="w-full flex flex-col p-5 gap-y-2">
      <Navbar />
      <div className="h-32" />
      {/* Pages */}
      {allPages.map((page, i) => (
        <PageRow page={page} key={i} />
      ))}

      <div className="h-4" />

      <Link
        className="w-full py-3 flex justify-center items-center bg-zinc-900 hover:hover:bg-zinc-800 rounded-md"
        href={`/project/${allPages[0]?.projectId ?? ""}/page/create`}>
        <AddIcon /> <div className="w-2" /> <div>Add Page</div>
      </Link>
    </div>
  )
}

export default ProjDetails
