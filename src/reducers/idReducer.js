const idReducer = (state = { id: null }, action) => {
  switch (action.type) {
    default:
      return state;

    case "receivedID":
      return { id: action.id };
  }
};

export default idReducer;
