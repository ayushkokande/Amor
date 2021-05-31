import "./matchStyles.css";
import MatchSec from "../components/matchComp/matchSection";
import Navbar from "../components/matchComp/navbar";
import ProfileModal from "../components/matchComp/profileModal";
import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import store from "../store/store";
import Loader from "./loader";

export default function MatchPage() {
  let uid = useSelector((state) => state.user.id);
  const [idx, setIdx] = useState(0);
  const [group, setGroup] = useState(null);
  const [profile, setProfile] = useState(null);
  const [pref, setPref] = useState([]);
  const [og, setOg] = useState(null);
  const [getdata, setGetData] = useState(1);

  useEffect(() => {
    axios.post("http://amor007.herokuapp.com/giveID", { id: uid }).then(() => {
      axios.get("http://amor007.herokuapp.com/getGroup").then((res) => {
        store.dispatch({ type: "groupMatch", group: res.data.done });
        console.log(res.data.done);
        if (res.data.done.length === 0) {
          setGroup([]);
        } else {
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
                console.log(i);
                break;
              }
          } else {
            setProfile(res.data.done.Male[0]);
            let arr = [];
            for (let i = 0; i < 6; i++)
              arr.push({ ...res.data.done.Male[i], idx: i });
            setGroup(arr);
            for (let i = 0; i < 6; i++)
              if (res.data.done.Female[i].uid === uid) {
                setOg({ idx: i, sex: res.data.sex });
                console.log(i);
                break;
              }
          }
        }
      });
    });
    // axios.post("http://localhost:4000/giveID", { id: uid }).then(() => {
    //   axios.get("http://localhost:4000/getGroup").then((res) => {
    //     console.log(res.data.message);
    //   });
    // });
  }, [getdata, uid]);

  // useEffect(() => {
  //   if (group !== null) setProfile(group[idx]);
  // }, [idx,group]);

  useEffect(() => {
    if (group !== null && group[idx] !== undefined) setProfile(group[idx]);
    else if (group !== null && idx != 0) {
      setProfile(group[idx - 1]);
      setIdx(idx - 1);
    }
    console.log("HHHH", idx, group);
  }, [group, idx]);

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
          setGetData={setGetData}
          og={og}
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
          setGetData={setGetData}
        />
      </div>
    )
  ) : (
    <Loader />
  );
}
