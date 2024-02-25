import CloseIcon from "@mui/icons-material/Close"

export default function TestCaseLogsModal({
  isModalOpen,
  setIsModalOpen,
  logs,
}: any) {
  function onClose() {
    setIsModalOpen(false)
  }

  return (
    <div
      className={`w-screen h-screen fixed grid place-items-center bg-zinc-800 ${
        isModalOpen || "hidden"
      }`}>
      <div className="w-2/3 h-1/2 bg-zinc-900 rounded-md p-5 flex flex-col">
        <div className="flex justify-between">
          <div className="text-2xl font-bold">Logs</div>
          <button
            className="p-1 rounded-md hover:hover:bg-zinc-800"
            onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className="h-2" />

        <code className="h-full w-full p-3 bg-black whitespace-pre-line overflow-auto">
          {logs}
        </code>
      </div>
    </div>
  )
}
