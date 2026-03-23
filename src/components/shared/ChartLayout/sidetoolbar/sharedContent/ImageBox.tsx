import React from "react";

interface ImageBoxProps {
  imagePath: string;
  display: string;
  width: number;
  height: number;
  autoWidth?: any;
}

const ImageBox: React.FC<ImageBoxProps> = ({
  imagePath,
  display,
  width,
  height,
  autoWidth,
}) => {
  return (
    <div
      className={`flex w-full flex-col items-center justify-center max-sm:h-[25rem] sm:max-md:h-[27rem] xl:h-[30rem]`}
    >
      <img
        src={imagePath}
        height={height}
        className={`${autoWidth}`}
        width={width}
        alt={""}
      />

      <div className="px-6 text-center text-xs text-gray-500 xl:py-4">
        {display}
      </div>
    </div>
  );
};

export default ImageBox;
