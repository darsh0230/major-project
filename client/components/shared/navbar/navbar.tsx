import Logo from "../logo/logo"
import CloseIcon from "@mui/icons-material/Close"
import Link from "next/link"
import jwt from "jsonwebtoken"
import { useDispatch, useSelector } from "react-redux"
import { selectUser } from "@/redux/userSlice"
import { use, useEffect, useState } from "react"
import { logout } from "@/services/auth"
import { useRouter } from "next/router"
import LogoutIcon from "@mui/icons-material/Logout"

function PageLinks() {
  return (
    <>
      <Link href="/project/create" className="font-light text-lg">
        Create Project +
      </Link>
    </>
  )
}

function UserAuth({ isLoggedIn }: { isLoggedIn: boolean }) {
  // const [showAuth, setShowAuth] = useState<boolean>(true)

  // const user = useSelector(selectUser)
  const dispatch = useDispatch()

  const router = useRouter()

  // useEffect(() => {
  //   if (user) {
  //     const decoded: any = jwt.decode(user.token)
  //     if (decoded) {
  //       if (!decoded["email"]) setShowAuth(false)
  //       setShowAuth(false)
  //     }
  //   }
  // }, [user])

  return (
    <>
      {!isLoggedIn ? (
        <div className="h-full pr-10 flex justify-between items-center ">
          <Link href="/auth/signin" className="font-light text-lg">
            Login
          </Link>
          <div className="w-6" />
          <Link
            href="/auth/signup"
            className="bg-transparent hover:bg-white text-white hover:text-black py-2 px-4 border border-white hover:border-transparent rounded font-light">
            SignUp
          </Link>
        </div>
      ) : (
        <div className="h-full pr-10 flex justify-between items-center ">
          <button
            className="flex items-center font-light text-lg"
            onClick={() => {
              logout(dispatch)
              router.push("/auth/signup")
            }}>
            <LogoutIcon />
            <div className="w-2" />
            Logout
          </button>
        </div>
      )}
    </>
  )
}

function Navbar() {
  const [showDrawer, setShowDrawer] = useState<boolean>(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  useEffect(() => {
    if (localStorage.getItem("Token")) {
      setIsLoggedIn(true)
    }
  }, [])

  return (
    <div>
      <div className="w-full top-0 h-20 fixed backdrop-blur-md z-20 border-white border-b">
        {/* desktop layout */}
        <div className="hidden md:flex justify-between items-center">
          <div className="pl-10">
            <Logo />
          </div>
          <div className="flex-grow flex justify-end px-20">
            <div className="h-full md:w-full lg:w-[80%] flex justify-around">
              {isLoggedIn ? <PageLinks /> : <div />}
            </div>
          </div>
          <UserAuth isLoggedIn={isLoggedIn} />
        </div>

        <div className="flex md:hidden justify-between items-center">
          <div className="ml-3">
            <Logo />
          </div>
          <button
            className="space-y-2 mr-5 p-2 border-white rounded-md"
            onClick={() => setShowDrawer(true)}>
            <span className="block w-8 h-1 bg-white"></span>
            <span className="block w-8 h-1 bg-white"></span>
            <span className="block w-5 h-1 bg-white"></span>
          </button>
        </div>
        {/* border */}
        <div className="h-[0.5px] md:h-0 w-4/5 m-auto bg-white" />
      </div>
      {/* Drawer for mobile view only*/}
      <div
        className={
          "fixed md:hidden top-0 right-0 h-screen w-screen backdrop-blur-sm z-30 transition duration-300 ease-in-out " +
          (showDrawer ? "translate-x-0" : "translate-x-[100vw]")
        }>
        <div className="h-full w-4/5 absolute top-0 right-0 bg-zinc-800 rounded-l-2xl p-10">
          <div className="flex flex-col h-3/4 justify-around items-center">
            {/* <div className="h-10" /> */}
            <button className="self-end" onClick={() => setShowDrawer(false)}>
              <CloseIcon />
            </button>
            <PageLinks />
            <div className="self-end">
              <UserAuth isLoggedIn={isLoggedIn} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
