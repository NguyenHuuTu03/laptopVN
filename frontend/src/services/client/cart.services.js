import { post, patch, del, get } from "../../utils/request";

export const getCart = async () => {
  const result = await get("/cart");
  return result;
};

export const mergeCart = async (cartItems) => {
  const result = await post("/cart/merge", {
    cart: { items: cartItems },
  });
  return result;
};

export const previewCart = async (cartItems, couponCode = "") => {
  const cart = {
    items: cartItems,
  };

  if (couponCode.trim()) {
    cart.couponCode = couponCode.trim();
  }

  const result = await post("/cart/preview", {
    cart,
  });
  return result;
};

export const addCart = async (cartItem) => {
  const result = await post(`/cart/add`, cartItem);
  return result;
};
export const updateQuantityCart = async (cartItemId, quantity) => {
  const result = await patch(`/cart/update/${cartItemId}`, { quantity });
  return result;
};

export const deleteCartItem = async (cartItemId) => {
  const result = await del(`/cart/delete/${cartItemId}`);
  return result;
};

export const applyCoupon = async (cartItems, couponCode) => {
  const result = await post("/cart/apply-coupon", {
    cart: {
      items: cartItems,
      couponCode: couponCode.trim(),
    },
  });

  return result;
};
