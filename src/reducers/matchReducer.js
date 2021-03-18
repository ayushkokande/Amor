const matchReducer = (state = { matchList: [-1, -1] }, action) => {
    switch (action.type) {
      case "0":
        return { matchList: [0, -1] };
  
      default:
        return state;
    }
  };
  
  export default matchReducer;
  