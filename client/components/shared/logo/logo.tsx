function Logo() {
  return (
    <div className="h-full p-5" onClick={() => (window.location.href = "/")}>
      {/* bg-gradient-to-r text-transparent bg-clip-text from-[#007CF0] to-[#00DFD8] */}
      <div className="text-4xl font-extrabold"> DEV</div>
    </div>
  );
}

export default Logo;
