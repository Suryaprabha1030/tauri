import React, { Dispatch, SetStateAction } from "react";
import EditOrder from "./EditOrder";
import RemoveOrders from "./RemoveOrders";
import SaveCancelButton from "./SaveCancelButton";
import StatusTooltip from "./StatusTooltip";
import OrderStatus from "./OrderStatus";
import OrderBuySellButton from "./OrderBuySellButton";
import EditOrderLots from "./EditOrderLots";
import SelectOrderTypeForLtp from "./SelectOrderTypeForLtp";
import OrderProduct from "./OrderProduct";
import OrderSymbol from "./OrderSymbol";
import EditOrderPrice from "./EditOrderprice";

interface TableBodyProps {
  filteredOrders: any;
  leftWidth: any;
  editOrderId: any;
  editedOrder: any;
  handleEditClick: (index: any) => void;
  handleSaveClick: (index: any) => void;
  activeTooltip: any;
  handleTooltipToggle: (index: any, event: any) => void;
  setEditOrderId: Dispatch<SetStateAction<any>>;
  brokerCode: number | null;
  setEditedOrder: Dispatch<SetStateAction<any>>;
  setOrdersData: Dispatch<SetStateAction<any>>;
  tooltipRef: any;
  tooltipIconRef: any;
}
const TableBody: React.FC<TableBodyProps> = ({
  filteredOrders,
  leftWidth,
  editOrderId,
  editedOrder,
  handleEditClick,
  handleSaveClick,
  activeTooltip,
  handleTooltipToggle,
  setEditOrderId,
  brokerCode,
  setEditedOrder,
  setOrdersData,
  tooltipRef,
  tooltipIconRef,
}) => {
  return (
    <tbody className="bg-white text-center font-table max-xl:overflow-y-auto max-xl:scrollbar-none ">
      {filteredOrders.map((order: any, index: any) => (
        <React.Fragment key={index}>
          <tr
            className={`group relative w-full text-center sm:max-2xl:text-standard 2xl:text-global ${
              editOrderId !== order.order_id ? "border-b hover:bg-gray-100" : ""
            }`}
          >
            {leftWidth > 40 && (
              <td className="w-[5rem] whitespace-nowrap px-2 py-1 max-xl:hidden">
                {order.order_id}
              </td>
            )}
            <td className="whitespace-nowrap py-1 text-center max-md:px-1 max-sm:text-[0.65rem] sm:max-md:w-[9rem] sm:max-md:py-[1.5rem] md:max-xl:py-[2rem] md:max-lg:w-[17rem] lg:max-xl:w-[12rem] xl:w-auto xl:px-2  ">
              <OrderSymbol order={order} leftWidth={leftWidth} />
            </td>

            {leftWidth >= 80 && (
              <td className="whitespace-nowrap py-4 text-center max-md:px-1 max-sm:text-[0.65rem] sm:max-md:w-[5rem] sm:max-md:py-[1.5rem] md:max-xl:py-[2rem] md:max-lg:w-[7rem] xl:w-[3rem] xl:px-2  ">
                <SelectOrderTypeForLtp
                  order={order}
                  setEditedOrder={setEditedOrder}
                  editedOrder={editedOrder}
                  editOrderId={editOrderId}
                />
              </td>
            )}

            {leftWidth >= 80 && (
              <>
                <td className="w-[3rem] whitespace-nowrap px-2 py-4 text-center md:max-xl:py-[2rem]">
                  <span>
                    <OrderProduct order={order} />
                  </span>
                </td>{" "}
              </>
            )}
            <td className="w-[4rem] whitespace-nowrap px-2 py-1 max-sm:text-[0.65rem] sm:max-md:py-[1.5rem] md:max-xl:py-[2rem] ">
              <EditOrderLots
                order={order}
                setEditedOrder={setEditedOrder}
                editedOrder={editedOrder}
                editOrderId={editOrderId}
              />
            </td>
            {leftWidth >= 40 && (
              <td className="w-[4rem] whitespace-nowrap px-2 py-1  max-sm:text-[0.65rem] md:max-xl:py-[2rem] ">
                {order?.average_price}
              </td>
            )}
            {leftWidth >= 40 && (
              <td className="w-[4rem] whitespace-nowrap px-2 py-1 max-sm:text-[0.65rem] md:max-xl:py-[2rem] ">
                <EditOrderPrice
                  order={order}
                  setEditedOrder={setEditedOrder}
                  editedOrder={editedOrder}
                  editOrderId={editOrderId}
                />
              </td>
            )}
            <td>
              <OrderBuySellButton order={order} />
            </td>
            <td className="whitespace-nowrap py-1 max-sm:w-[7rem] max-sm:px-[0.2rem] max-sm:text-[0.65rem] sm:max-md:w-[4rem] sm:max-md:px-[0.35rem] sm:max-md:py-[1.5rem] md:max-xl:w-[6rem] md:max-xl:py-[2rem] xl:w-auto xl:px-2   ">
              <div className="flex w-full flex-col items-start justify-center gap-2">
                <div className="flex flex-row items-center justify-center gap-2 max-md:w-[7rem] sm:max-md:gap-4 md:max-xl:w-[10rem] md:max-xl:justify-start">
                  <OrderStatus order={order} />
                  <StatusTooltip
                    activeTooltip={activeTooltip}
                    handleTooltipToggle={handleTooltipToggle}
                    order={order}
                    index={index}
                    tooltipRef={tooltipRef}
                    tooltipIconRef={tooltipIconRef}
                  />
                </div>
                <div className="flex flex-row max-md:gap-1  xl:gap-2">
                  <span className=" xl:text-[0.75rem]">
                    {order.update_time}
                  </span>

                  <div className=" absolute  bottom-0 right-5 flex items-center justify-center gap-1 opacity-0 group-hover:bg-gray-100 group-hover:opacity-100 max-sm:right-16 max-sm:w-[3rem] sm:max-md:right-[5.7rem] md:max-xl:gap-4 md:max-lg:right-[7.7rem] lg:max-xl:right-[12rem]">
                    <EditOrder
                      handleEditClick={handleEditClick}
                      editOrderId={editOrderId}
                      order={order}
                    />
                    <RemoveOrders
                      order={order}
                      editOrderId={editOrderId}
                      brokerCode={brokerCode}
                      setEditOrderId={setEditOrderId}
                      setOrdersData={setOrdersData}
                    />
                  </div>
                </div>
              </div>
            </td>
          </tr>

          {editOrderId === order.order_id && (
            <tr className="h-7 border-b text-[0.68rem] font-semibold max-md:text-[0.58rem] max-sm:w-[100%]">
              <td
                colSpan={9}
                className="py-[0.2rem] text-center max-md:px-1 xl:px-1"
              >
                <SaveCancelButton
                  handleSaveClick={handleSaveClick}
                  index={index}
                  setEditOrderId={setEditOrderId}
                />
              </td>
            </tr>
          )}
        </React.Fragment>
      ))}
    </tbody>
  );
};

export default TableBody;
