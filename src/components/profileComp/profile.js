import "./profileStyles.css";
import ViewModal from "./viewModal";
import Navbar from "../matchComp/navbar";
import { auth } from "../landingComp/firebase";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";
import { db } from "../landingComp/firebase";
import store from "../../store/store";
import { USE_MOCK_DATA, maleDogs, femaleDogs } from "../../data/mockDogs";

export default function () {
  let uid = useSelector((state) => state.user.id);
  const userFromStore = useSelector((state) => state.user.data);
  const [profileData, setData] = useState(null);

  const fetchData = async () => {
    if (USE_MOCK_DATA) {
      const sex = userFromStore?.sex || "Male";
      const pool = sex === "Male" ? maleDogs : femaleDogs;
      setData(
        userFromStore?.images?.length
          ? userFromStore
          : { ...pool[0], ...userFromStore }
      );
      return;
    }

    let REFER = db.collection("profiles").doc(uid);
    const data = await REFER.get();
    setData(data.data());
  };

  useEffect(() => {
    fetchData();
  }, [uid, userFromStore]);

  const [redirect, setRedirect] = useState(false);

  function signOut() {
    auth
      .signOut()
      .then(() => {
        setRedirect(true);
      })
      .catch((error) => {
        alert(error);
      });
  }
  if (redirect) return <Redirect to="/" />;

  return profileData ? (
    <section
      className="profilePage"
      style={{ backgroundImage: `url(/images/pink_rice.png)` }}
    >
      <Navbar />
      <ViewModal data={profileData} />

      <div className="profCon container">
        <div className="profilePic">
          {profileData.images?.[0] ? (
            <img src={profileData.images[0]} alt="Profile" />
          ) : (
            <div className="profilePicPlaceholder">
              {(profileData.f_name || "?").charAt(0)}
            </div>
          )}
        </div>
        <div className="buttons">
          <div className="btn">
            <svg>
              <rect></rect>
            </svg>
            Edit Profile
          </div>

          <div
            className="btn"
            onClick={() => store.dispatch({ type: "opened" })}
          >
            <svg>
              <rect></rect>
            </svg>
            View Profile
          </div>
        </div>
        <div className="container profileData">
          <div className="field">
            <span>Name</span>
            <div className="data">
              {profileData.f_name} {profileData.l_name}
            </div>
          </div>
          <div className="field">
            <span>Age</span>
            <div className="data">{profileData.age}</div>
          </div>
          <div className="field">
            <span>Sex</span>
            <div className="data">{profileData.sex}</div>
          </div>
          <div className="field">
            <span>Bio</span>
            <div className="data">{profileData.bio}</div>
          </div>
        </div>
        <div className="btns" id="logoutBtn">
          <div className="logout btn" onClick={signOut}>
            Log Out
          </div>
        </div>
      </div>
    </section>
  ) : null;
}
