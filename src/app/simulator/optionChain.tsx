"use client";
import { Configuration, DefaultApi, OptionChainParsedResult } from "@/lib/api/base";
import { use, useEffect, useRef, useState } from "react";
import {
  getHashKey,
  getCEClass,
  getCloseValue,
  getPEClass,
  getSymbolClass,
  scrollToMiddle,
  getOptionChainForOptionType,
  getSellClass,
  getBuyClass,
  buildSelectedOptionChain,
  getUpdatedDataFromSelection,
} from "./simulatorUtil";
import { set } from "react-hook-form";
import Image from "next/image";


const OptionChain = (props: {
  optionChain: OptionChainParsedResult;
  updateSelectionToParent: (selectedData: any) => void;
  isSliding:Boolean;
  handleSlideToggle: () => void;
}) => {
  const { optionChain } = props;

  const [state, setState] = useState({
    selectedData: {} as Record<string, any>,
  });

  useState<Record<string, any>>({});
 
  useEffect(() => {
    // Scroll to the section of the spot price
    scrollToMiddle(optionChain);
    setState({
      ...state,
      selectedData: buildSelectedOptionChain(optionChain.option_chain_data),
    });
    console.log(optionChain.option_chain_data,"fordatalot...")
  }, [optionChain.option_chain_data]);

  // update data to parent
  useEffect(() => {
    props.updateSelectionToParent(
      getUpdatedDataFromSelection(state.selectedData)
    );
  }, [state.selectedData]);

  const handleSelection =
    (hashkey: string, element: any, transactionType: string) => () => {
      const temp = { ...state.selectedData }; // copy the selected data else its updating the state directly
      const tempElement = { ...element }; // copy the element else it would update data.optionchain directly
      tempElement.transaction_type = transactionType;
      
      // reset the lots only if the element is already selected and is not of same transaction type (we are reusing lots from the API)
      if (
        (element.is_selected && element.transaction_type != transactionType) ||
        !element.is_selected
      ) {
        tempElement.lots = 1;
      }

      //  if the key is already selected in the SelectedData
      if (state.selectedData[hashkey]) {
        // if the transaction type is same as the one selected
        if (state.selectedData[hashkey].transaction_type === transactionType) {
          // if the old one is selected dont do anyChange else delete it
          if (state.selectedData[hashkey].is_selected) {
            return;
          } else {
            delete temp[hashkey];
            setState({ ...state, selectedData: temp });
          }
        } else {
          // remove is_selected from the TempElement if it exists
          if (
            element.is_selected &&
            element.transaction_type !== transactionType
          ) {
            delete tempElement.is_selected;
          }
          // if the transaction type is different, add the tempElement
          temp[hashkey] = tempElement;
          setState({ ...state, selectedData: temp });
        }
      } else {
        // add the element to the selected data
        temp[hashkey] = tempElement;
        setState({ ...state, selectedData: temp });
      }
     
    };
    console.log(state,"select")
  const handleUpdateLots = (hashkey: string, element: any) => (event: any) => {
    // When updating lots for element which is already selected we append the element lots to a field called old lots,
    // so this is used in subtraciton when building add legs
    // console.log(temp,"select")
    const temp = { ...state.selectedData };
    const tempElement = { ...temp[hashkey] }; // copy the selected data else its updating the state directly
    tempElement.lots = parseInt(event.target.value);

    if (element.is_selected) {
      tempElement.old_lots = element.lots;
    }

    temp[hashkey] = tempElement;
    setState({ ...state, selectedData: temp });
  };
  //slider
  const tableRef=useRef(null)
 
  const getTableWidth = () => {
    if (!tableRef.current) return 0; // Handle potential null reference
    return (tableRef.current as HTMLElement).offsetWidth;
  };

  
 const maxWidth = 'calc(100vw - 40px)'


  return (
    optionChain.option_chain_data && (
      <div className="flex flex-row overflow-y-auto ">
     <div className="flex flex-row overflow-y-auto " >
      <div className="flex flex-col items-center border-2 border-z-blue-200">
        <table className={`w-full h-full  text-center text-sm text-gray-500 border-2 border-blue-200  duration-500  ${props.isSliding ? 'translate-x-0' : 'hidden'}`} ref={tableRef}  style={{  maxWidth  }} >
          <thead className="sticky top-0 border-b bg-z-green-300">
            <tr className="flex flex-row items-center justify-between border-b-2 border-gray-200">
              <th className="w-1/5 px-6 py-4"> B / S </th>
              <th className="w-1/5 px-6 py-4"> Call </th>
              <th className="w-1/5 px-6 py-4">
                {" "}
                {optionChain.expiry_date} Strike
              </th>
              <th className="w-1/5 px-6 py-4"> Put </th>
              <th className="w-1/5 px-6 py-4"> B / S</th>
            </tr>
          </thead>

          <tbody className="flex flex-col rounded-lg text-center" id="result">
            {Object.entries(optionChain.option_chain_data).map(
              ([key, value]: [string, any]) => {
                const closeCE = getCloseValue(value, "CE");
                const closePE = getCloseValue(value, "PE");

                const buyCEButtonKey = `${getHashKey(key, "CE")}#B`;
                const sellCEButtonKey = `${getHashKey(key, "CE")}#S`;

                const buyPEButtonKey = `${getHashKey(key, "PE")}#B`;
                const sellPEButtonKey = `${getHashKey(key, "PE")}#S`;

                const selectedDataForCE =
                  state.selectedData[getHashKey(key, "CE")];
                const selectedDataForPE =
                  state.selectedData[getHashKey(key, "PE")];

                return (
                  <tr
                    id={"result_" + key}
                    key={key}
                    className="flex w-full flex-row border-b-2 border-gray-200"
                  >
                    {/* BUY/SELL button for CE */}
                    <td className="flex w-1/5 flex-col items-center gap-2 bg-gray-50 px-6 py-4">
                      {closeCE && (
                        <>
                          <div className="flex flex-row">
                            <button
                              className={getBuyClass(
                                state.selectedData,
                                getHashKey(key, "CE")
                              )}
                              key={buyCEButtonKey}
                              id={buyCEButtonKey}
                              onClick={ handleSelection(
                                    getHashKey(key, "CE"),
                                    getOptionChainForOptionType(value, "CE"),
                                    "LONG"
                                  )}
                            >
                              B
                            </button>
                            <button
                              className={getSellClass(
                                state.selectedData,
                                getHashKey(key, "CE")
                              )}
                              key={sellCEButtonKey}
                              id={sellCEButtonKey}
                              onClick={handleSelection(
                                getHashKey(key, "CE"),
                                getOptionChainForOptionType(value, "CE"),
                                "SHORT"
                              )}
                            >
                              S
                            </button>
                          </div>
                          {selectedDataForCE && (
                            <div className="flex flex-row">
                              <input
                                id="lots"
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-1 py-1 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                type="number"
                                value={selectedDataForCE.lots}
                                onChange={handleUpdateLots(
                                  getHashKey(key, "CE"),
                                  getOptionChainForOptionType(value, "CE")
                                )}
                                min={
                                  selectedDataForCE.is_selected
                                    ? selectedDataForCE.old_lots
                                      ? selectedDataForCE.old_lots
                                      : selectedDataForCE.lots
                                    : 1
                                }
                                max={100}
                              />
                            </div>
                          )}
                        </>
                      )}
                    </td>

                    {/* Display close of CE*/}
                    <td className={getCEClass(optionChain, key)}>{closeCE}</td>

                    {/* Display symbol  */}
                    <td className={getSymbolClass(optionChain, key)}>{key}</td>

                    {/* Display close of PE*/}
                    <td className={getPEClass(optionChain, key)}>{closePE}</td>

                    {/* BUY/SELL button for PE */}
                    <td className="flex w-1/5 flex-col items-center gap-2 bg-gray-50 px-6 py-4">
                      {closePE && (
                        <>
                          <div className="flex flex-row">
                            <button
                              className={getBuyClass(
                                state.selectedData,
                                getHashKey(key, "PE")
                              )}
                              key={buyPEButtonKey}
                              id={buyPEButtonKey}
                              onClick={handleSelection(
                                getHashKey(key, "PE"),
                                getOptionChainForOptionType(value, "PE"),
                                "LONG"
                              )}
                            >
                              B
                            </button>
                            <button
                              className={getSellClass(
                                state.selectedData,
                                getHashKey(key, "PE")
                              )}
                              key={sellPEButtonKey}
                              id={sellPEButtonKey}
                              onClick={handleSelection(
                                getHashKey(key, "PE"),
                                getOptionChainForOptionType(value, "PE"),
                                "SHORT"
                              )}
                            >
                              S
                            </button>
                          </div>
                          {selectedDataForPE && (
                            <div className="flex flex-row">
                              <input
                                id="lots"
                                className="block w-full rounded-lg border border-gray-300 bg-gray-50 px-1 py-1 text-center text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                                type="number"
                                value={selectedDataForPE.lots}
                                onChange={handleUpdateLots(
                                  getHashKey(key, "PE"),
                                  getOptionChainForOptionType(value, "PE")
                                )}
                                min={
                                  selectedDataForPE.is_selected
                                    ? selectedDataForPE.old_lots
                                      ? selectedDataForPE.old_lots
                                      : selectedDataForPE.lots
                                    : 1
                                }
                                max={100}
                              />
                            </div>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
         </div>
        
         <div  className={`w-10 h-[25rem] overflow-hidden flex flex-col gap-5 items-center justify-center  text-black rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
              ${
              getTableWidth() > parseInt(maxWidth.slice(0, -2)) ? '' : ''
            }  
            ${props.isSliding ? '' : ''}
            `}    
            onClick={props.handleSlideToggle}
            >
              
             
             <p className={`writing-vertical-rl text-mixed font-semibold ${props.isSliding ? 'hidden' : ' relative  '}`}>Option Chain</p> 
             <Image src={`${props.isSliding ? ' /svg/openArrow.svg' : '/svg/closeArrow.svg'}`} className={` ${props.isSliding ? '' : 'absolute left-[1.9rem]'}`} height={24} width={24} alt={""} />
           </div>
         </div>
    )
  );
};

export default OptionChain;
