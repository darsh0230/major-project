import { Dispatch, SetStateAction } from "react"

export async function executeTestCases({
  setData,
  projectId,
  pageId,
  textCaseId,
}: {
  setData: Dispatch<SetStateAction<String>> | undefined
  projectId: string
  pageId: string | undefined
  textCaseId: string | undefined
}): Promise<boolean> {
  if (!process.env.NEXT_PUBLIC_SERVER_URL) throw "Server Url Not Set"
  const url = process.env.NEXT_PUBLIC_SERVER_URL + "/testCases/execute"
  const token = localStorage.getItem("Token")

  const req_data: any = { projectId }
  if (pageId) {
    req_data["pageIds"] = [pageId]
  }
  if (textCaseId) {
    req_data["testCasesIds"] = [textCaseId]
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(req_data), // Example data to send
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

      if (setData)
        setData((prevData) => prevData + new TextDecoder().decode(value))
    }
  } catch (e: any) {
    return false
  }

  return false
}
