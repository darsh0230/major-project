type selectionButtonProps = {
  selected: boolean;
  name: string;
  handleOnClick: any;
};

function SelectorButton({
  selected,
  name,
  handleOnClick,
}: selectionButtonProps) {
  return (
    <div className="w-full grid place-items-center">
      {/* selection border */}
      <div
        className={
          "w-full p-1 border-[3px] rounded-md grid place-items-center " +
          (selected ? "border-green-500" : "border-0")
        }>
        {/* button */}
        <button
          className={
            "w-full h-full bg-transparent hover:bg-white text-white font-semibold hover:text-black py-2 px-4 border border-white hover:border-transparent rounded " +
            // "bg-slate-50"
            (selected ? "bg-gray-50 text-black" : "bg-transparent")
          }
          onClick={handleOnClick}>
          {name}
        </button>
      </div>
    </div>
  );
}

export default SelectorButton;
