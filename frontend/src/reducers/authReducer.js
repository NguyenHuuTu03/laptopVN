const initialState = {
  client: {
    isLoggedIn: false,
    user: null,
    checked: false,
  },

  admin: {
    isLoggedIn: false,
    user: null,
    checked: false,
  },
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_CLIENT_AUTH":
      return {
        client: {
          isLoggedIn: action.payload.isLoggedIn,
          user: action.payload.user,
          checked: true,
        },
      };
    case "SET_ADMIN_AUTH":
      return {
        admin: {
          isLoggedIn: action.payload.isLoggedIn,
          user: action.payload.user,
          checked: true,
        },
      };
    default:
      return state;
  }
};

export default authReducer;
