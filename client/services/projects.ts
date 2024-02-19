import { ProjModel } from "@/models/projModel"
import axios from "axios"

export async function getAllProjects(): Promise<ProjModel[] | null> {
  if (!process.env.NEXT_PUBLIC_SERVER_URL) throw "Server Url Not Set"
  const url = process.env.NEXT_PUBLIC_SERVER_URL + "/project/getAll"
  const token = localStorage.getItem("Token")

  try {
    var res = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (res.status === 200) {
      return res.data.result.projs
    }
  } catch (e: any) {
    return null
  }

  return null
}

export async function createProject(projDetails: any): Promise<boolean> {
  if (!process.env.NEXT_PUBLIC_SERVER_URL) throw "Server Url Not Set"
  const url = process.env.NEXT_PUBLIC_SERVER_URL + "/project/create"
  const token = localStorage.getItem("Token")

  try {
    var res = await axios.post(
      url,
      {
        pname: projDetails.pname,
        projectUrl: projDetails.projectUrl,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (res.status === 201) {
      return true
    }
  } catch (e: any) {
    return false
  }

  return false
}
