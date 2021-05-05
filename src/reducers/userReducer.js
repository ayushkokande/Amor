const userReducer = (state = { user: false, id: null }, action) => {
  switch (action.type) {
    default:
      return state;

    case "signedIn":
      return { user: true, id: action.id };
  }
};

export default userReducer;
