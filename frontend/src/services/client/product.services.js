import { get } from "../../utils/request";

export const getFeaturedProducts = async () => {
  const result = await get("/products", {
    params: {
      featured: true,
      limit: 5,
    },
  });

  return result.data?.products || [];
};

export const getCollectionProducts = async (slug, params = {}) => {
  const result = await get(`/collections/${slug}`, {
    params,
  });

  return result.data || { products: [], pagination: {} };
};

export const getAllProducts = async (params = {}) => {
  const result = await get(`/products`, {
    params,
  });

  return result.data || { products: [], pagination: {} };
};

export const suggestProducts = async (keyword) => {
  const result = await get("/products/suggest", {
    params: {
      keyword,
    },
  });

  return result.data?.products || [];
};

export const getProductDetail = async (slug) => {
  return await get(`/products/${slug}`);
};

export const getProductRelated = async (slug) => {
  return await get(`/products/${slug}/related`);
};
