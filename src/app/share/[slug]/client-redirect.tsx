//when positions page need to be displayed on clicking the twitter image shared
// app/share/[slug]/ShareRedirectClient.tsx
"use client";

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import LoadingComponent from "@/components/shared/loading/Loading";

const SECRET_KEY = process.env.NEXT_PUBLIC_AES_SECRET_KEY || "your-default-key";

function decryptSlug(encryptedSlug: string) {
  try {
    const restored = encryptedSlug.replace(/-/g, "+").replace(/_/g, "/");
    const bytes = CryptoJS.AES.decrypt(restored, SECRET_KEY);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}

export default function ShareRedirectClient({ slug }: { slug: string }) {
  const router = useNavigate();
  //For redirecting to positions page

  useEffect(() => {
    const timer = setTimeout(() => {
      const data = decryptSlug(slug);

      if (data?.brokerCode) {
        // Redirect to full domain
        const origin = window.location.origin;
        window.location.replace(`${origin}`);
      } else {
        router.replace("/404"); // fallback to 404 on failure
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [slug]);

  return (
    <div className="flex min-h-screen items-center justify-center text-lg text-gray-500">
      <LoadingComponent></LoadingComponent>
    </div>
  );
}
