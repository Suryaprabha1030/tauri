import Link from "next/link";
import Image from "next/image";
const SigninWithGoogle = () => {
  return (
    <Link
      className="flex w-full items-center gap-3 rounded-md border border-zinc-600 px-5 py-3"
      href="/"
    >
      <Image src="/images/google-logo.png" alt="" height={20} width={20} />
      <div className="text-sm font-normal leading-none text-zinc-600">
        Sign Up with Google
      </div>
    </Link>
  );
};

export default SigninWithGoogle;
