const profileReducer = (state = { profileList: [] }, action) => {
    switch (action.type) {
      default:
        let list = state.profileList;
        list.push("wow");
        list.push("now");
        return { profileList: list };
    }
  };
  
  export default profileReducer;
  