import { useSelector } from "react-redux";
import store from "../../store/store";
import { useState } from "react";
import { db } from "../landingComp/firebase";
import axios from "axios";
import { v4 } from "uuid";

export default function (props) {
  // let profileList = useSelector((state) => state.match.matchList);
  let arr = [1, 2, 3, 4, 5, 6];

  console.log(props.og);
  const [profile, setProfile] = useState(props.group[0]);
  // const [pref, setPref] = useState([]);
  let idx = 0;

  let GR = useSelector((state) => state.group.group);
  let uid = useSelector((state) => state.user.id);
  // const [n, setN] = useState(props.group.length);
  function upArr() {
    if (idx != 0)
      return (
        <i
          onClick={() => {
            idx = idx - 1;
            setProfile(props.group[idx]);
          }}
          className="upArr fas fa-angle-up"
        ></i>
      );
  }

  function downArr() {
    if (idx != props.group.length - 1)
      return (
        <i
          onClick={() => {
            idx = idx + 1;
            setProfile(props.group[idx]);
          }}
          className="downArr fas fa-angle-down"
        ></i>
      );
  }

  function yesSubmit(arr) {
    let i = 0;
    let newArr = [];
    for (i = 0; i < arr.length; i++) if (i !== idx) newArr.push(arr[i]);
    return newArr;
  }

  function action(val) {
    return { type: val };
  }

  function clickHandler(index) {
    let numb = index;
    props.setPref([...props.pref, { obj: { idx: profile.idx, pref: numb } }]);
    // setN(n - 1);
    store.dispatch({ type: `p${index + 1}`, img: profile.images[0] });
    idx = idx !== 0 ? idx - 1 : idx;
    setProfile(props.group[idx]);
    props.setGroup(yesSubmit(props.group));

    // props.setProfile(props.group[props.idx]);
    // if (index === 0) props.setGroup([...props.group.slice(1, 6)]);
    // else if (index === 5) props.setGroup([...props.group.slice(0, 5)]);
    // else
    //   props.setGroup([
    //     ...props.group.slice(0, index),
    //     ...props.group.slice(index + 1, 6),
    //   ]);
  }

  function buttons(item, index) {
    return (
      <button
        key={v4()}
        className="profileBtn"
        onClick={() => clickHandler(index)}
      >
        {item}
      </button>
    );
  }

  function modalOpen() {
    return { type: "opened" };
  }

  function modalView() {
    store.dispatch(modalOpen());
  }

  const onSubmit = async () => {
    let arr = ["", "", "", "", "", ""];
    props.pref.map((item) => {
      arr[item.obj.idx] = item.obj.pref.toString();
    });

    let str = arr[0];
    for (let i = 1; i < 6; i++) str = str.concat(arr[i]);

    props.setGroup(null);
    store.dispatch({ type: "pDone" });
    store.dispatch({ type: "groupDone" });

    let REF = db.collection("profiles").doc(uid);
    let response = await REF.get();
    let groupData = response.data().groups;
    // let res_group;
    // let IX;
    // for (let i = 0; i < groupData.length; i++) {
    //   if (GR.id === groupData[i].id) {
    //     res_group = groupData[i];
    //     IX = i;
    //     break;
    //   }
    // }

    let res_group = await db.collection("groups").doc(GR.id).get();
    res_group = res_group.data();

    let temp_pref;
    if (props.og.sex === "Male") {
      temp_pref = res_group.m_pref;
      temp_pref[props.og.idx] = str;
      res_group.m_pref = temp_pref;
    } else {
      temp_pref = res_group.f_pref;
      console.log(res_group.f_pref);
      temp_pref[props.og.idx] = str;
      res_group.f_pref = temp_pref;
    }

    res_group.cnt = res_group.cnt + 1;
    // groupData[IX] = res_group;

    // make call if cnt === 12;
    await REF.update({ marked: true });
    console.log(res_group);

    if (res_group.cnt === 12) {
      await db.collection("groups").doc(res_group.id).delete();
      props.setGroup([]);
      props.setGetData(Math.random() * 99);
      axios
        .post("/api/algo", { group: res_group })
        .then((res) => console.log(res.data));
    } else {
      props.setGroup([]);
      props.setGetData(Math.random() * 99);
      await db.collection("groups").doc(res_group.id).set(res_group);
    }
  };

  console.log(props.group.length);

  return props.group.length !== 0 && profile !== undefined ? (
    <div className="profile">
      <div className="profileImg">
        {upArr()}
        <img
          onClick={modalView}
          src={profile ? profile.images[0] : ``}
          alt="Profile"
        />
        {/* <img
          src="https://photogenicsmedia.com/wp-content/uploads/2020/08/ALISSAIRIS.jpg"
          alt=""
        /> */}

        <div className="profileDesc">
          <h3>
            {profile ? profile.f_name : ``}, {profile ? profile.age : ``}
          </h3>
        </div>
        {downArr()}
      </div>

      <div className="profileBtnList">{arr.map(buttons)}</div>
      <p>Choose your preference!</p>
      <p>1 being the highest, 6 being the lowest.</p>
    </div>
  ) : GR.length !== 0 ? (
    <div className="profile">
      <div className="profileImg">
        {upArr()}
        {/* <img src={profile.images[0]} alt="Profile" /> */}
        <img
          style={{ opacity: 0 }}
          src="https://photogenicsmedia.com/wp-content/uploads/2020/08/ALISSAIRIS.jpg"
          alt=""
        />
        <div className="conBtn">
          <p>Do you wish to submit?</p>
          <div
            style={{ marginRight: "9px" }}
            className="btn btn-primary"
            onClick={onSubmit}
          >
            Yes
          </div>
          <div
            className="btn btn-primary"
            onClick={() => {
              console.log(props.pref);
            }}
          >
            No
          </div>
        </div>
        <div className="profileDesc">
          <h3>{/* {props.profile.name}, {props.profile.age} */}SS</h3>
        </div>
        {downArr()}
      </div>

      <div className="profileBtnList">{arr.map(buttons)}</div>
      <p>Choose your preference!</p>
      <p>1 being the highest, 6 being the lowest.</p>
    </div>
  ) : (
    <div className="profile">
      <div className="profileImg">
        {upArr()}
        {/* <img src={props.profile.images[0]} alt="Profile" /> */}
        <img
          style={{ opacity: 0 }}
          src="https://photogenicsmedia.com/wp-content/uploads/2020/08/ALISSAIRIS.jpg"
          alt=""
        />
        <div className="conBtn">
          <p>Sorry! You do not have any groups right now.</p>
        </div>
        <div className="profileDesc">
          <h3>{/* {props.profile.name}, {props.profile.age} */}SS</h3>
        </div>
        {downArr()}
      </div>

      <div className="profileBtnList">{arr.map(buttons)}</div>
      <p>Choose your preference!</p>
      <p>1 being the highest, 6 being the lowest.</p>
    </div>
  );
}
