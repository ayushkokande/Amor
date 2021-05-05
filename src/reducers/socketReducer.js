import io from "socket.io-client";

const socketReducer = (state = null, action) => {
  // const newSocket = io(
  //     'http://localhost:4000'
  //   )
  //   newSocket.emit("hi","bitch");

  switch (action.type) {
    default:
      // return newSocket;
      return state;
  }
};

export default socketReducer;
