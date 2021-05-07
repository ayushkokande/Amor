const groupReducer = (state = { group: [] }, action) => {
  switch (action.type) {
    default:
      return state;

    case "groupMatch":
      return { group: action.group };

    case "groupDone":
      return { group: [] };
  }
};

export default groupReducer;
