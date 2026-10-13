import { get, patch, del, post } from "../../utils/request";

export const getUsers = async (params = {}) => {
  const result = await get("/admin/users", { params });

  return result;
};

export const changeStatus = async (id, status) => {
  const result = await patch(`/admin/users/${id}/change-status`, {
    status,
  });

  return result;
};
export const removeUser = async (id) => {
  const result = await del(`/admin/users/${id}`);

  return result;
};

export const postUser = async (data) => {
  const result = await post(`/admin/users`, data);

  return result;
};

export const patchUser = async (id, data) => {
  const result = await patch(`/admin/users/${id}`, data);

  return result;
};

export const gethUser = async (id) => {
  const result = await get(`/admin/users/${id}`);

  return result;
};

export const resetPassword = async (id, data) => {
  const result = await patch(`/admin/users/${id}/reset-password`, data);

  return result;
};
