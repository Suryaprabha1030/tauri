interface TabEmptyInfoProps {
  name: string;
  tableName?: string;
}

const TabEmptyInfo: React.FC<TabEmptyInfoProps> = ({
  name,
  tableName,
}: any) => {
  return (
    <div
      className={`flex w-full flex-col items-center justify-center gap-2  text-center text-[0.85rem] font-light max-xl:h-[55%] xl:h-[90%] ${tableName ? "max:xl:block xl:hidden" : "block"}`}
    >
      {name}
    </div>
  );
};

export default TabEmptyInfo;
