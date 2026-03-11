import { removeTawk } from "@/components/tawk_integration/TawkLoader";
import { getCookie, setCookie, removeCookie } from "typescript-cookie";

export const COOKIE_NAME = "zjt"; // Replace 'your_jwt_cookie' with your desired cookie name

export function getJwtFromCookie(): string | undefined {
  if (typeof document === "undefined") {
    // Running on the server; return undefined or handle appropriately
    return undefined;
  }
  return getCookie(COOKIE_NAME);
}

export function setJwtCookie(token: string) {
  const expirationDate = new Date();
  // expirationDate.setUTCHours(expirationDate.getUTCHours() + 3);
  expirationDate.setHours(expirationDate.getHours() + 24);
  // expirationDate.setMinutes(expirationDate.getMinutes() + 10);

  setCookie(COOKIE_NAME, token, {
    expires: expirationDate, // Use Date object for expiration
    domain: process.env.NODE_ENV === "production" ? "zoonest.com" : undefined, // Set domain for production
    path: "/", // Ensure the cookie is available across the entire site
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : undefined,
  });
}

export function removeJwtCookie() {
  removeCookie(COOKIE_NAME, {
    domain: process.env.NODE_ENV === "production" ? "zoonest.com" : undefined,
    // path: "/",
    path: "/",

    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : undefined,
  });
  sessionStorage.removeItem("warningDismissed"); //when logged out removed the warning close session storage
  localStorage.removeItem("RiskDisclosureClose"); //TO remove risk disclosure pop up
  sessionStorage.removeItem("brokerName");
  sessionStorage.removeItem("ExistbrokerCode");
  sessionStorage.removeItem("brokerCode");
  removeTawk();
}
