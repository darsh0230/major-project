import Navbar from "@/components/shared/navbar/navbar"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { selectUser } from "@/redux/userSlice"
import { useSelector } from "react-redux"
import { addPage } from "@/services/webPages"

function CreateProj() {
  const router = useRouter()
  const user = useSelector(selectUser)

  type initProps = {
    pageName: string
    pageUrl: string
    pageDescription: string
    projectId: string
  }
  const initValues: initProps = {
    pageName: "",
    pageUrl: "",
    pageDescription: "",
    projectId: "",
  }

  const [pageDetails, setPageDetails] = useState<initProps>(initValues)

  const handleSubmitBtnClick = async () => {
    if (
      !pageDetails.pageName ||
      !pageDetails.pageUrl ||
      !pageDetails.pageDescription
    ) {
      return
    }

    if (await addPage(pageDetails)) {
      router.push(`/project/${router.query.projectId}`)
    }
  }

  useEffect(() => {
    if (user && !user.token) {
      router.push("/auth/signup")
    }
  }, [user])

  useEffect(() => {
    if (router.query.projectId) {
      setPageDetails((f) => ({
        ...f,
        projectId: router.query.projectId as string,
      }))
    }
  }, [router])

  return (
    <div className="w-full flex flex-col">
      <Navbar />
      <div className="h-32" />

      {/* Form to create new project */}
      <div className="w-full h-full flex px-40">
        <div className="w-full h-full flex flex-col border-2 border-white rounded-md">
          {/* name */}
          <div className="flex justify-between items-center p-8">
            <div>Page Name : </div>
            <input
              type="text"
              value={pageDetails.pageName}
              onChange={(v) =>
                setPageDetails((f) => ({ ...f, pageName: v.target.value }))
              }
              className={
                "p-2.5 pl-11 bg-transparent border text-sm rounded-md border-gray-400 focus:border-white"
              }
            />
          </div>

          {/* url */}
          <div className="flex justify-between items-center p-8">
            <div>Page Url : </div>
            <input
              type="text"
              value={pageDetails.pageUrl}
              onChange={(v) =>
                setPageDetails((f) => ({ ...f, pageUrl: v.target.value }))
              }
              className={
                "w-1/2 p-2.5 pl-11 bg-transparent border text-sm rounded-md border-gray-400 focus:border-white"
              }
            />
          </div>

          {/* desc */}
          <div className="flex justify-between items-center p-8">
            <div>Page Description : </div>
            <input
              type="text"
              value={pageDetails.pageDescription}
              onChange={(v) =>
                setPageDetails((f) => ({
                  ...f,
                  pageDescription: v.target.value,
                }))
              }
              className={
                "w-1/2 p-2.5 pl-11 bg-transparent border text-sm rounded-md border-gray-400 focus:border-white"
              }
            />
          </div>

          {/* Deploy button */}
          <button
            className="m-4 bg-transparent hover:bg-white text-white hover:text-black py-2 px-4 border border-white hover:border-transparent rounded font-light"
            onClick={handleSubmitBtnClick}>
            Add Page
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateProj
