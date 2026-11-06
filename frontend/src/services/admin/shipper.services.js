import { get, patch } from "../../utils/request";

export const getOrderShip = async (params = {}) => {
  const result = await get("/admin/shipper/orders", { params });

  return result;
};

export const acceptOrder = async (id, shipperId) => {
  const result = await patch(`/admin/shipper/${id}/accept`, { shipperId });

  return result;
};

export const changeStatus = async (id, orderStatus) => {
  const result = await patch(`/admin/shipper/${id}/change-status`, {
    orderStatus,
  });

  return result;
};

export const getReceivedOrder = async (params = {}) => {
  const result = await get("/admin/shipper/orders/received", { params });

  return result;
};

export const getOrder = async (id) => {
  const result = await get(`/admin/shipper/${id}`);

  return result;
};

export const getShipper = async () => {
  const result = await get(`/admin/shipper`);

  return result;
};
