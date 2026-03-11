import Image from "next/image";

export default function Logo(props: { width: number; height: number }) {
  return (
    <img
      priority
      src="/svg/Zoonest_Logo.svg"
      width={props.width}
      height={props.height}
      alt="Zoonest Logo"
      className="max-md:h-10 max-sm:w-32 sm:max-md:w-36 md:h-12 md:w-40"
    />
  );
}
