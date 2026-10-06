import { get, patch, del } from "../../utils/request";

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
