import { PageModel } from "@/models/pageModel"
import axios from "axios"

export async function getAllPages(
  projectId: string
): Promise<PageModel[] | null> {
  if (!process.env.NEXT_PUBLIC_SERVER_URL) throw "Server Url Not Set"
  const url = process.env.NEXT_PUBLIC_SERVER_URL + `/page/${projectId}/getAll`
  const token = localStorage.getItem("Token")

  try {
    var res = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (res.status === 200) {
      return res.data.result
    }
  } catch (e: any) {
    return null
  }

  return null
}
