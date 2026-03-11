// app/share/[slug]/page.tsx
import CryptoJS from "crypto-js";
import { Metadata } from "next";
import ShareRedirectClient from "./client-redirect";

const SECRET_KEY = "your-default-key";

function decryptSlug(encryptedSlug: string) {
  try {
    const restored = encryptedSlug.replace(/-/g, "+").replace(/_/g, "/");

    // Base64 requires padding length to be multiple of 4
    const paddingNeeded = 4 - (restored.length % 4);
    const padded = restored + "=".repeat(paddingNeeded % 4);

    const bytes = CryptoJS.AES.decrypt(padded, SECRET_KEY);
    const utf8 = bytes.toString(CryptoJS.enc.Utf8);

    const decryptedData = JSON.parse(utf8);
    return decryptedData;
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const data = decryptSlug(params.slug);

  if (!data) return {};

  return {
    title: "Zoonest Positions",
    description: `📈 P&L ${data.profit || "0.00"}`,
    openGraph: {
      images: [data.imageUrl],
    },
    twitter: {
      card: "summary_large_image",
      images: [data.imageUrl],
    },
  };
}

export default function SharePage({ params }: { params: { slug: string } }) {
  return <ShareRedirectClient slug={params.slug} />;
}
