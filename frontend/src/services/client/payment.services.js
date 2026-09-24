import { post } from "../../utils/request";

export const paymentVNPay = async (orderId) => {
  const result = await post("/payment/vnpay", {
    orderId,
  });

  return result;
};
