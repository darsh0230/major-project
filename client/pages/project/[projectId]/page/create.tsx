import Navbar from "@/components/shared/navbar/navbar"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import jwt from "jsonwebtoken"
import { selectUser } from "@/redux/userSlice"
import { useSelector } from "react-redux"
import { createProject } from "@/services/projects"

function CreateProj() {
  const router = useRouter()
  const user = useSelector(selectUser)

  type initProps = { pname: string; projectUrl: string }
  const initValues: initProps = {
    pname: "",
    projectUrl: "",
  }

  const [projDetails, setProjDetails] = useState<initProps>(initValues)

  const handleSubmitBtnClick = async () => {
    if (!projDetails.pname || !projDetails.projectUrl) {
      return
    }

    if (await createProject(projDetails)) {
      router.push("/")
    }
  }

  useEffect(() => {
    if (user && !user.token) {
      router.push("/auth/signup")
    }
  }, [user])

  return (
    <div className="w-full flex flex-col">
      <Navbar />
      <div className="h-32" />

      {/* Form to create new project */}
      <div className="w-full h-full flex px-40">
        <div className="w-full h-full flex flex-col border-2 border-white rounded-md">
          {/* name */}
          <div className="flex justify-between items-center p-8">
            <div>Project Name : </div>
            <input
              type="text"
              value={projDetails.pname}
              onChange={(v) =>
                setProjDetails((f) => ({ ...f, pname: v.target.value }))
              }
              className={
                "p-2.5 pl-11 bg-transparent border text-sm rounded-md border-gray-400 focus:border-white"
              }
            />
          </div>

          {/* github */}
          <div className="flex justify-between items-center p-8">
            <div>Project Url : </div>
            <input
              type="text"
              value={projDetails.projectUrl}
              onChange={(v) =>
                setProjDetails((f) => ({ ...f, projectUrl: v.target.value }))
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
            Create Project
          </button>
        </div>
      </div>
    </div>
  )
}

export default CreateProj
