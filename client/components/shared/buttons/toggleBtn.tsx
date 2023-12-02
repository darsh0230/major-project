import { Dispatch, SetStateAction, useState } from "react";

import ClearIcon from "@mui/icons-material/Clear";
import CheckIcon from "@mui/icons-material/Check";

export function OutlinedToggleBtn({
  toggle,
  setToggle,
}: {
  toggle: boolean;
  setToggle: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <button
      onClick={() => {
        setToggle((x: boolean) => !x);
      }}
      className="w-14 h-7 p-px border rounded-full active:bg-transparent">
      <div
        className={
          "h-full w-1/2 bg-white rounded-full transition-all " +
          (toggle ? "translate-x-full rotate-180" : "")
        }>
        <div
          className={
            "text-black transition-opacity " +
            (toggle ? "hidden opacity-0" : "block opacity-100")
          }>
          <ClearIcon fontSize="small" />
        </div>
        <div
          className={
            "text-black transition-opacity " +
            (!toggle ? "hidden opacity-0" : "block opacity-100")
          }>
          <CheckIcon fontSize="small" style={{ transform: "rotate(180deg)" }} />
        </div>
      </div>
    </button>
  );
}
