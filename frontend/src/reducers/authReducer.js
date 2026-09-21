const initialState = {
  isLoggedIn: false,
  user: null,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_AUTH":
      return {
        isLoggedIn: action.payload.isLoggedIn,
        user: action.payload.user,
      };

    default:
      return state;
  }
};

export default authReducer;
