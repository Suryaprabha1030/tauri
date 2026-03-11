"use client";
import React, { useRef, useState, useEffect } from "react";
import domtoimage from "dom-to-image";
import Logo from "@/components/shared/logo/logo";
import { formatNumber } from "@/lib/util/DraftUtil";

import { useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import CryptoJS from "crypto-js";
import { PositionsRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import TwitterShareButton from "./twitterShareButton";
import {
  getImageUrl,
  getTwitterImage,
} from "@/lib/util/brokersUtil/BrokersImage";
import Modal from "@/components/shared/popupModal";
import { getBrokerCode } from "@/components/helpers";
import config from "@/lib/config";

interface Position {
  display_symbol_name: string;
  quantity: number;
  ltp: number;
}

const uploadToS3 = async (
  base64Image: string,
  brokerCode: any,
  clientCode?: string,
  userId?: number,
): Promise<string | null> => {
  try {
    const response = await fetch(base64Image);
    const blob = await response.blob();

    const currentDate = new Date().toISOString().split("T")[0];
    const fileName = `${userId}_${clientCode}_${brokerCode}_${currentDate}.jpg`;

    const file = new File([blob], fileName, { type: "image/jpeg" });
    const PositionSharing = new PositionsRouterApi(baseConfig());

    const presignRes =
      await PositionSharing.generatePresignedUrlV1UsersMeSharedPositionsUploadUrlPost(
        {
          fileName,
          fileType: "image/jpeg",
        },
      );

    const signedUrl = presignRes.data.url;

    const uploadRes = await fetch(signedUrl, {
      method: "PUT",
      headers: { "Content-Type": "image/jpeg" },
      body: file,
    });

    if (!uploadRes.ok) throw new Error("Failed to upload to S3");

    return signedUrl.split("?")[0];
  } catch (error) {
    console.error("S3 upload error:", error);
    return null;
  }
};

const ShareableImageCard = ({
  totalPnl,
  userName,
  setShowModal,
  showModal,
}: {
  totalPnl: number;
  userName?: string;
  showModal: any;
  setShowModal: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const captureRef = useRef<HTMLDivElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [shareableUrl, setShareableUrl] = useState<string | null>(null);
  const [isMemeLoaded, setIsMemeLoaded] = useState(false);
  const [totalPnlImage, setTotalPnlImage] = useState<string | null>(null);
  const [isPnlImageLoaded, setIsPnlImageLoaded] = useState(false);
  const pnlImageRef = useRef<HTMLImageElement | null>(null);

  const currentBrokerName = useSelector(
    (state: RootState) => state.Position.BrokerName,
  );
  const currentBrokerClientCode = useSelector(
    (state: RootState) => state.Position.ClientCode,
  );
  const userId = useSelector((state: RootState) => state.Position.userId);
  const positions = useSelector((state: RootState) => state.strategy.positions);
  const brokerCode = getBrokerCode();
  const isNoTradeDay =
    positions?.length == 0 || positions == null || positions == undefined;
  const pnlColor =
    totalPnl > 0 ? "#16A34A" : totalPnl < 0 ? "#EF4444" : "#6B7280";

  const displayName = userName && typeof userName === "string" ? userName : "";

  const SECRET_KEY = "your-default-key";
  const generateEncryptedSlug = (data: object) => {
    const stringified = JSON.stringify(data);
    const encrypted = CryptoJS.AES.encrypt(stringified, SECRET_KEY).toString();
    return encrypted.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  };

  const generateImage = async () => {
    const el = captureRef.current;
    if (!el) return;

    try {
      await document.fonts.ready;

      const base64 = await domtoimage.toPng(el, {
        bgcolor: "#FFFFFF", // Optional background color
        quality: 1, // Only used in JPEG, doesn't affect PNG
        width: el.offsetWidth * 3,
        height: el.offsetHeight * 3,
        style: {
          transform: "scale(3)", // No scaling
          transformOrigin: "top left",
        },
      });

      const uploadedImageUrl = await uploadToS3(
        base64,
        brokerCode,
        currentBrokerClientCode,
        userId,
      );
      if (uploadedImageUrl) {
        setImageUrl(uploadedImageUrl);
        const payload = {
          userId: userId || null,
          brokerCode,
          clientCode: currentBrokerClientCode,
          imageUrl: uploadedImageUrl,
        };
        const encryptedSlug = generateEncryptedSlug(payload);
        setShareableUrl(window.location.origin + `/share/${encryptedSlug}`);
        setIsMemeLoaded(false);
      }
    } catch (error) {
      console.error("Image generation failed:", error);
    }
  };

  useEffect(() => {
    if (showModal) {
      if (isNoTradeDay && isMemeLoaded && userName) {
        generateImage();
      } else if (!isNoTradeDay && isPnlImageLoaded && userName) {
        generateImage();
      }
    }
  }, [showModal, isMemeLoaded, isPnlImageLoaded]);

  useEffect(() => {
    const ratio = window.devicePixelRatio || 1;

    const displayWidth = 300; // Width in CSS pixels
    const displayHeight = 42; // Target height you requested

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set actual canvas size in device pixels
    canvas.width = displayWidth * ratio;
    canvas.height = displayHeight * ratio;

    // Set CSS size for DOM (not used in DOM but matches visual)
    canvas.style.width = `${displayWidth}px`;
    canvas.style.height = `${displayHeight}px`;

    // Scale context to match resolution
    ctx.scale(ratio, ratio);

    // P&L text
    ctx.font = "700 30px Arial"; // Font size slightly smaller than container
    ctx.fillStyle = pnlColor;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const pnlText = (totalPnl > 0 ? "+" : "") + formatNumber(totalPnl);
    ctx.fillText(pnlText, displayWidth / 2, displayHeight / 2); // Centered

    const dataURL = canvas.toDataURL("image/png");
    setTotalPnlImage(dataURL);
    setIsPnlImageLoaded(false); // Reset so <img> onLoad can fire again
  }, [totalPnl, pnlColor]);

  return (
    <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
      <div className="">
        {/* Visible Capture Area */}
        <div
          ref={captureRef}
          style={{
            position: "relative", // for watermark layering
            width: "100%",
            height: "100%",
            maxWidth: "400px",
            margin: "0 auto",
            padding: "10px",
            border: "1px solid #E5E7EB",
            borderRadius: "12px",
            background: "linear-gradient(to bottom right, #FFFFFF, #e7fef2ff)",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
            fontFamily: "Arial, Helvetica, sans-serif",
            overflow: "hidden",
          }}
        >
          {/* 🔒 Watermark (Zoonest faded) */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              fontSize: "68px",
              color: "#4B5563",
              opacity: 0.05,
              fontWeight: "700",
              pointerEvents: "none",
              userSelect: "none",
              whiteSpace: "nowrap",
            }}
          >
            ZOONEST
          </div>

          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingLeft: "12px",
              paddingRight: "12px",
              marginTop: "4px",
            }}
          >
            <div
              style={{
                width: "30%",
                height: "40px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <img src="/svg/Zoonest_Logo.svg" alt="" width={100} height={80} />
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "10px",
                color: "#4B5563",
                lineHeight: 1,
              }}
            >
              <div style={{ textAlign: "center" }}>
                {(displayName || "").slice(0, 4).padEnd(9, "X")}
              </div>
              <img
                src="/svg/BlackUser.svg"
                alt="user"
                width={16}
                height={16}
                style={{
                  display: "inline-block",
                  verticalAlign: "middle",
                }}
              />
            </div>
          </div>

          {/* Main P&L Section */}
          <div
            style={{
              textAlign: "center",
              paddingTop: isNoTradeDay ? "2px" : "15px",
              paddingBottom: isNoTradeDay ? "20px" : "30px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                fontSize: isNoTradeDay ? "16px" : "12px",
                fontWeight: isNoTradeDay ? "900px" : "500px",
                color: "#4B5563",
              }}
            >
              {isNoTradeDay ? "No Trade Day" : "Total P&L"}
              {isNoTradeDay && (
                <img
                  src="/images/meme.jpg"
                  width={100}
                  height={80}
                  alt="meme"
                  onLoad={() => setIsMemeLoaded(true)}
                  style={{ display: "block" }}
                />
              )}
            </div>

            {!isNoTradeDay && (
              <>
                {totalPnlImage && (
                  <img
                    ref={pnlImageRef}
                    src={totalPnlImage}
                    alt="Total PnL"
                    onLoad={() => setIsPnlImageLoaded(true)}
                    style={{
                      width: "auto",
                      height: "42px",
                      paddingBottom: "1px",
                      lineHeight: 1,
                    }}
                  />
                )}

                <div
                  style={{
                    fontSize: "10px",
                    color: "#6B7280",
                    margin: 0,
                    padding: 0,
                    fontStyle: "italic",

                    alignContent: "baseline",
                  }}
                >
                  {new Date().toLocaleString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </div>
              </>
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%", // make sure it spans the container
              padding: "0 16px", // optional padding
              marginTop: "4px",
              marginBottom: "10px",
            }}
          >
            {/* Broker Info */}
            <div
              style={{
                fontSize: "10px",
                color: "#4B5563",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                paddingLeft: "6px",
              }}
            >
              <span>Positions from</span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "20px",
                  width: "60px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={getTwitterImage(currentBrokerName).url}
                  alt={currentBrokerName}
                  height={getTwitterImage(currentBrokerName).height}
                  width={getTwitterImage(currentBrokerName).width}
                  style={{
                    maxHeight: "100%",
                    maxWidth: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                fontSize: "10px",
                color: "#4B5563",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span>
                #VerifiedBy<span style={{ color: "#16A34A" }}>Zoonest</span>
              </span>
              <img src="/svg/tick.svg" width={14} height={14} alt="tick" />
            </div>
          </div>
        </div>

        {/* Twitter Share */}
        <div className="mt-4 flex justify-center">
          <TwitterShareButton
            url={shareableUrl || ""}
            title={
              isNoTradeDay
                ? `No trade today, but still loving the market! ${config.zoonestTwitterID} ${getTwitterImage(currentBrokerName).twitterHandle || ""}`
                : `My Trading P&L on Zoonest ${config.zoonestTwitterID} ${getTwitterImage(currentBrokerName).twitterHandle || ""}`
            }
            profit={isNoTradeDay ? undefined : totalPnl}
            hashtags={[
              "VerifiedByZoonest",
              isNoTradeDay ? "NoTradeDay" : "TotalPnl",
            ]}
            disabled={!imageUrl || !shareableUrl}
          />
        </div>
      </div>
    </Modal>
  );
};

export default ShareableImageCard;
