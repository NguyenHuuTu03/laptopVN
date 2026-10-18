import { get, post, patch } from "../../utils/request";

export const getCheckout = async () => {
  const result = await get(`/order/checkout`);
  return result;
};

export const applyCoupon = async (data) => {
  const result = await post("/order/apply-coupon", data);

  return result;
};
export const postOrder = async (data) => {
  const result = await post("/order", data);

  return result;
};
export const getOrderDetail = async (orderCode) => {
  const result = await get(`/order/${orderCode}`);
  return result;
};
export const patchOrderCancel = async (orderCode) => {
  const result = await patch(`/order/cancel/${orderCode}`);
  return result;
};
export const getMyOrders = async (page = 1, limit = 2) => {
  const result = await get(`/order/my-orders?page=${page}&limit=${limit}`);
  return result;
};
export const buyNow = async (data) => {
  const result = await post(`/order/buy-now`, data);
  return result;
};
