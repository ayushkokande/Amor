import "./matchStyles.css";
import MatchSec from "../components/matchComp/matchSection";
import Navbar from "../components/matchComp/navbar";
import ProfileModal from "../components/matchComp/profileModal";
import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import store from "../store/store";

export default function MatchPage() {
  let uid = useSelector((state) => state.user.id);
  const [idx, setIdx] = useState(0);
  const [group, setGroup] = useState(null);
  const [profile, setProfile] = useState(null);
  const [pref, setPref] = useState([]);
  const [og, setOg] = useState(null);

  useEffect(() => {
    console.log("sadasd");
    axios.post("http://localhost:4000/giveID", { id: uid }).then(() => {
      axios.get("http://localhost:4000/getGroup").then((res) => {
        console.log("DSSSS", res.data.sex);
        store.dispatch({ type: "groupMatch", group: res.data.done });

        if (res.data.sex === "Male") {
          setProfile(res.data.done.Female[0]);
          let arr = [];
          for (let i = 0; i < 6; i++)
            arr.push({ ...res.data.done.Female[i], idx: i });
          console.log(arr);
          setGroup(arr);
          for (let i = 0; i < 6; i++)
            if (res.data.done.Male[i].uid === uid) {
              setOg({ idx: i, sex: res.data.sex });
              break;
            }
        } else {
          setProfile(res.data.done.Male[0]);
          let arr = [];
          for (let i = 0; i < 6; i++)
            arr.push({ ...res.data.done.Male[i], idx: i });
          console.log(arr);
          setGroup(arr);
          for (let i = 0; i < 6; i++)
            if (res.data.done.Female[i].uid === uid) {
              setOg({ idx: i, sex: res.data.sex });
              break;
            }
        }
      });
    });
  }, []);

  useEffect(() => {
    if (group !== null) setProfile(group[idx]);
  }, [idx]);

  useEffect(() => {
    console.log(group);
    if (group !== null && group[idx] !== undefined) setProfile(group[idx]);
    else if (group !== null) {
      setProfile(group[idx - 1]);
      setIdx(idx - 1);
    }
  }, [group]);

  return group !== null ? (
    group.length > 0 ? (
      <div
        className="MatchContainer"
        style={{ backgroundImage: `url(/images/halftone.png)` }}
      >
        <ProfileModal profile={profile} user={group[idx]} />
        <Navbar />
        <h3 className="matchHeading">Mark your preferences!</h3>
        <MatchSec
          profile={profile}
          setProfile={setProfile}
          idx={idx}
          setIdx={setIdx}
          group={group}
          setGroup={setGroup}
          pref={pref}
          setPref={setPref}
        />
      </div>
    ) : (
      <div
        className="MatchContainer"
        style={{ backgroundImage: `url(/images/halftone.png)` }}
      >
        <Navbar />
        <h3 className="matchHeading">Mark your preferences!</h3>
        <MatchSec
          profile={profile}
          setProfile={setProfile}
          idx={idx}
          setIdx={setIdx}
          group={group}
          setGroup={setGroup}
          pref={pref}
          setPref={setPref}
          og={og}
        />
      </div>
    )
  ) : null;
}
