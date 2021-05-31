import { useState, useEffect, useRef } from "react";
import "./chatStyles.css";
import { Link } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import { db } from "../landingComp/firebase";
import { useSelector } from "react-redux";
import { v4 } from "uuid";

export default function Chat() {
  const socket = io("http://amor007.herokuapp.com");
  // const [id, setID] = useLocalStorage("id");
  let uid = useSelector((state) => state.user.id);
  let profile = useSelector((state) => state.user.data);
  // const [other_uid, setOtherUid] = useState(null);
  const [inputText, setInput] = useState("");
  const [msg, setMsg] = useState([]);
  const [matchId, setMatchId] = useState();

  function showMessages() {
    let i = msg.length < 50 ? msg.length : 50;
    let el = [];
    for (i = i - 1; i >= 0; i--) el.push(getMessage(msg[i], i));
    return el;
  }

  function getMessage(item, i) {
    if (!item.senderUid) return null;
    let CLS;
    if (uid === item.senderUid) CLS = "ogUser";
    else CLS = "otherUser";
    return (
      <div className={`msgContainer ${CLS}`} style={{ width: "auto" }}>
        <div key={v4()} ref={i === 0 ? messagesRef : null} className={`msg`}>
          {item.message}
        </div>

        <div className="text-muted">
          {uid === item.senderUid ? "You | " : "Them | "}
          {new Date(item.timestamp)
            .toLocaleString("en-GB")
            .split(" ")[1]
            .slice(0, -3)}
        </div>
      </div>
    );
  }

  socket.on("svMessage", (message) => {
    // let CLS;
    // if (uid === message.senderUid) CLS = "ogUser";
    // else CLS = "otherUser";
    // console.log("newMsg", message.array);
    setMsg(message.array);
  });

  function sendMessage(roomId) {
    socket.emit("send_message", {
      roomId: roomId,
      message: inputText,
      timestamp: Date.now(),
      senderUid: uid,
      array: msg,
      matchId: matchId,
      // id: id,
    });
    console.log(msg);
  }

  const [matches, setMatches] = useState(null);
  let matchArray = [];
  const [dummy, setDummy] = useState(false);

  const sMatches = async (item) => {
    try {
      console.log(item.uid);
      const mRef = db.collection("profiles").doc(item.uid);
      let mResponse = await mRef.get();
      console.log(mResponse.id);
      matchArray.push({
        ...mResponse.data(),
        id: item.uid,
        roomId: item.roomId,
        matchId: mResponse.id,
      });
      setDummy(true);
      return { ...mResponse.data(), uid: item.uid };
      // setArr([...matchArray, { ...mResponse.data(), id: item.uid }]);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async () => {
    const REFER = db.collection("profiles").doc(uid).collection("matches");
    const response = await REFER.get();
    let matchIDs = [];
    response.forEach((doc) => {
      matchIDs.push(doc.data());
    });
    console.log("A", matchIDs);
    let local_arr = [];
    matchIDs.forEach((item) =>
      local_arr.push(
        (async () => {
          return await sMatches(item);
        })()
      )
    );
    let results = await Promise.all([local_arr]);

    console.log(local_arr);
    console.log(Promise.resolve(results));
    return results;
    // setMatches(results);
    // console.log(matchArray);
    // setMatches(matchArray);
    // return matchArray;
  };

  const clickChat = async (roomId, gmatchId) => {
    setConvLoaded(false);
    setMatchId(gmatchId);
    axios.get(`http://localhost:5000/rooms/${roomId}`).then((res) => {
      console.log(...res.data.messages);
      setMsg(res.data.messages);
      // setMsg(res)
    });
  };

  useEffect(async () => {
    let data = await fetchData();
    console.log(matchArray);
    setMatches(matchArray);
    console.log(data);
  }, []);

  useEffect(() => {
    if (matches) console.log(matches[0]);
    console.log(matchArray);
  }, [matches]);

  // useEffect(() => {
  //   console.log(msg);
  // }, [inputText]);

  useEffect(() => {
    console.log("NoNo", msg);
    if (msg) {
      setConvLoaded(true);
      if (messagesRef.current !== undefined && convLoaded === true)
        messagesRef.current.scrollIntoView({ smooth: true });
    }
  }, [msg]);

  const [convClick, setConv] = useState(null);
  const [convLoaded, setConvLoaded] = useState(false);
  const textRef = useRef();
  const messagesRef = useRef();

  useEffect(() => {
    if (messagesRef.current !== undefined && convLoaded === true)
      messagesRef.current.scrollIntoView({ smooth: true });
  }, [convLoaded]);

  // Make a call to server to get the conversations

  function enlistConv(item, idx) {
    // console.log(item, idx);
    return matches ? (
      <>
        <div
          className="conv"
          id={item.roomId}
          key={item.roomId}
          onClick={() => {
            // createRoom(uid, item.id);
            socket.emit("joinRoom", item.roomId);
            // setOtherUid(item.id);
            clickChat(item.roomId, item.matchId);
            setConv(idx);
          }}
        >
          <img src={item ? item.images[0] : ``} alt="Profile" />
          <div>
            <div>
              {item.f_name} {item.l_name}
            </div>
            <div>{`item.messages[0].text`}</div>
            <div>21:30</div>
          </div>
        </div>
      </>
    ) : null;
  }

  return matches ? (
    convClick === null ? (
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
                      <i className="fas fa-arrow-left"></i> Match section
                    </Link>
                  </div>
                </div>
                <div className="yourChatProfile">
                  <Link to="/profile" className="chat_profile">
                    <img src={profile.images[0]} alt="Profile" />
                  </Link>
                  <div>
                    <h4>
                      {profile.f_name} {profile.l_name}
                    </h4>
                    <div className="profDets">
                      <p>{profile.age}</p>
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
    ) : convLoaded ? (
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
                      <i className="fas fa-arrow-left"></i> Match section
                    </Link>
                  </div>
                </div>
                <div className="yourChatProfile">
                  <Link to="/profile" className="chat_profile">
                    <img src={profile.images[0]} alt="Profile" />
                  </Link>
                  <div>
                    <h4>
                      {profile.f_name} {profile.l_name}
                    </h4>
                    <div className="profDets">
                      <p>{profile.age}</p>
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
                  <img src={matches[convClick].images[0]} alt="Profile" />
                  <div>
                    <h3>
                      {matches[convClick].f_name} {matches[convClick].l_name}
                    </h3>
                    <p>{matches[convClick].age}</p>
                    <p>Delhi</p>
                  </div>
                </div>
                <div id="messages">{showMessages()}</div>
                <div className="messageBox">
                  <textarea
                    id="input"
                    onInput={(e) => setInput(e.target.value)}
                    ref={textRef}
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setInput("");
                      console.log(textRef.current.value);
                      textRef.current.value = "";
                      textRef.current.focus();
                      sendMessage(matches[convClick].roomId);
                    }}
                  >
                    <i className="zmdi zmdi-mail-send"></i>
                  </button>
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
                    <Link to="/match">
                      <i className="fas fa-arrow-left"></i> Match section
                    </Link>
                  </div>
                </div>
                <div className="yourChatProfile">
                  <Link to="/profile" className="chat_profile">
                    <img src={profile.images[0]} alt="Profile" />
                  </Link>
                  <div>
                    <h4>
                      {profile.f_name} {profile.l_name}
                    </h4>
                    <div className="profDets">
                      <p>{profile.age}</p>
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
                  <h3>Loading</h3>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    )
  ) : null;
}
