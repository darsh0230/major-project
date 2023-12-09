import Head from "next/head"
import Navbar from "@/components/shared/navbar/navbar"
import { use, useEffect, useState } from "react"
import { ProjModel } from "@/models/projModel"
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye"
import { useRouter } from "next/router"
import { useSelector } from "react-redux"
import { selectUser } from "@/redux/userSlice"
import Image from "next/image"
import Link from "next/link"

function ProjectCard({ proj }: { proj: ProjModel }) {
  return (
    <Link
      href="/project/1"
      className="w-full min-w-[200px] max-w-md m-5 p-3 border border-gray-600 bg-neutral-900 hover:bg-neutral-800 rounded-md">
      <div className="w-full flex flex-col">
        <div className="w-full flex justify-between">
          {/* Icon */}
          <div className="flex">
            <div className="h-full grid place-items-center">
              <Image
                src={`https://${proj.projectDomain}/favicon.ico`}
                width={48}
                height={48}
                alt={proj.pname}
              />
            </div>
            <div className="w-4" />
            {/* title */}
            <div className="flex flex-col">
              <div className="font-semibold text-lg">{proj.pname}</div>
              <div className="h-2" />
              <div className="text-xs text-zinc-400">{proj.projectDomain}</div>
            </div>
          </div>
          {/* Other options */}
          <div className="h-full grid place-items-center p-1 hover:bg-zinc-500 rounded-full">
            <RemoveRedEyeIcon />
          </div>
        </div>

        <div className="h-8" />

        {/* test cases number */}
        <div>
          Test Cases Passed : <span className="text-green-500">5/7</span>
        </div>
        <div className="h-1" />
        <div>Total Pages : 5</div>
        <div className="h-2" />
      </div>
    </Link>
  )
}

export default function Home() {
  const user = useSelector(selectUser)
  const router = useRouter()

  const [allProjs, setAllProjs] = useState<ProjModel[]>([])

  // useEffect(() => {
  //   if (user && !user.token) {
  //     router.push("/auth/signup")
  //   }
  // }, [user])

  useEffect(() => {
    setAllProjs([
      {
        pid: "1",
        pname: "Vercel",
        projectDomain: "vercel.com",
        testcasesPassed: 5,
        totalTestcases: 5,
      },
      {
        pid: "1",
        pname: "NextJS",
        projectDomain: "nextjs.org",
        testcasesPassed: 5,
        totalTestcases: 5,
      },
      {
        pid: "1",
        pname: "Google",
        projectDomain: "google.com",
        testcasesPassed: 5,
        totalTestcases: 5,
      },
    ])
  }, [])

  return (
    <>
      <Head>
        <title>Mini Project</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="w-full flex flex-col">
        <Navbar />
        <div className="h-32" />

        {/* dashboard content */}
        <div className="w-full p-3 flex flex-wrap justify-center">
          {allProjs.map((proj, i) => (
            <ProjectCard proj={proj} key={i} />
          ))}
        </div>
      </main>
    </>
  )
}
