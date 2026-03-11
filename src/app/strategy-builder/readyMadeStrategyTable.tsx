"use client";
import AppLayout from "@/components/layout/AppLayout";
import { StrategyList } from "@/lib/api/base";
import { SelectedStrategyInfo, UserStrategy } from "@/lib/types";
import { truncate } from "@/lib/util/generalUtil";
import { Accordion, AccordionItem } from "@szhsin/react-accordion";
import Image from "next/image";
import { useEffect, useState } from "react";
// strategyList, handleStrategyClick, selectedInfo, strategies,name
const ReadyMadeStrategyTable = (props: {
  strategyList: StrategyList;
  handleStrategyClick: (name?: string, id?: number) => void;
  selectedInfo: SelectedStrategyInfo;
  strategies: UserStrategy[];
  name: string | undefined;
  
}) => {
  const { strategies, strategyList, handleStrategyClick, selectedInfo} = props;
  console.log( selectedInfo)
  // console.log(strategyList)
  const [showAppLayout, setShowAppLayout] = useState(true);
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      // Set the state to true after the timeout
      setShowAppLayout(false);
    }, 1000); // Set timeout to 1000 milliseconds (adjust as needed)

    // Clean up the timeout when the component unmounts or when the dependency array changes
    return () => clearTimeout(timeoutId);
  }, []);
 
  return (
    <Accordion className={`flex  w-full flex-col lg:items-center
    gap-2 text-center duration-300 ease-linear`}>
     <div className="text-medium flex max-h-[calc(100vh-8rem)] w-full flex-col gap-2 overflow-y-scroll p-2 text-center">
       {Object.keys(strategyList).map((key) => (
         <AccordionItem
           key={key}
           header={
             <h2
               className={`row flex justify-between text-center max-sm:text-[0.85rem]  lg:text-[0.72rem] 2xl:text-[1rem]  font-semibold uppercase  ${
                 selectedInfo?.strategyType?.toString() === key
                   ? "text-z-green-500"
                   : "text-black"
               }`}
             >
               {/* max-sm:w-[1.6rem] lg:w-4  2xl:w-5 */}
               <div className="col flex  ">
                 {key === "Bullish" ? (
                   <Image
                     src="/svg/bull-icon.svg"
                     height={24}
                     width={24}
                     alt={""}
                   />
                 ) : key === "Neutral" ? (
                   <Image
                     src="/svg/target-icon.svg"
                     height={24}
                     width={24}
                     alt={""}
                   />
                 ) : (
                   <Image
                     src="/svg/bear-icon.svg"
                     height={24}
                     width={24}
                     alt={""}
                   />
                 )}
               </div>{" "}
               &nbsp;
               <div className="col flex-left flex">
                 {selectedInfo?.strategyType === key
                   ? selectedInfo?.strategyName
                   : key}
               </div>
             </h2>
           }
           initialEntered={!selectedInfo.strategyId && key === "Bullish"}
         >
           <ul className="text-black-500 divide-y border-2 border-z-blue-100 text-left max-sm:text-[0.75rem] md:text-[0.9rem] lg:text-[0.75rem] 2xl:text-sm">
             {strategyList[key as keyof StrategyList].map((item: string) => (
               <li
                 key={item}
                 className={`cursor-pointer border-b bg-white p-2 text-center hover:bg-z-green-300 ${
                   selectedInfo?.strategyName === item
                     ? "bg-z-green-400"
                     : "bg-white"
                 }`}
                 onClick={() =>{props.handleStrategyClick(item, undefined)
                  console.log(item)
                    }}
                
                
               >
                 {item}
               </li>
             ))}
           </ul>
         </AccordionItem>
       ))}
       <AccordionItem
         header={
           <h2
             className={`row flex justify-center text-center max-sm:text-[0.85rem]  lg:text-[0.75rem] 2xl:text-[1rem]   font-semibold uppercase ${
               selectedInfo?.strategyId !== null
                 ? "text-z-green-500"
                 : "text-black"
             }`}
           >
            {/* max-sm:w-[1.6rem] md:w-[2rem] lg:w-4  2xl:w-5  */}
             <div className="col flex   ">
               <Image
                 src="/svg/idea-icon.svg"
                 height={28}
                 width={28}
                 alt={""}
               />
             </div>
             &nbsp;
             <div className="col flex-left flex">
               {selectedInfo?.strategyId
                 ? truncate(props.name!)
                 : "My Strategies"}
             </div>
           </h2>
         }
         initialEntered={selectedInfo.strategyId !== null}
       >
         <ul className="divide-y divide-gray-300 rounded-lg border-2 border-z-blue-100 text-left max-sm:text-[0.75rem] lg:text-[0.69rem] 2xl:text-sm text-gray-500">
           {strategies.map((item: UserStrategy) => (
             <li
               key={item.id}
               onClick={() =>{ handleStrategyClick(undefined, item.id)
                
               }
               }
               className={`cursor-pointer rounded-lg bg-white p-2 text-center hover:bg-z-green-400 ${
                 selectedInfo?.strategyId == item.id
                   ? "bg-z-green-400"
                   : "bg-white"
               }`}
             >
               {item.name}
             </li>
           ))}
         </ul>
       </AccordionItem>
     </div>
   
     
   
   </Accordion>
    
  
  );
};

export default ReadyMadeStrategyTable;
