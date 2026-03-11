import Image from "next/image";

interface HeatMapButtonProps {
  handleHeatMap: () => void;
  svg: any;
  name: any;
  hideExpandButton?: any;
}
// "/svg/heatmap.svg" Premium Map
const IndexChangerIconButton: React.FC<HeatMapButtonProps> = ({
  handleHeatMap,
  svg,
  name,
  hideExpandButton,
}) => {
  return (
    <div
      className={`group relative inline-block cursor-pointer ${hideExpandButton} `}
    >
      <img
        src={svg}
        height={18}
        width={18}
        alt="heatmap"
        onClick={handleHeatMap}
        onDoubleClick={(event: any) => {
          event.stopPropagation();
        }}
        className="max-sm:h-[0.9rem] max-sm:w-[0.9rem] md:max-xl:mt-[0.05rem] md:max-xl:h-[1.3rem] md:max-xl:w-[1.2rem] xl:max-2xl:h-[1.4rem] xl:max-2xl:w-[1.3rem]"
      />
      <span className="pointer-events-none absolute top-7 z-[1001] ml-1 w-[6rem] -translate-x-full -translate-y-1/2 transform rounded bg-gray-800 px-1 text-center text-[0.65rem] text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 max-xl:hidden xl:max-2xl:left-[2.8rem] xl:max-2xl:top-[2rem]">
        {name}
      </span>
    </div>
  );
};

export default IndexChangerIconButton;
