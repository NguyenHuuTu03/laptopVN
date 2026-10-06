import { get, patch } from "../../utils/request";

export const getOrders = async (params = {}) => {
  const result = await get("/admin/orders", { params });

  return result;
};

export const changeStatus = async (id, orderStatus) => {
  const result = await patch(`/admin/orders/${id}/change-status`, {
    orderStatus,
  });

  return result;
};
