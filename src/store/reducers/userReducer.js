const userReducer = (
  state = { user: false, id: null, sex: null, data: null },
  action
) => {
  switch (action.type) {
    default:
      return state;

    case "signedIn":
      return { user: true, id: action.id, sex: action.sex, data: action.data };

    case "signedOut":
      return { user: false, id: null, sex: null, data: null };
  }
};

export default userReducer;
