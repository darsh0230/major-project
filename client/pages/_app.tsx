import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { wrapper } from "../redux/store";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateToken } from "../redux/userSlice";
import { UserModel } from "../models/userModel";

function App({ Component, pageProps }: AppProps) {
  async function checkUser(): Promise<UserModel | undefined> {
    if (localStorage.getItem("Token") != null) {
      const token: string | undefined = localStorage
        .getItem("Token")
        ?.toString();
      return { token: token || "" };
    }
  }

  const disptch = useDispatch();
  useEffect(() => {
    async function callAsyncc() {
      const user = await checkUser();
      disptch(updateToken({ token: user?.token }));
    }
    callAsyncc();
  }, []);

  return <Component {...pageProps} />;
}

export default wrapper.withRedux(App);
