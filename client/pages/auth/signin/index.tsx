import Head from "next/head";
import Link from "next/link";
import Navbar from "../../../components/shared/navbar/navbar";
import jwt from "jsonwebtoken";

// icons
import PasswordIcon from "@mui/icons-material/Password";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import validator from "validator";

import { PulseLoader } from "react-spinners";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { emailLogin } from "../../../services/auth";
import { useRouter } from "next/router";
import { selectUser } from "../../../redux/userSlice";

function SignIn() {
  const [fieldValues, setFieldValues] = useState({
    email: "",
    pwd: "",
  });
  const errInitState = {
    email: "",
    pwd: "",
  };
  const [errField, setErrField] = useState(errInitState);

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const router = useRouter();

  async function handleRegisterBtnClick() {
    setIsLoading(true);
    setErrField(errInitState);
    var isValid = true;

    if (!validator.isEmail(fieldValues.email)) {
      isValid = false;
      setErrField((v) => ({ ...v, email: "Enter Valid Email" }));
    }

    if (fieldValues.pwd.length < 8) {
      isValid = false;
      setErrField((v) => ({
        ...v,
        pwd: "Min. password length is 8 characters",
      }));
    }

    if (isValid) {
      var res = await emailLogin(fieldValues.email, fieldValues.pwd, dispatch);
      if (typeof res === "string")
        setErrField((v) => ({ ...v, email: res.toString() }));
      else if (res) router.push("/");
    }

    setIsLoading(false);
  }

  useEffect(() => {
    if (user) {
      const decoded: any = jwt.decode(user.token);
      if (decoded) {
        if (!decoded["email"]) router.push("/");
      }
    }
    // console.log(user?.token);
    // console.log(jwt.decode(user?.token ?? ""));
  }, [user]);

  return (
    <div className="h-screen text-white ">
      <Head>
        <title>Dimenl</title>
      </Head>
      <Navbar />
      <div className="lg:h-full w-full flex flex-col">
        <div className="h-20" />
        <div className="h-3 md:h-1" />
        <div className="lg:h-full w-full grid place-items-center p-5">
          <div className="relative h-[500px] lg:h-4/5 w-full md:w-1/2 lg:w-1/4 border-x-[1px] border-b-[1px] rounded-lg">
            <div className="absolute h-full w-full p-3 px-5 border-t-4 rounded-lg border-green-500 flex flex-col items-center">
              <div className="h-3" />
              <div className="text-5xl">Signin</div>
              <div className="h-20" />

              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <AlternateEmailIcon />
                </div>
                <input
                  type="email"
                  value={fieldValues.email}
                  onChange={(v) =>
                    setFieldValues((f) => ({ ...f, email: v.target.value }))
                  }
                  className={`w-full p-2.5 pl-11 bg-transparent border-2 text-sm rounded-md ${
                    errField.email !== ""
                      ? "border-red-400 focus:border-red-500"
                      : "border-gray-400 focus:border-white"
                  }`}
                  placeholder="Email"
                />
              </div>

              <div className="w-full pl-5 pt-1 text-xs text-red-500 text-left">
                {errField.email}
              </div>

              {/* password */}
              <div className="h-2" />
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <PasswordIcon />
                </div>
                <input
                  type="password"
                  value={fieldValues.pwd}
                  onChange={(v) =>
                    setFieldValues((f) => ({ ...f, pwd: v.target.value }))
                  }
                  className={`w-full p-2.5 px-11 bg-transparent border-2 text-sm rounded-md ${
                    errField.pwd !== ""
                      ? "border-red-400 focus:border-red-500"
                      : "border-gray-400 focus:border-white"
                  }`}
                  placeholder="Password"
                />
                {/* <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <button>
                    <VisibilityIcon />
                  </button>
                </div> */}
              </div>

              <div className="w-full pl-5 pt-1 text-xs text-red-500 text-left">
                {errField.pwd}
              </div>

              {/*  */}
              <div className="h-2" />
              <div className="w-full flex justify-between">
                <div className="text-sm">
                  Not a member?{" "}
                  <Link href={"/auth/signup"} className="underline">
                    Sign Up
                  </Link>{" "}
                </div>
                <div className="text-sm text-red-400">Forgot password?</div>
              </div>

              {/* Login Button */}
              <div className="h-5" />
              <button
                onClick={handleRegisterBtnClick}
                disabled={isLoading}
                className="w-full h-10 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg">
                {isLoading ? (
                  <PulseLoader
                    color="#fff"
                    size={10}
                    cssOverride={{ margin: "0px", padding: "0px" }}
                  />
                ) : (
                  "Sign in"
                )}
              </button>

              {/* Spacer */}
              <div className="h-5" />
              <div className="w-full flex items-center">
                <div className="h-[1px] w-4/5 bg-white" />
                <div className="px-2">OR</div>
                <div className="h-[1px] w-4/5 bg-white" />
              </div>

              {/* other login options */}
              <div className="h-5" />
              <div className="w-full flex justify-around">
                <button className="hover:bg-slate-600 p-1 rounded-md">
                  <GoogleIcon fontSize="large" />
                </button>
                <button className="hover:bg-slate-600 p-1 rounded-md">
                  <FacebookIcon fontSize="large" />
                </button>
                <button className="hover:bg-slate-600 p-1 rounded-md">
                  <LinkedInIcon fontSize="large" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
