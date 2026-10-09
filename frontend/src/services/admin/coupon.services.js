import { get, patch, del } from "../../utils/request";

export const getCoupons = async (params = {}) => {
  const result = await get("/admin/coupons", { params });

  return result;
};

export const changeStatus = async (id, status) => {
  const result = await patch(`/admin/coupons/${id}/change-status`, {
    status,
  });

  return result;
};
export const removeCoupon = async (id) => {
  const result = await del(`/admin/coupons/${id}`);

  return result;
};
