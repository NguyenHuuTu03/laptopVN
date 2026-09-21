export const setAuth = (authData) => {
  return {
    type: "SET_AUTH",
    payload: authData,
  };
};
