import "@/styles/globals.css"
import type { AppProps } from "next/app"
import { wrapper } from "../redux/store"
import { useEffect } from "react"
import { useRouter } from "next/router"

function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  useEffect(() => {
    if (!localStorage.getItem("Token")) {
      router.push("/auth/signin")
    }
  }, [])

  return <Component {...pageProps} />
}

export default wrapper.withRedux(App)
