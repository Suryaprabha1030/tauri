import { useEffect, useState } from "react";

const usePWAInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallPromptVisible, setInstallPromptVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      // e.preventDefault();
      setDeferredPrompt(e as any);
      setInstallPromptVisible(true);
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === "accepted") {
          // console.log("User accepted the A2HS prompt");
        } else {
          // console.log("User dismissed the A2HS prompt");
        }
        setDeferredPrompt(null);
        setInstallPromptVisible(false);
      });
    }
  };

  return { isInstallPromptVisible, handleInstallClick };
};

export default usePWAInstallPrompt;
