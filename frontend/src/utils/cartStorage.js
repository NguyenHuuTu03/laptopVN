export const saveCart = (items) => {
  localStorage.setItem("cart", JSON.stringify(items));
};

export const getCart = () => {
  const cart = localStorage.getItem("cart");

  return cart ? JSON.parse(cart) : [];
};
