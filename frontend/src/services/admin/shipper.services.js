import { get, patch } from "../../utils/request";

export const getOrderShip = async (params = {}) => {
  const result = await get("/shipper/orders", { params });

  return result;
};

export const changeStatus = async (id, orderStatus) => {
  const result = await patch(`/shipper/${id}/change-status`, {
    orderStatus,
  });

  return result;
};

export const getOrderShipDetail = async (id) => {
  const result = await get(`/shipper/${id}`);

  return result;
};

export const getShipper = async () => {
  const result = await get(`/shipper`);

  return result;
};

export const assignment = async (orderId, shipperId) => {
  const result = await get(`/shipper/${orderId}/assignment`, { shipperId });

  return result;
};
