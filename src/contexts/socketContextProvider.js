import React, { useEffect, useState, useContext } from "react";
import io from "socket.io-client";

const SocketContext = React.createContext(null);

export function useSocket() {
    console.log(useContext(SocketContext));
    console.log(SocketContext);
    return SocketContext;
}

export function SocketContextProvider({id, children}) {
    const [socket,setSocket] = useState();

    useEffect(() => {
        const newSocket = io(
          'http://localhost:4000',
          { query: { id } }
        )
        newSocket.emit("hi","bitch");
        setSocket(newSocket);
        console.log(newSocket);
        // console.log(socket);
    
        return () => newSocket.close()
      },[id]);
    
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}