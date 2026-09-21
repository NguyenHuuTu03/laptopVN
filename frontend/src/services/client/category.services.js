import { get } from "../../utils/request";

export const getCategories = async () => {
  const result = await get("/categories");
  return result.data?.categories || [];
};
