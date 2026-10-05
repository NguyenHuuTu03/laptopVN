import { get, patch, del } from "../../utils/request";

export const getCategories = async (params = {}) => {
  const result = await get("/admin/categories", { params });

  return result;
};

export const changeStatus = async (id, status) => {
  const result = await patch(`/admin/categories/${id}/change-status`, {
    status,
  });

  return result;
};
export const removeCategory = async (id) => {
  const result = await del(`/admin/categories/${id}`);

  return result;
};
