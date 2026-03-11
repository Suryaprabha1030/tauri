import Image from "next/image";

interface HeatMapButtonProps {
  handleHeatMap: (e: any) => void;
}

const HeatMapButton: React.FC<HeatMapButtonProps> = ({ handleHeatMap }) => {
  return (
    <div className="group relative inline-block cursor-pointer">
      <img
        src="/svg/heatmap.svg"
        height={15}
        width={15}
        alt="heatmap"
        onClick={handleHeatMap}
        onDoubleClick={(event: any) => {
          event.stopPropagation();
        }}
        className="max-sm:h-[1.3rem] max-sm:w-[1.15rem] sm:max-xl:w-[1.25rem] sm:max-md:h-[1.25rem] md:max-xl:h-[1.2rem]"
      />
      <span className="pointer-events-none absolute top-7 z-[1001] ml-1 w-[6rem] -translate-x-full -translate-y-1/2 transform rounded bg-gray-800 px-1 text-center text-[0.65rem] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 max-xl:hidden xl:max-2xl:left-[1.5rem] xl:max-2xl:top-[2rem]">
        Premium Map
      </span>
    </div>
  );
};

export default HeatMapButton;
