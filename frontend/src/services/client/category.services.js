import api from "../api";

export const getCategories = async () => {
  const response = await api.get("/categories");
  const result = response.data;
  return result.data?.categories || [];
};
