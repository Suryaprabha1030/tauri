import { UserBrokerRouterApi } from "@/lib/api/base";
import { baseConfig } from "@/lib/api/baseConfiguration";
import { toast } from "react-toastify";
import { autoLogoutTokenRemove } from "../../autoLogoutUtil/autoLogOutUtil";
import { brokerLogoutTokenRemove } from "../../autoLogoutUtil/brokerLogOutUtil";

const filterOrders = (
  ordersData: any[] | null,
  activeStatusFilter: string | null,
  transactionFilter: string | null
) => {
  if (!ordersData) {
    return []; // Return an empty array if ordersData is null
  }
  return ordersData?.filter(
    (order) =>
      (activeStatusFilter ? order.status === activeStatusFilter : true) &&
      (transactionFilter ? order.transaction_type === transactionFilter : true)
  );
};

const handleCancelOrder = (
  OrderId: number,
  Variety: any,
  setEditOrderId: any,
  brokerCode: any,
  setOrdersData: any,
  router: any
) => {
  const payload = {
    order_id: OrderId,
    variety: Variety,
  };
  const OrderApi = new UserBrokerRouterApi(baseConfig());
  OrderApi.cancelOrderV1UsersMeBrokersBrokerCodeOrdersCancelPost(
    brokerCode,
    payload
  )
    .then((res) => {
      toast("Order has been Cancelled successfully");

      // Close the edit mode after cancel
      setTimeout(() => {
        setEditOrderId(null);
        fetchData(brokerCode, setOrdersData, router);
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

const handleFieldChange = (field: string, value: any, setEditedOrder: any) => {
  setEditedOrder((prev: any) => {
    // If the field being changed is "lots", update the lot_size field as well
    if (field === "qty") {
      const initialQty = prev.quantity / prev.lots; // Calculate initial quantity
      const newQuantity = value; // Set new quantity to the input value
      const updatedLotSize = newQuantity; // Update lot_size with new quantity
      const updatedLots = newQuantity / initialQty; // Calculate new lots

      return {
        ...prev,
        [field]: value,
        quantity: newQuantity,
        // lot_size: updatedLotSize, // Set lot_size equal to quantity
        lots: updatedLots, // Update lots
      };
    }

    // If the field is not "lots", just update the field normally
    return {
      ...prev,
      [field]: value,
    };
  });
};

const fetchData = (brokerCode: any, setOrdersData: any, router: any) => {
  const ordersApi = new UserBrokerRouterApi(baseConfig());
  if (brokerCode) {
    ordersApi
      .fetchMyBrokerOrdersV1UsersMeBrokersBrokerCodeOrdersGet(brokerCode)
      .then((response) => {
        const sortedData: any = response?.data?.sort((a: any, b: any) => {
          const dateA: any = new Date(a.update_time);
          const dateB: any = new Date(b.update_time);
          return dateB - dateA; // Descending order
        });
        setOrdersData(sortedData);
      })
      .catch((err: any) => {
        if (err?.response && err?.response?.status == 401) {
          autoLogoutTokenRemove(router);
        }
        if (err?.response && err?.response?.status == 456) {
          brokerLogoutTokenRemove(router);
        }
      });
  }
};

export { filterOrders, handleCancelOrder, handleFieldChange, fetchData };
