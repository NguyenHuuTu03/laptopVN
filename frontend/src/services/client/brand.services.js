import api from "../api";

export const getBrands = async (categoryId) => {
  const response = await api.get("/brands", {
    params: {
      categoryId,
    },
  });

  return response.data.data?.brands || [];
};
