import { get, patch, del, post } from "../../utils/request";

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

export const postProduct = async (data) => {
  const result = await post(`/admin/products`, data);

  return result;
};

export const patchProduct = async (id, data) => {
  const result = await patch(`/admin/products/${id}`, data);

  return result;
};

export const getProduct = async (id) => {
  const result = await get(`/admin/products/${id}`);

  return result;
};
