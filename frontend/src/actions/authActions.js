export const setClientAuth = (data) => ({
  type: "SET_CLIENT_AUTH",
  payload: data,
});

export const setAdminAuth = (data) => ({
  type: "SET_ADMIN_AUTH",
  payload: data,
});
