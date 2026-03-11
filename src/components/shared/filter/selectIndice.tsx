import { use, useState } from "react";
const SelectIndice = (props: {
  updateIndex: (indiceName: string) => void;
  disabled?: boolean;
}) => {
  const indices = ["NIFTY", "BANKNIFTY", "FINNIFTY"];
  const [indice, setIndice] = useState("NIFTY");

  const indiceOnClick = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setIndice(event.target.value);
    props.updateIndex(event.target.value);
  };

  return (
    <div>
      <div className="text-green flex ">
        <select
          className="focus:border-tertiary max-sm:h-8  h-10 border border-gray-300 max-sm:text-[0.5rem] sm:text-[0.8rem] 
           md:text-[0.9rem] xl:text-[0.75rem]  2xl:text-sm max-sm:mt-[0.15rem] sm:my-1 xl:mt-1 xl:text-sm max-sm:py-2  sm:py-2 sm:px-1  
           md:px-2 lg:p-2   outline-none rounded-lg max-sm:w-[4rem] sm:w-[7rem] bg-white"
          defaultValue={"NIFTY"}
          onChange={indiceOnClick}
          disabled={props.disabled || false}
        >
          {indices.map((c, idx) => (
            <option className="lg:p-3  text-cyan-400" key={idx} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default SelectIndice;
