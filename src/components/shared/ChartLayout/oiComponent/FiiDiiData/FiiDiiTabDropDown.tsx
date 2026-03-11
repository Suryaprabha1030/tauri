import { useState, useRef, useEffect } from "react"
import Image from "next/image"

const FiiDiiTabDropDown = ({buttons, currentSection, onButtonClick}) => {

    const [ selectedButton, setSelectedButton ] = useState(currentSection)
    const [ isOpen, setIsOpen ] = useState(false)
    const fiiDiiDropDown = useRef<HTMLDivElement>(null)
    
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
        if (
            fiiDiiDropDown.current &&
            !fiiDiiDropDown.current.contains(event.target as Node)
        ) {
            setIsOpen(false);
        }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const dropDownButton = buttons.find((button: any) => button.value === selectedButton)
    return(
        <div ref={fiiDiiDropDown} className="">
          <button 
            className="flex flex-row border-gray-300 border text-[0.75rem] rounded-md shadow-sm  px-0.5 py-1.5 w-24"
            onClick={() => setIsOpen(!isOpen)}
            >
            {dropDownButton && dropDownButton.label}
            <Image className="ml-auto" src={"/svg/downChevron.svg"} alt="" width={16} height={16} />
          </button>

          {isOpen && (
            <ul className="absolute z-20 bg-white mt-1 overflow-y-auto rounded-lg shadow-lg border border-gray-200">
              {buttons.map((button: any) => (
                <li 
                key={button.label}
                onClick={() =>{
                    onButtonClick(button.value, button.route ? button.route : undefined)
                    setSelectedButton(button.value)
                    setIsOpen(false)
                }
                }
                className={` border-b border-gray-200 text-[0.75rem] px-2 py-1 ${selectedButton === button.value ? "bg-z-green-500 text-white" : "hover:bg-gray-200"}`}
                >{button.label}</li>
              ))}
            </ul>
          )   
          }
        </div>
    )
}

export default FiiDiiTabDropDown;