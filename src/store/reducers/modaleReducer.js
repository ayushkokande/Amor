const modaleReducer = (state = { cl: "" }, action) => {
    switch (action.type) {
      case "opened":
        return { cl: " opened" };
  
      case "closed":
        return { cl: "" };
  
      default:
        return state;
    }
  };
  
  export default modaleReducer;
  