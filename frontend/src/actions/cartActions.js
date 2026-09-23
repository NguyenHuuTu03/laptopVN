export const setCart = (data) => {
  return {
    type: "SET_CART",
    payload: data,
  };
};
export const addToCart = (item) => {
  return {
    type: "ADD_TO_CART",
    payload: item,
  };
};

export const updateQuantity = (item) => {
  return {
    type: "UPDATE_QUANTITY",
    payload: item,
  };
};

export const deletedItem = (item) => {
  return {
    type: "DELETE_ITEM",
    payload: item,
  };
};

export const clearCart = () => {
  return {
    type: "CLEAR_CART",
  };
};
