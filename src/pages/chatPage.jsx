import Chat from "../components/chatRoomComp/chat";
import useLocalStorage from "../hooks/useLocalStorage";

export default function () {
  const [id, setID] = useLocalStorage("id");
  console.log(id);
  return <Chat />;
}
