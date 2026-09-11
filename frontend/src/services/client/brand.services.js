import api from "../api";

export const getBrands = async (categoryId) => {
  const response = await api.get("/brands", {
    params: {
      categoryId,
    },
  });

  return response.data.data?.brands || [];
};
export const getAllBrands = async () => {
  const response = await api.get("/brands");

  return response.data.data?.brands || [];
};
