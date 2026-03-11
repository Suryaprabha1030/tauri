import { UserBrokerRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import OrderHeader from "./OrderHeader";
import ImageBox from "../sharedContent/ImageBox";
import TableHeader from "./OrderTableHeader";
import TableBody from "./OrderTableBody";
import {
  fetchData,
  filterOrders,
} from "@/lib/util/sideToolBar/orders/handlingOrders";
import { ModifyOrderData } from "@/lib/util/sideToolBar/orders/OrderUtil";
import { autoLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/autoLogOutUtil";
import { useRouter } from "next/navigation";
import { brokerLogoutTokenRemove } from "@/lib/util/autoLogoutUtil/brokerLogOutUtil";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/lib/redux/Store";
import { useSimulatedOrders } from "@/components/Simulation/SimulationOrders/useSimulatedOrders";
import { setSimulatedOrders } from "@/lib/redux/slices/SimulationSlice";
import { sampleOrders } from "@/components/Simulation/SimulationOrders/sampleOrders";
import { addSymbol } from "@/lib/redux/slices/StrategySlice";

interface OrdersProps {
  brokerCode: number | null;
  leftWidth: number;
  setLeftWidth: React.Dispatch<React.SetStateAction<any>>;
}

const Orders: React.FC<OrdersProps> = ({
  brokerCode,
  leftWidth,
  setLeftWidth,
}) => {
  const [ordersData, setOrdersData] = useState<any[]>([]);
  const [refresh, setresfresh] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [activeStatusFilter, setActiveStatusFilter] = useState<string | null>(
    null
  );
  const [transactionFilter, setTransactionFilter] = useState<string | null>(
    null
  );
  const [editOrderId, setEditOrderId] = useState<string | null>(null);
  const [editedOrder, setEditedOrder] = useState<any>({});
  const router = useRouter();
  const tooltipRef = useRef<HTMLDivElement>(null);
  const tooltipIconRef = useRef<HTMLDivElement>(null);
  const handleTooltipToggle = (index: any, event: any) => {
    event.stopPropagation();
    setActiveTooltip(activeTooltip === index ? null : index); // Toggle tooltip for the current row
  };
  const OrdersDemoEnabled = useSelector(
    (state: RootState) => state.SimulationDemo.ordersDemo
  );
  const webSocketDataRead = useSelector(
    (state: RootState) => state.strategy.symbolsPrice
  );
  const Simulatedorders: any = useSimulatedOrders(webSocketDataRead);
  const dispatch = useDispatch();
  // Fetch data when the component mounts
  useEffect(() => {
    //subscribing live tick for simlated orders
    if (!sampleOrders?.length) return;

    sampleOrders.forEach((item) => {
      dispatch(
        addSymbol({
          symbol: item.identifier,
        })
      );
    });
  }, []);

  useEffect(() => {
    //For Simulated Orders
    if (OrdersDemoEnabled) {
      const sortedData: any = [...Simulatedorders]?.sort((a: any, b: any) => {
        const dateA: any = new Date(a.update_time);
        const dateB: any = new Date(b.update_time);
        return dateB - dateA; // Descending order
      });
      setOrdersData(sortedData);
      dispatch(setSimulatedOrders(sortedData));
    } else fetchData(brokerCode, setOrdersData, router);
  }, [refresh, OrdersDemoEnabled]);

  const filteredOrders = filterOrders(
    ordersData,
    activeStatusFilter,
    transactionFilter
  );

  const handleEditClick = (order: any) => {
    setEditOrderId(order.order_id);
    setEditedOrder({ ...order });
  };

  const handleSaveClick = (index: number) => {
    // // Update the filteredOrders or backend here with the editedOrder
    const updatedOrders = [...filteredOrders];
    const finalOrder = {
      ...editedOrder,
      price:
        editedOrder.price === "" || editedOrder.price == null
          ? filteredOrders[index].price
          : editedOrder.price,
    };

    updatedOrders[index] = finalOrder;
    // updatedOrders[index] = editedOrder;
    setOrdersData(updatedOrders);
    const updatedData: any = ModifyOrderData(updatedOrders[index]);
    const OrderApi = new UserBrokerRouterApi(baseConfig());
    OrderApi.modifyOrderV1UsersMeBrokersBrokerCodeOrdersPut(
      brokerCode,
      updatedData
    )
      .then((res) => {
        toast("Order Updated Successfully");
        const updatedStatus = res.data?.status;
        const updatedDescription = res.data?.message;
        // Update the status in the local state
        updatedOrders[index] = {
          ...updatedOrders[index],
          status: updatedStatus,
          description: updatedDescription,
          update_time: "",
        };

        setOrdersData(updatedOrders);
        setTimeout(() => {
          setEditOrderId(null);
        }, 300); // Close the edit mode after 300ms
      })
      .catch((err: any) => {
        if (err?.response && err?.response?.status == 401) {
          autoLogoutTokenRemove(router);
        }
        if (err?.response && err?.response?.status == 456) {
          brokerLogoutTokenRemove(router);
        }
      });
  };

  const handleTooltipClickOutside = (event: MouseEvent) => {
    if (
      tooltipRef.current &&
      !tooltipRef.current.contains(event.target as Node) &&
      tooltipIconRef.current &&
      !tooltipIconRef.current.contains(event.target as Node)
    ) {
      setActiveTooltip(null);
    }
  };

  useEffect(() => {
    if (activeTooltip != null) {
      document.addEventListener("mousedown", handleTooltipClickOutside);
    } else {
      document.removeEventListener("mousedown", handleTooltipClickOutside);
    }
    return () =>
      document.removeEventListener("mousedown", handleTooltipClickOutside);
  }, [activeTooltip]);

  return (
    <>
      <OrderHeader
        activeStatusFilter={activeStatusFilter}
        setActiveStatusFilter={setActiveStatusFilter}
        setTransactionFilter={setTransactionFilter}
        transactionFilter={transactionFilter}
        ordersData={ordersData}
        setresfresh={setresfresh}
        refresh={refresh}
        leftWidth={leftWidth}
        setLeftWidth={setLeftWidth}
      />

      <div
        className={`overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-none max-xl:h-[88%] max-xl:overflow-x-hidden max-xl:px-0.5 max-xl:scrollbar-none xl:h-[80%] ${
          filteredOrders.length <= 0 ? "" : "max-md:py-1"
        } xl:p-2`}
      >
        {filteredOrders.length > 0 ? (
          <table className="w-full divide-y divide-gray-200 max-sm:mb-4">
            <TableHeader leftWidth={leftWidth} />
            <TableBody
              filteredOrders={filteredOrders}
              leftWidth={leftWidth}
              editOrderId={editOrderId}
              editedOrder={editedOrder}
              handleEditClick={handleEditClick}
              handleSaveClick={handleSaveClick}
              activeTooltip={activeTooltip}
              handleTooltipToggle={handleTooltipToggle}
              setEditOrderId={setEditOrderId}
              brokerCode={brokerCode}
              setEditedOrder={setEditedOrder}
              setOrdersData={setOrdersData}
              tooltipRef={tooltipRef}
              tooltipIconRef={tooltipIconRef}
            />
          </table>
        ) : (
          <ImageBox
            imagePath="/svg/orders.svg"
            display="No Orders placed"
            width={250}
            height={230}
          />
        )}
      </div>
    </>
  );
};
export default Orders;
