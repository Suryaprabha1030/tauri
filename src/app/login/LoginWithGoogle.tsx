import { useRouter } from "next/navigation";
import config from "@/lib/config";

const LoginWithGoogle = ({ name }: any) => {
  const router = useNavigate();
  const url = config.apiUrl;
  const googleAuthentication = () => {
    router(`${url}/v1/users/google_auth`);
  };

  return (
    <div
      className="flex w-[13rem] cursor-pointer items-center justify-evenly gap-3 rounded-md border border-neutral-200 bg-white px-5 py-3"
      onClick={googleAuthentication}
    >
      <img src="/images/google-logo.png" alt="" height={20} width={20} />
      <div className="text-sm font-normal leading-none text-zinc-600">
        {name}
      </div>
    </div>
  );
};

export default LoginWithGoogle;
