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

  // Detect if running inside Tauri
  const isTauri = typeof window !== "undefined" && (window as any).__TAURI_INTERNALS__ !== undefined;
  
  const cookieDomain = process.env.NODE_ENV === "production" && !isTauri ? "zoonest.com" : undefined;
  const isSecure = process.env.NODE_ENV === "production" && !isTauri;
  const sameSiteValue = process.env.NODE_ENV === "production" && !isTauri ? "None" : "Lax";

  setCookie(COOKIE_NAME, token, {
    expires: expirationDate, // Use Date object for expiration
    domain: cookieDomain, // Set domain for production web, avoid for Tauri
    path: "/", // Ensure the cookie is available across the entire site
    secure: isSecure, // Secure only if not in Tauri HTTP
    sameSite: sameSiteValue, // SameSite None requires Secure, so Lax for Tauri
  });
}

export function removeJwtCookie() {
  const isTauri = typeof window !== "undefined" && (window as any).__TAURI_INTERNALS__ !== undefined;
  
  const cookieDomain = process.env.NODE_ENV === "production" && !isTauri ? "zoonest.com" : undefined;
  const isSecure = process.env.NODE_ENV === "production" && !isTauri;
  const sameSiteValue = process.env.NODE_ENV === "production" && !isTauri ? "None" : "Lax";

  removeCookie(COOKIE_NAME, {
    domain: cookieDomain,
    // path: "/",
    path: "/",

    secure: isSecure,
    sameSite: sameSiteValue,
  });
  sessionStorage.removeItem("warningDismissed"); //when logged out removed the warning close session storage
  localStorage.removeItem("RiskDisclosureClose"); //TO remove risk disclosure pop up
  sessionStorage.removeItem("brokerName");
  sessionStorage.removeItem("ExistbrokerCode");
  sessionStorage.removeItem("brokerCode");
  removeTawk();
}
