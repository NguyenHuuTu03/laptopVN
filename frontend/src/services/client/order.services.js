import { get, post, patch } from "../../utils/request";

export const getCheckout = async () => {
  const result = await get(`/order/checkout`);
  return result;
};

export const applyCoupon = async (couponCode) => {
  const result = await post("/order/apply-coupon", { couponCode });

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
export const getMyOrders = async () => {
  const result = await get(`/order/my-orders`);
  return result;
};
