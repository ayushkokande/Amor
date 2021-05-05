import { useState, useEffect } from "react";
import "./chatStyles.css";
import useLocalStorage from "../../hooks/useLocalStorage";
import { v4 } from "uuid";
import { Link } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

const Conv = () => {};

export default function () {
  const socket = io("http://localhost:4000");
  const [id, setID] = useLocalStorage("id");

  const user1 = "c856d200-6b1a-45f9-bb4e-4120cf236a41";
  const user2 = "d5e7b728-a95b-48e1-863b-f22c9c470757";

  const [msg, setMsg] = useState([
    {
      class: "otherUser",
      message:
        "Everybody's got opinions on our thing Say we're flying down a path with no ending And if I die before I wake Ooh, don't let me wake up from this dream",
    },
    {
      class: "ogUser",
      message:
        "When we collide When we collide, it's a beautiful disaster When I crash into you, you, you Crash into you, you",
    },
  ]);

  function createRoom(user1, user2) {
    if (user1.localeCompare(user2) < 0) return user1 + "@" + user2;
    return user2 + "@" + user1;
  }

  const room = createRoom(user1, user2);
  socket.emit("joinRoom", room);

  useEffect(() => {
    axios.get(`http://localhost:4000/rooms/${room}`).then((res) => {
      console.log(res.data);
      setMsg(res.data);
    });
  }, []);

  function showMessages() {
    let i = msg.length < 50 ? msg.length : 50;
    let el = [];
    for (i = i - 1; i >= 0; i--) el.push(getMessage(msg[i]));
    return el;
  }

  function getMessage(item) {
    let CLS;
    if (item.u_id === id) CLS = "ogUser";
    else CLS = "otherUser";
    return (
      <div className={`msg ${CLS}`} key={item.id}>
        {item.text}
      </div>
    );
  }

  function sendMessage(e) {
    e.preventDefault();
    socket.emit("send_message", {
      room: room,
      text: e.target.input.value,
      id: id,
    });
  }

  socket.on("retrieve_message_from_sv", (message) => {
    let CLS;
    if (id === message.u_id) CLS = "ogUser";
    else CLS = "otherUser";

    setMsg([message, ...msg]);
  });

  function createID() {
    setID(v4());
  }

  let matches = [
    {
      img:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo0_5BYd7bOleC0BHCHb_yhnKTDy3JaULing&usqp=CAU",
      name: "Mural",
      messages: [{ text: "whatcha up to dawg??" }],
    },
    {
      img:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo0_5BYd7bOleC0BHCHb_yhnKTDy3JaULing&usqp=CAU",
      name: "Mural",
      messages: [{ text: "whatcha up to dawg??" }],
    },
    {
      img:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo0_5BYd7bOleC0BHCHb_yhnKTDy3JaULing&usqp=CAU",
      name: "Mural",
      messages: [{ text: "whatcha up to dawg??" }],
    },
    {
      img:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo0_5BYd7bOleC0BHCHb_yhnKTDy3JaULing&usqp=CAU",
      name: "Mural",
      messages: [{ text: "whatcha up to dawg??" }],
    },
    {
      img:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo0_5BYd7bOleC0BHCHb_yhnKTDy3JaULing&usqp=CAU",
      name: "Mural",
      messages: [{ text: "whatcha up to dawg??" }],
    },
    {
      img:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo0_5BYd7bOleC0BHCHb_yhnKTDy3JaULing&usqp=CAU",
      name: "Mural",
      messages: [{ text: "whatcha up to dawg??" }],
    },
    {
      img:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo0_5BYd7bOleC0BHCHb_yhnKTDy3JaULing&usqp=CAU",
      name: "Mural",
      messages: [{ text: "whatcha up to dawg??" }],
    },
    {
      img:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo0_5BYd7bOleC0BHCHb_yhnKTDy3JaULing&usqp=CAU",
      name: "Mural",
      messages: [{ text: "whatcha up to dawg??" }],
    },
    {
      img:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo0_5BYd7bOleC0BHCHb_yhnKTDy3JaULing&usqp=CAU",
      name: "Mural",
      messages: [{ text: "whatcha up to dawg??" }],
    },
  ];

  const [convClick, setConv] = useState(null);

  function enlistConv(item, idx) {
    return (
      <>
        <div className="conv" id={`convo${idx}`} onClick={() => setConv(idx)}>
          <img src={item.img} />
          <div>
            <div>{item.name}</div>
            <div>{item.messages[0].text}</div>
            <div>21:30</div>
          </div>
        </div>
      </>
    );
  }

  return convClick === null ? (
    <>
      {/* <h3>{id}</h3>
            <div>
                <button onClick={createID}>Create new ID</button>
            </div> */}
      <section className="chatContainer">
        <div className="container" id="chat">
          <div className="row">
            <div className="col-sm-3 leftComp">
              <div>
                <div className="backMatch">
                  <Link to="/match">
                    <i class="fas fa-arrow-left"></i> Match section
                  </Link>
                </div>
              </div>
              <div className="yourChatProfile">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtlZ-FbrdANEQyrPlJsiE178eELi01ZVugtQ&usqp=CAU" />
                <div>
                  <h4>Hilary</h4>
                  <div className="profDets">
                    <p>22</p>
                    <p>Location, World</p>
                  </div>
                </div>
              </div>
              <div className="matches">
                <div className="text-center">Your Matches</div>
                {matches.map(enlistConv)}
              </div>
            </div>
            <div className="col-sm-9 rightComp">
              <div className="chatWSomeone">
                <h3>It's lonely out here.</h3>
                <h5>Why not woo your matches?</h5>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  ) : (
    <>
      {/* <h3>{id}</h3>
        <div>
            <button onClick={createID}>Create new ID</button>
        </div> */}
      <section className="chatContainer">
        <div className="container" id="chat">
          <div className="row">
            <div className="col-sm-3 leftComp">
              <div>
                <div className="backMatch">
                  <i class="fas fa-arrow-left"></i> Match section
                </div>
              </div>
              <div className="yourChatProfile">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTtlZ-FbrdANEQyrPlJsiE178eELi01ZVugtQ&usqp=CAU" />
                <div>
                  <h4>Hillary</h4>
                  <div className="profDets">
                    <p>22</p>
                    <p>Location, World</p>
                  </div>
                </div>
              </div>
              <div className="matches">
                <div className="text-center">Your Matches</div>
                {matches.map(enlistConv)}
              </div>
            </div>
            <div className="col-sm-9 rightComp">
              <div className="matchProf">
                <img src={matches[convClick].img} />
                <div>
                  <h3>{matches[convClick].name}</h3>
                  <p>19</p>
                  <p>Delhi</p>
                </div>
              </div>
              <div id="messages">{showMessages()}</div>
              <div className="messageBox">
                <textarea id="input" />
                <button onSubmit>
                  <i class="zmdi zmdi-mail-send"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
