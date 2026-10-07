import { get, patch, del } from "../../utils/request";

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
