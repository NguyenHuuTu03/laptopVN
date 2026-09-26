import { get, patch, post } from "../../utils/request";

export const login = async (data) => {
  return await post("/users/login", data);
};

export const register = async (data) => {
  return await post("/users/register", data);
};

export const getProfile = async () => {
  return await get("/users/profile");
};

export const logout = async () => {
  return await post("/users/logout");
};
export const updateProfile = async (data) => {
  return await patch("/users/profile", data);
};
export const changePassword = async (data) => {
  return await patch("/users/change-password", data);
};
