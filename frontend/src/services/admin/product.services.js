import { get, patch, del } from "../../utils/request";

export const getProducts = async (params = {}) => {
  const result = await get("/admin/products", { params });

  return result;
};

export const changeStatus = async (id, status) => {
  const result = await patch(`/admin/products/${id}/change-status`, {
    status,
  });

  return result;
};
export const removeProduct = async (id) => {
  const result = await del(`/admin/products/${id}`);

  return result;
};
