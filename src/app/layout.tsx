import { AuthContextProvider } from "@/context/authContextProvider";
import "./globals.css";
import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import StoreProvider from "@/lib/redux/Provider";
import "react-toastify/dist/ReactToastify.css";
import { WebSocketProvider } from "@/context/websocketContextProvider";
import Script from "next/script";
import BrowserTabTitle from "@/components/shared/TabTitle/BrowserTitleDisplay";
import Toaster from "@/components/shared/commonUtil/Toaster";
import CustomToastContainer from "@/components/shared/CustomToastContainer";
import TawkLoader from "@/components/tawk_integration/TawkLoader";
import { TawkProvider } from "@/context/TawkProvider";

const inter = Work_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Zoonest",
  description: "Zoonest | Strategy Builder | Backtesting | F&O",
  manifest: "/manifest.json",
  icons: {
    icon: "/images/favicon.ico",
    apple: "/images/apple-touch-icon.png",
  },
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className="notranslate" translate="no">
      <head>
        {/* <!-- Google Analytics --> */}
        {/* <Script id="google-tag-manager" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){
              w[l]=w[l]||[];
              w[l].push({'gtm.start': new Date().getTime(),event:'gtm.js'});
              var f=d.getElementsByTagName(s)[0],
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
              j.async=true;
              j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
              f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-T4HL5R49');
          `}
        </Script> */}
        <Script id="google-analytics" strategy="afterInteractive">
          {`
      window.dataLayer = window.dataLayer || [];
      function gtag(){ dataLayer.push(arguments); }
      gtag('js', new Date());
      gtag('config', 'G-PC7G5ZFWJW'); 
    `}
        </Script>

        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-PC7G5ZFWJW"
        />
        {/* <!-- End Google Analytics --> */}
      </head>

      <body className={`h-screen ${inter.className}`}>
        <TawkProvider>
          <StoreProvider>
            {" "}
            <AuthContextProvider>
              {/* {children}{" "} */}
              <WebSocketProvider>
                {" "}
                {/* Wrap your children with WebSocketProvider */}
                <BrowserTabTitle />
                {children}
              </WebSocketProvider>
              <CustomToastContainer />
              <Toaster />
            </AuthContextProvider>
          </StoreProvider>
        </TawkProvider>
        {/* <Script src="https://smartapi.angelbroking.com/common/v1.js" /> */}
        <Script src="https://kite.trade/publisher.js?v=3" />
      </body>
    </html>
  );
};
export default RootLayout;
