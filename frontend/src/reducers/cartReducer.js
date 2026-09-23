const init = JSON.parse(localStorage.getItem("cart") || "[]");

const cartReducer = (state = init, action) => {
  switch (action.type) {
    case "SET_CART": {
      return action.payload;
    }
    case "ADD_TO_CART": {
      const newItem = action.payload;

      const index = state.findIndex(
        (item) =>
          item.productId === newItem.productId &&
          item.variantId === newItem.variantId,
      );

      if (index !== -1) {
        const newState = state.map((item, i) => {
          if (i === index) {
            return {
              ...item,
              quantity: item.quantity + newItem.quantity,
            };
          }
          return item;
        });
        return newState;
      }

      return [...state, newItem];
    }

    case "UPDATE_QUANTITY": {
      const { productId, variantId, quantity } = action.payload;
      const newState = state.map((item) => {
        if (item.productId === productId && item.variantId === variantId) {
          return {
            ...item,
            quantity,
          };
        }
        return item;
      });
      return newState;
    }

    case "DELETE_ITEM": {
      const { productId, variantId } = action.payload;
      const newState = state.filter(
        (item) =>
          !(item.productId === productId && item.variantId === variantId),
      );
      return newState;
    }

    case "CLEAR_CART":
      return [];

    default:
      return state;
  }
};

export default cartReducer;
