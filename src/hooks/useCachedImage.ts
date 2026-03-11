import { useEffect, useState } from "react";

const useCachedImage = (imageUrl: string): string | null => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const loadCachedImage = async () => {
      const cachedImage = localStorage.getItem(imageUrl);
      if (cachedImage) {
        setImageSrc(cachedImage);
      } else {
        try {
          const response = await fetch(imageUrl);
          const blob = await response.blob();
          const reader = new FileReader();

          reader.onloadend = () => {
            const base64Data = reader.result as string;
            localStorage.setItem(imageUrl, base64Data);
            setImageSrc(base64Data);
          };

          reader.readAsDataURL(blob);
        } catch (error) {
          console.error("Failed to fetch image:", error);
        }
      }
    };

    loadCachedImage();
  }, [imageUrl]);

  return imageSrc;
};

export default useCachedImage;
