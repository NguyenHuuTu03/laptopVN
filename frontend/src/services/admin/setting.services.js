import { get, patch } from "../../utils/request";

export const getSettings = async () => {
  const result = await get("/admin/settings/general");

  return result;
};
export const patchSettings = async (data) => {
  const result = await patch("/admin/settings/general", data);

  return result;
};
