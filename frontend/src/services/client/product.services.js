import api from "../api";

export const getFeaturedProducts = async () => {
  const response = await api.get("/products", {
    params: {
      featured: true,
      limit: 5,
    },
  });

  const result = response.data;

  return result.data?.products || [];
};

export const getCollectionProducts = async (slug, params = {}) => {
  const response = await api.get(`/collections/${slug}`, {
    params,
  });

  const result = response.data;

  return result.data?.products || [];
};
