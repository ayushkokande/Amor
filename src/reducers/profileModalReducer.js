const profileModalReducer = (state = { idx: 0 }, action) => {
  switch (action.type) {
    default:
      return state;

    case "modal1":
      return { idx: 1 };

    case "modal2":
      return { idx: 2 };

    case "modal3":
      return { idx: 3 };
    case "modal4":
      return { idx: 4 };
    case "modal5":
      return { idx: 5 };
    case "modal0":
      return { idx: 0 };
  }
};

export default profileModalReducer;
