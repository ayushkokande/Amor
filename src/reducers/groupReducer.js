const groupReducer = (state = { group: [] }, action) => {
  switch (action.type) {
    default:
      return state;

    case "groupMatch":
      return { group: action.group };
  }
};

export default groupReducer;
