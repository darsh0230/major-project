export function CustOutlinedButton(props: any) {
  return (
    <button
      className={
        "bg-transparent hover:bg-white text-white hover:text-black py-2 px-4 border border-white hover:border-transparent rounded font-light " +
        props.addClass
      }
      onClick={props.onClick}
      {...props}>
      {props.children}
    </button>
  );
}
