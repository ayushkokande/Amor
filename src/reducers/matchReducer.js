const matchReducer = (
  state = { matchList: [-1, -1, -1, -1, -1, -1] },
  action
) => {
  switch (action.type) {
    case "1":
      let arr = [0, ...state.matchList.slice(1, 6)];
      console.log(arr);
      return { matchList: arr };

    case "2":
      arr = [...state.matchList.slice(0, 1), 0, ...state.matchList.slice(2, 6)];
      return { matchList: arr };

    case "3":
      arr = [...state.matchList.slice(0, 2), 0, ...state.matchList.slice(3, 6)];
      return { matchList: arr };

    case "4":
      arr = [...state.matchList.slice(0, 3), 0, ...state.matchList.slice(4, 6)];
      return { matchList: arr };

    case "5":
      arr = [...state.matchList.slice(0, 4), 0, ...state.matchList.slice(5, 6)];
      return { matchList: arr };

    case "6":
      arr = [...state.matchList.slice(0, 5), 0];
      return { matchList: arr };

    default:
      return state;
  }
};

export default matchReducer;
