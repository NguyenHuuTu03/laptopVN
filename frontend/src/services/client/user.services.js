import api from "../api";

export const login = async (data) => {
  const response = await api.post("/users/login", data);
  const result = response.data;

  return result;
};

export const register = async (data) => {
  const response = await api.post("/users/register", data);
  const result = response.data;

  return result;
};

export const getProfile = async () => {
  const response = await api.get("/users/profile");
  return response.data;
};

export const logout = async () => {
  const response = await api.post("/users/logout");
  return response.data;
};
