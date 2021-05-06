const userReducer = (state = { user: false, id: null, sex: null }, action) => {
  switch (action.type) {
    default:
      return state;

    case "signedIn":
      return { user: true, id: action.id, sex: action.sex };
  }
};

export default userReducer;
