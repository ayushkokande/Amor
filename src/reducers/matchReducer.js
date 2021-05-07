const matchReducer = (state = { pImg: ["", "", "", "", "", ""] }, action) => {
  let arr = [];
  switch (action.type) {
    case "p1":
      arr = [action.img, ...state.pImg.slice(1, 6)];
      console.log(arr);
      return { pImg: arr };

    case "p2":
      arr = [...state.pImg.slice(0, 1), action.img, ...state.pImg.slice(2, 6)];
      return { pImg: arr };

    case "p3":
      arr = [...state.pImg.slice(0, 2), action.img, ...state.pImg.slice(3, 6)];
      return { pImg: arr };

    case "p4":
      arr = [...state.pImg.slice(0, 3), action.img, ...state.pImg.slice(4, 6)];
      return { pImg: arr };

    case "p5":
      arr = [...state.pImg.slice(0, 4), action.img, ...state.pImg.slice(5, 6)];
      return { pImg: arr };

    case "p6":
      arr = [...state.pImg.slice(0, 5), action.img];
      return { pImg: arr };

    case "pDone":
      return { pImg: ["", "", "", "", "", ""] };

    default:
      return state;
  }
};

export default matchReducer;
