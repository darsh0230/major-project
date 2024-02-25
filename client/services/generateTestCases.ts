import axios from "axios"
import { Dispatch, SetStateAction } from "react"

export async function generateTestCases(
  setData: Dispatch<SetStateAction<String>>,
  projectId: string,
  pageId: string
): Promise<boolean> {
  if (!process.env.NEXT_PUBLIC_SERVER_URL) throw "Server Url Not Set"
  const url = process.env.NEXT_PUBLIC_SERVER_URL + "/testCases/generate"
  const token = localStorage.getItem("Token")

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ projectId, pageIds: [pageId] }), // Example data to send
    })

    if (!response.ok) {
      throw new Error("Network response was not ok")
    }

    const reader = response.body?.getReader()

    while (true) {
      const { done, value } = (await reader?.read()) ?? {
        done: true,
        value: undefined,
      }

      if (done) {
        return true
      }

      setData((prevData) => prevData + new TextDecoder().decode(value))
    }
  } catch (e: any) {
    return false
  }

  return false
}
