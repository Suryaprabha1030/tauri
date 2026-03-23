
const Logout = () => {
  return (
    <div className="dropdown group relative flex ">
      <button
        className="flex flex-row items-center"
        id="userDropDown"
        data-dropdown-toggle="dropdown"
      >
        <img src="/svg/user-icon.svg" height={35} width={35} alt={""} />
      </button>
      <ul className="dropdown-menu absolute right-0 top-6   hidden w-36 border border-gray-200 bg-white max-sm:text-[0.6rem] sm:text-[0.8rem] 2xl:text-[1rem] text-black group-hover:block">
        <li className="">
          <a
            className="whitespace-no-wrap block rounded-t px-4 py-2 hover:bg-gray-400"
            href="/profile"
          >
            Profile
          </a>
        </li>
        <li className="">
          <a
            className="whitespace-no-wrap block px-4 py-2 hover:bg-gray-400"
            href="/logout"
          >
            Logout
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Logout;
