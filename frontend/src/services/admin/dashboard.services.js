import { get } from "../../utils/request";

export const getDashboard = async () => {
  const result = await get("/admin");
  return result;
};
