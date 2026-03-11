import { toast } from "react-toastify";
import { getJwtFromCookie, removeJwtCookie } from "../cookies";

const autoLogoutTokenRemove = (router: any | null) => {
  if (!router) {
    if (getJwtFromCookie()) {
      removeJwtCookie();
    }
    if (!toast.isActive("logout-toast")) {
      toast("Logging out!", { toastId: "logout-toast" });
    }
    window.location.href = "/login";
    // when autolout need to remove token
  } else {
    if (getJwtFromCookie()) {
      removeJwtCookie();
    }
    router.push("/login");
    // when autolout need to remove token

    if (!toast.isActive("logout-toast")) {
      toast("Logging out!", { toastId: "logout-toast" });
    }
  }
};

export { autoLogoutTokenRemove };
