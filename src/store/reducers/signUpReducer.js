const signUpReducer = (state = { idx: 0 }, action) => {
    switch (action.type) {
      default:
        return state;
  
      case 1:
        return { idx: 1 };
  
      case 2:
        return { idx: 2 };
    }
  };
  
  export default signUpReducer;
  