import Chat from "../components/chatRoomComp/chat";
import { SocketContextProvider } from "../contexts/socketContextProvider";
import useLocalStorage from "../hooks/useLocalStorage";

export default function() {
    const [id, setID] = useLocalStorage('id');
    console.log(id);
    return(
            <Chat />
    )
}