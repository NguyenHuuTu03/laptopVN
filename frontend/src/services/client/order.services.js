import { get, post } from "../../utils/request";

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
