import { get, patch, del, post } from "../../utils/request";

export const getRoles = async (params = {}) => {
  const result = await get("/admin/roles", { params });

  return result;
};

export const changeStatus = async (id, status) => {
  const result = await patch(`/admin/roles/${id}/change-status`, {
    status,
  });

  return result;
};
export const removeRole = async (id) => {
  const result = await del(`/admin/roles/${id}`);

  return result;
};

export const updatePermission = async (data) => {
  const result = await patch(`/admin/roles/permission`, data);

  return result;
};

export const postRole = async (data) => {
  const result = await post("/admin/roles", data);

  return result;
};

export const patchRole = async (id, data) => {
  const result = await patch(`/admin/roles/${id}`, data);

  return result;
};

export const getRole = async (id) => {
  const result = await get(`/admin/roles/${id}`);

  return result;
};
