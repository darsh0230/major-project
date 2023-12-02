import axios from "axios";
import { UserModel } from "../models/userModel";
import { Dispatch } from "@reduxjs/toolkit";
import { deleteToken, updateToken } from "../redux/userSlice";

export async function emailRegister(
  email: string,
  password: string,
  dispatch: Dispatch
): Promise<boolean | string> {
  var user: UserModel | undefined = undefined;

  if (!process.env.NEXT_PUBLIC_SERVER_URL) throw "Server Url Not Set";
  const url = process.env.NEXT_PUBLIC_SERVER_URL + "/auth/register";

  try {
    var res = await axios.post(
      url,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.status === 201) {
      user = {
        ...res.data.user,
        token: res.data.token,
      };

      localStorage.setItem("Token", user?.token ?? "");
      dispatch(updateToken({ token: user?.token }));
      return true;
    }
  } catch (e: any) {
    return e.response.data.msg;
  }

  return false;
}

export async function emailLogin(
  email: string,
  password: string,
  dispatch: Dispatch
): Promise<boolean | string> {
  var user: UserModel | undefined = undefined;

  if (!process.env.NEXT_PUBLIC_SERVER_URL) throw "Server Url Not Set";
  const url = process.env.NEXT_PUBLIC_SERVER_URL + "/auth/login";

  try {
    var res = await axios.post(
      url,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (res.status === 200) {
      user = {
        ...res.data.user,
        token: res.data.result.token,
      };

      localStorage.setItem("Token", user?.token ?? "");
      dispatch(updateToken({ token: user?.token }));
      return true;
    }
  } catch (e: any) {
    return e.response.data.msg;
  }

  return false;
}

export function logout(dispatch: Dispatch) {
  localStorage.removeItem("Token");
  dispatch(deleteToken());
}
