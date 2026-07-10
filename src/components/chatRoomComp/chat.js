import { useState, useEffect, useRef } from "react";
import "./chatStyles.css";
import io from "socket.io-client";
import { db } from "../landingComp/firebase";
import { useSelector } from "react-redux";
import { v4 } from "uuid";
import { useHistory } from "react-router";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import Loading from "../../spinLoad";
import { SOCKET_URL } from "../../api/client";
import { fetchRoomMessages } from "../../api/groups";
import {
  USE_MOCK_DATA,
  getMockMatches,
  getMockMessages,
} from "../../data/mockDogs";

export default function Chat() {
  const socket = USE_MOCK_DATA ? null : io(SOCKET_URL);
  const history = useHistory();
  let uid = useSelector((state) => state.user.id);
  let profile = useSelector((state) => state.user.data);
  const [inputText, setInput] = useState("");
  const [msg, setMsg] = useState([]);
  const [matchId, setMatchId] = useState();
  const [matches, setMatches] = useState(null);
  const [convClick, setConv] = useState(null);
  const [convLoaded, setConvLoaded] = useState(false);
  const textRef = useRef();
  const messagesRef = useRef();

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

  useEffect(() => {
    if (!socket) return undefined;
    const onMessage = (message) => setMsg(message.array);
    socket.on("svMessage", onMessage);
    return () => socket.off("svMessage", onMessage);
  }, [socket]);

  function sendMessage(roomId) {
    if (!inputText.trim()) return;

    if (USE_MOCK_DATA) {
      const next = [
        ...msg,
        {
          message: inputText,
          timestamp: Date.now(),
          senderUid: uid || "mock-self",
          roomId,
        },
      ];
      setMsg(next);
      return;
    }

    socket.emit("send_message", {
      roomId: roomId,
      message: inputText,
      timestamp: Date.now(),
      senderUid: uid,
      array: msg,
      matchId: matchId,
    });
  }

  const fetchData = async () => {
    const REFER = db.collection("profiles").doc(uid).collection("matches");
    const response = await REFER.get();
    const matchIDs = [];
    response.forEach((doc) => matchIDs.push(doc.data()));

    const results = await Promise.all(
      matchIDs.map(async (item) => {
        const mResponse = await db.collection("profiles").doc(item.uid).get();
        return {
          ...mResponse.data(),
          id: item.uid,
          roomId: item.roomId,
          matchId: mResponse.id,
          lastMessage: "Say hello!",
          lastMessageAt: "",
        };
      })
    );
    return results;
  };

  const clickChat = async (roomId, gmatchId, otherUid) => {
    setConvLoaded(false);
    setMatchId(gmatchId);

    if (USE_MOCK_DATA) {
      setMsg(
        getMockMessages(roomId, uid || "mock-self", otherUid || "mock-other")
      );
      setConvLoaded(true);
      return;
    }

    fetchRoomMessages(roomId).then((res) => {
      setMsg(res.data.messages);
    });
  };

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (USE_MOCK_DATA) {
        const viewerSex = profile?.sex || "Male";
        if (!cancelled) setMatches(getMockMatches(viewerSex));
        return;
      }

      try {
        const data = await fetchData();
        if (!cancelled) setMatches(data);
      } catch (err) {
        console.error(err);
        if (!cancelled) setMatches(getMockMatches(profile?.sex || "Male"));
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [uid, profile]);

  useEffect(() => {
    if (msg) {
      setConvLoaded(true);
      if (messagesRef.current !== undefined && convLoaded === true)
        messagesRef.current.scrollIntoView({ smooth: true });
    }
  }, [msg]);

  useEffect(() => {
    if (messagesRef.current !== undefined && convLoaded === true)
      messagesRef.current.scrollIntoView({ smooth: true });
  }, [convLoaded]);

  function enlistConv(item, idx) {
    return matches ? (
      <div
        className="conv"
        id={item.roomId}
        key={item.roomId}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          if (socket) socket.emit("joinRoom", item.roomId);
          if (e.target.className === "conv") e.target.className = "conv clicked";
          clickChat(item.roomId, item.matchId, item.uid || item.id);
          setConv(idx);
        }}
      >
        <img src={item ? item.images[0] : ``} alt="Profile" />
        <div>
          <div>
            {item.f_name} {item.l_name}
          </div>
          <div>{item.lastMessage || "Start the conversation"}</div>
          <div>{item.lastMessageAt || ""}</div>
        </div>
      </div>
    ) : null;
  }

  return matches ? (
    convClick === null ? (
      <section className="chatContainer">
        <div className="container" id="chat">
          <div className="row">
            <div className="col-sm-3 leftComp">
              <div className="chatHeading">
                <div>Chat</div>
                <div>
                  <button onClick={() => history.goBack()}>
                    <ArrowBackIcon />
                  </button>
                </div>
              </div>
              <div className="matches">{matches.map(enlistConv)}</div>
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
    ) : convLoaded ? (
      <section className="chatContainer">
        <div className="container" id="chat">
          <div className="row">
            <div className="col-sm-3 leftComp">
              <div className="chatHeading">
                <div>Chat</div>
                <div>
                  <button onClick={() => history.goBack()}>
                    <ArrowBackIcon />
                  </button>
                </div>
              </div>
              <div className="matches">{matches.map(enlistConv)}</div>
            </div>
            <div className="col-sm-9 rightComp">
              <div className="matchProf">
                <img src={matches[convClick].images[0]} alt="Profile" />
                <div>
                  <p>
                    {matches[convClick].f_name} {matches[convClick].l_name}
                  </p>
                </div>
              </div>
              <div className="chatArea">
                <div className="chatBody">
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
          </div>
        </div>
      </section>
    ) : (
      <section className="chatContainer">
        <div className="container" id="chat">
          <div className="row">
            <div className="col-sm-3 leftComp">
              <div className="chatHeading">
                <div>Chat</div>
                <div>
                  <button onClick={() => history.goBack()}>
                    <ArrowBackIcon />
                  </button>
                </div>
              </div>
              <div className="matches">{matches.map(enlistConv)}</div>
            </div>
            <div className="col-sm-9 rightComp">
              <div className="chatWSomeone">
                <Loading />
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  ) : null;
}
