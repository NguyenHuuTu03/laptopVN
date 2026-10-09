import { get } from "../../utils/request";

export const getCoupons = async () => {
  const res = await get("/coupons");
  return res;
};
