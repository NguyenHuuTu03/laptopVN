import { get, patch, del, post } from "../../utils/request";

export const getBrands = async (params = {}) => {
  const result = await get("/admin/brands", { params });

  return result;
};

export const changeStatus = async (id, status) => {
  const result = await patch(`/admin/brands/${id}/change-status`, {
    status,
  });

  return result;
};
export const removeBrand = async (id) => {
  const result = await del(`/admin/brands/${id}`);

  return result;
};

export const postBrand = async (data) => {
  const result = await post(`/admin/brands`, data);

  return result;
};

export const getBrand = async (id) => {
  const result = await get(`/admin/brands/${id}`);

  return result;
};

export const patchBrand = async (id, data) => {
  const result = await patch(`/admin/brands/${id}`, data);

  return result;
};
