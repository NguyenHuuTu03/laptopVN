export const setCart = (product) => {
  return {
    type: "SET_CART",
    payload: product,
  };
};
export const addToCart = (product) => {
  return {
    type: "ADD_TO_CART",
    payload: product,
  };
};
