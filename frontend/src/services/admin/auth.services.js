import { get, post } from "../../utils/request";

export const login = async (data) => {
  return await post("/admin/auth/login", data);
};

export const logout = async () => {
  return await post("/admin/auth/logout");
};
export const getProfile = async () => {
  return await get("/admin/auth/profile");
};
