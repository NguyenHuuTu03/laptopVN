import { get } from "../../utils/request";

export const getProducts = async (params = {}) => {
  const result = await get("/admin/products", { params });

  return result;
};
