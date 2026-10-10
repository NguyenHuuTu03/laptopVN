const initialState = {
  title: "",
  email: "",
  hotline: "",
  address: "",
  logo: "",
  sideBar: [],
};

const settingReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_SETTINGS":
      return {
        ...action.payload,
      };

    default:
      return state;
  }
};

export default settingReducer;
