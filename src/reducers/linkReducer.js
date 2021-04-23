const linkReducer = (state = { link: "", img: "" }, action) => {
    switch (action.type) {
      default:
        return state;
  
      case "about":
        return { link: "about", img: "blue_rice.png" };
  
      case "home":
        return { link: "", img: "pink_rice.png" };
    
      case "login":
        return { link: "login", img: "royal_rice.png" };

      case "signUp":
        return { link: "signUp", img: "noisy.png" };
    }
  };
  
  export default linkReducer;
  