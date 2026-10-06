import { get, patch } from "../../utils/request";

export const getOrderShip = async (params = {}) => {
  const result = await get("/admin/shipper/orders", { params });

  return result;
};

export const acceptOrder = async (id) => {
  const result = await patch(`/admin/shipper/${id}/accept`);

  return result;
};

export const changeStatus = async (id, orderStatus) => {
  const result = await patch(`/admin/shipper/${id}/change-status`, {
    orderStatus,
  });

  return result;
};
