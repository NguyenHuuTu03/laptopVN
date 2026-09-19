// 1. Khởi tạo state ban đầu từ localStorage (nếu có)
const init = {
  items: JSON.parse(localStorage.getItem("cart") || "[]"),
};

const cartReducer = (state = init, action) => {
  switch (action.type) {
    case "ADD_TO_CART": {
      const newItem = action.payload; // { productId, variantId, quantity }

      // Tìm xem variantId này đã tồn tại trong giỏ hàng chưa
      const existingIndex = state.items.findIndex(
        (item) => item.variantId === newItem.variantId,
      );

      let updatedItems;

      if (existingIndex > -1) {
        // Nếu ĐÃ CÓ trong giỏ -> Cộng dồn số lượng quantity
        updatedItems = state.items.map((item, index) => {
          if (index === existingIndex) {
            return {
              ...item,
              quantity: item.quantity + newItem.quantity,
            };
          }
          return item;
        });
      } else {
        // Nếu CHƯA CÓ trong giỏ -> Thêm phần tử mới vào mảng
        updatedItems = [...state.items, newItem];
      }

      // Lưu giỏ hàng mới nhất vào localStorage
      localStorage.setItem("cart", JSON.stringify(updatedItems));

      return {
        ...state,
        items: updatedItems,
      };
    }

    default:
      return state;
  }
};

export default cartReducer;
