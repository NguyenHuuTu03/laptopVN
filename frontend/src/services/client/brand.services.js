import { get } from "../../utils/request";

export const getBrands = async (categoryId) => {
  const res = await get("/brands", {
    params: { categoryId },
  });
  return res.data?.brands || [];
};

export const getAllBrands = async () => {
  const res = await get("/brands");
  return res.data?.brands || [];
};

export const getCategoryBySlug = async (slug) => {
  const res = await get(`/categories/${slug}`);
  return res.data?.category;
};
