"use client";
import { useEffect } from "react";
import { useTawk } from "@/context/TawkProvider";

declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}
export const removeTawk = () => {
  if (window.Tawk_API?.shutdown) {
    try {
      window.Tawk_API.shutdown();
    } catch (e) {
      console.log("Tawk shutdown error:", e);
    }
  }

  document.querySelectorAll("[id^='tawk_']").forEach((el) => el.remove());

  const tawkScript = document.getElementById("tawk-script");
  if (tawkScript) tawkScript.remove();

  window.Tawk_API = undefined;
  window.Tawk_LoadStart = undefined;
};

const TawkLoader = () => {
  const { showSupport, userEmail, userId } = useTawk();

  useEffect(() => {
    const SCRIPT_ID = "tawk-script";
    const TAWK_SRC = "https://embed.tawk.to/69139a2366ca5b195a47e40a/1j9q946u3";

    const setUser = () => {
      if (
        window?.Tawk_API &&
        window?.Tawk_API?.setAttributes &&
        userId != null
      ) {
        const environment =
          process.env.NODE_ENV === "production" ? "production" : "development";
        window?.Tawk_API?.setAttributes(
          {
            userId: userId,
            environment: environment,
          },
          function (error: any) {
            if (error) console.log("Tawk setAttributes error:", error);
          }
        );
      }
    };

    if (showSupport) {
      if (!document.getElementById(SCRIPT_ID)) {
        window.Tawk_LoadStart = new Date();

        const script = document.createElement("script");
        script.id = SCRIPT_ID;
        script.src = TAWK_SRC;
        script.async = true;
        script.crossOrigin = "anonymous";

        script.onload = () => {
          setTimeout(() => setUser(), 1000); // wait for widget initialization
        };

        document.body.appendChild(script);
      } else {
        window?.Tawk_API?.showWidget?.();
        setTimeout(() => setUser(), 500);
      }
    } else {
      window?.Tawk_API?.hideWidget?.();
    }
  }, [showSupport, userEmail, userId]);

  return null;
};

export default TawkLoader;
