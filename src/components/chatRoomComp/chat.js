import { useState, useEffect } from "react";
import "./chatStyles.css";
import useLocalStorage from "../../hooks/useLocalStorage";
import {v4} from "uuid";
import { useSelector } from "react-redux";
import axios from "axios";

export default function() {
    const socket =  useSelector(state=>state.socket);
    const [id, setID] = useLocalStorage('id');

    const user1 = "c856d200-6b1a-45f9-bb4e-4120cf236a41";
    const user2 = "d5e7b728-a95b-48e1-863b-f22c9c470757";

    const [msg, setMsg] = useState([{
        class: "otherUser",
        message: "Everybody's got opinions on our thing Say we're flying down a path with no ending And if I die before I wake Ooh, don't let me wake up from this dream"
    },
    {
        class: "ogUser",
        message: "When we collide When we collide, it's a beautiful disaster When I crash into you, you, you Crash into you, you"
    }]);

    function createRoom(user1,user2) {
        if(user1.localeCompare(user2)<0)
            return (user1 + '@' + user2);
        return (user2 + '@' + user1);
    }
    
    const room = createRoom(user1,user2);
    socket.emit("joinRoom", room);

    useEffect(()=>{
        axios.get(`http://localhost:4000/rooms/${room}`)
        .then(res => {
            console.log(res.data);
            setMsg(res.data);
        })
    },[]);

    function showMessages() {
        let i = msg.length<50 ? msg.length : 50;
        let el = [];
        for(i=i-1;i>=0;i--)
            el.push(getMessage(msg[i]));
        return el;
    }

    function getMessage(item) {
        let CLS;
        if(item.u_id === id)
            CLS = "ogUser";
        else 
            CLS = "otherUser";
        return (
            <div className={`msg ${CLS}`} key={item.id}>
                {item.text}
            </div>
        )
    }

    function sendMessage(e) {
        e.preventDefault();
        socket.emit("send_message",{room: room, text: e.target.input.value, id: id});
    }

    socket.on("retrieve_message_from_sv", (message)=>{
        let CLS;
        if(id === message.u_id) 
            CLS = "ogUser";
        else 
            CLS = "otherUser";
        
            setMsg([message ,...msg]);
    })

    function createID() {
        setID(v4());
    }
    return (
        <>
            <h3>{id}</h3>
            <div>
                <button onClick={createID}>Create new ID</button>
            </div>
            <section className="chatContainer">
                <div className="banner"></div>
                <div id="messages">
                    {showMessages()}
                </div>
                <div className="messageBox">
                    <form id="form" action="" onSubmit={sendMessage}>
                    <input id="input" autoComplete="off" /><button>Send</button>
                    </form>
                </div>
            </section>
        </>
    )
}