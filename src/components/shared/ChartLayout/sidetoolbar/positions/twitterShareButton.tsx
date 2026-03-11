// components/TwitterShareButton.tsx

import React from "react";

interface TwitterShareButtonProps {
  url: string;
  title: string;
  profit?: number;
  hashtags?: string[];
  via?: string;
  className?: string;
  disabled?: boolean;
}

const TwitterShareButton = ({
  url,
  title,
  profit,
  hashtags,
  via,
  className,
  disabled = false,
}: TwitterShareButtonProps) => {
  const handleShare = () => {
    if (disabled) return;

    const shareUrl = new URL("https://twitter.com/intent/tweet");
    let shareText = title;

    if (profit !== undefined) {
      shareText += ` 📈 P&L: ${profit.toFixed(2)}`;
    }

    // Add hashtags directly in the text
    if (hashtags && hashtags.length > 0) {
      shareText += " " + hashtags.map((tag) => `#${tag}`).join(" ");
    }

    // Finally, add the URL at the end of the text
    shareText += ` ${url}`;

    shareUrl.searchParams.set("text", shareText);

    // Optional: still use `via` param if needed
    if (via) {
      shareUrl.searchParams.set("via", via);
    }

    window.open(shareUrl.toString(), "_blank", "noopener,noreferrer");
  };

  return (
    <button
      type="button"
      disabled={disabled}
      className={`flex flex-row items-center gap-2 rounded-lg border border-[#1da1f2]/30 px-4 py-2 transition-colors ${
        disabled
          ? "cursor-not-allowed bg-gray-100 text-gray-400"
          : "hover:bg-[#1da1f2]/10 hover:text-[#1da1f2]"
      } ${className}`}
      onClick={handleShare}
    >
      {disabled ? (
        <>
          <svg
            className="h-4 w-4 animate-spin text-[#1da1f2]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
            ></path>
          </svg>
          Loading...
        </>
      ) : (
        <>
          <img src="/svg/twitter.svg" alt="twitter" width={20} height={20} />
          Share
        </>
      )}
    </button>
  );
};

export default TwitterShareButton;
