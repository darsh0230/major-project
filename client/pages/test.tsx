import { executeTestCases } from "@/services/executeTestCases"
import { generateTestCases } from "@/services/generateTestCases"
import { useState } from "react"

export default function TestPage() {
  const [data, setData] = useState<string>("")
  const handleClick = async () => {
    await generateTestCases(setData)
  }

  const handleClick2 = async () => {
    await executeTestCases(setData)
  }
  return (
    <div>
      <button onClick={handleClick}>CLick me</button>
      <button onClick={handleClick2}>CLick me</button>
      <div className="whitespace-pre-line">{data}</div>
    </div>
  )
}
