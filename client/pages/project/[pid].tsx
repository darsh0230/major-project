import Navbar from "@/components/shared/navbar/navbar";
import { ProjModel } from "@/models/projModel";
import { getProj, getProjLogs, rebuildProj } from "@/services/projServices";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import jwt from "jsonwebtoken";
import { selectUser } from "@/redux/userSlice";
import { useSelector } from "react-redux";

function ProjDetails() {
  const router = useRouter();
  const user = useSelector(selectUser);

  const { pid } = router.query;
  const [proj, setProj] = useState<ProjModel>();

  const [logText, setLogText] = useState<string>("");

  useEffect(() => {
    async function asyncc() {
      if (pid) setProj(await getProj(pid.toString()));
    }
    asyncc();
  }, [pid]);

  useEffect(() => {
    async function asyncc() {
      if (pid) await getProjLogs(pid.toString(), setLogText);
    }
    asyncc();
  }, [pid]);

  useEffect(() => {
    if (user && !user.token) {
      router.push("/auth/signup");
    }
  }, [user]);

  return (
    <div className="w-full flex flex-col">
      <Navbar />
      <div className="h-32" />

      {/* project description section */}
      <div className="w-full p-8">
        <div className="w-full p-4 px-10 flex flex-col border border-white rounded-md">
          <div className="w-full py-5 flex justify-between">
            <div>Project Name : </div>
            <div className="font-extralight">{proj?.pname}</div>
          </div>
          <div className="w-full py-5 flex justify-between">
            <div>Github URL : </div>
            <div className="font-extralight">{proj?.githubUrl}</div>
          </div>
          <div className="w-full py-5 flex justify-between">
            <div>Framework : </div>
            <div className="font-extralight">{proj?.frameWork}</div>
          </div>
          <div className="w-full py-5 flex justify-between">
            <div>Project Status : </div>
            <div className="font-extralight">{proj?.pStatus}</div>
          </div>
          <div className="w-full py-5 flex justify-between">
            <div>Deployed URL : </div>
            <a
              className="font-extralight"
              href={`http://${
                logText
                  .match(
                    /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]{1,5}/g
                  )
                  ?.toString() ?? ""
              }/`}>
              {logText
                .match(
                  /[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}:[0-9]{1,5}/g
                )
                ?.toString()}
            </a>
          </div>
        </div>
      </div>

      <div className="w-full flex justify-center">
        <button
          className="w-1/3 m-4 bg-transparent hover:bg-white text-white hover:text-black py-2 px-4 border border-white hover:border-transparent rounded font-light"
          onClick={async () => {
            rebuildProj(router, proj?.pid ?? "");
            await new Promise((r) => setTimeout(r, 3000));
            window.location.reload();
          }}>
          Rebuild Project
        </button>
      </div>

      <div className="h-10" />
      {/* project logs */}
      <div className="h-[70vh] w-full p-8">
        <div className="w-full h-full p-4 py-8 px-10 flex flex-col bg-[#222]">
          <div className="font-extralight overflow-y-auto whitespace-pre-line">
            {logText}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjDetails;
