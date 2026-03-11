import { toast } from "react-toastify";
import { getJwtFromCookie, removeJwtCookie } from "../cookies";

const brokerLogoutTokenRemove = (router: any | null) => {
  if (!router) {
    window.location.href = "/login";
    if (!toast.isActive("broker-logout-toast")) {
      toast("Broker Logging out!", { toastId: "broker-logout-toast" });
    }

    // when brokerLogout need to remove token
  } else {
    router.push("/live");

    // when brokerLogout need to remove token

    if (!toast.isActive("broker-logout-toast")) {
      toast("Broker Logging out!", { toastId: "broker-logout-toast" });
    }
  }
};

export { brokerLogoutTokenRemove };
