import { TestCaseModel } from "@/models/testCaseModel"
import axios from "axios"

export async function getAllTestcases(
  projectId: string,
  pageid: string
): Promise<TestCaseModel[] | null> {
  if (!process.env.NEXT_PUBLIC_SERVER_URL) throw "Server Url Not Set"
  const url =
    process.env.NEXT_PUBLIC_SERVER_URL +
    "/testCases/getAllTestCases" +
    `?projectId=${projectId}&pageId=${pageid}`
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

export async function updateTestCaseCode(testCaseId: string, code: string) {
  if (!process.env.NEXT_PUBLIC_SERVER_URL) throw "Server Url Not Set"
  const url =
    process.env.NEXT_PUBLIC_SERVER_URL + "/testCases/updateTestCaseCode"
  const token = localStorage.getItem("Token")

  try {
    var res = await axios.post(
      url,
      {
        testCaseId: testCaseId,
        code: code,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )

    if (res.status === 200) {
      return true
    }
  } catch (e: any) {
    return false
  }

  return false
}
