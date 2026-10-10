import { get } from "../../utils/request";

export const getSettings = async () => {
  const result = await get("/settings");

  return result;
};
