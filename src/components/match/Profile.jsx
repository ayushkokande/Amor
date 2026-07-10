import { useSelector } from "react-redux";
import store from "../../store/store";
import { useState } from "react";
import { db } from "../../lib/firebase";
import { v4 } from "uuid";
import {
  PLACEHOLDER_DOG,
  USE_MOCK_DATA,
  submitMockPreference,
} from "../../data/mockDogs";
import {
  GROUP_SIZE,
  TOTAL_GROUP,
  createRankOptions,
} from "../../matching/config";
import { picksToRankedIndices } from "../../matching/preferences";
import { runMatching } from "../../api/groups";

import Loading from "../common/SpinLoad";

export default function (props) {
  const poolSize = props.group?.length ?? GROUP_SIZE;
  const rankOptions = createRankOptions(poolSize);

  const fullGroup = useSelector((state) => state.group.group);
  const uid = useSelector((state) => state.user.id);
  const [n, setN] = useState(props.group ? props.group.length : 0);

  function upArr() {
    if (props.idx != 0)
      return (
        <i
          onClick={() => {
            props.setIdx(props.idx - 1);
          }}
          className="upArr fas fa-angle-up"
        ></i>
      );
  }

  function downArr() {
    if (props.idx != n - 1)
      return (
        <i
          onClick={() => {
            props.setIdx(props.idx + 1);
          }}
          className="downArr fas fa-angle-down"
        ></i>
      );
  }

  function yesSubmit(arr) {
    const newArr = [];
    for (let i = 0; i < arr.length; i++) {
      if (i !== props.idx) newArr.push(arr[i]);
    }
    return newArr;
  }

  function clickHandler(index) {
    props.setPref([
      ...props.pref,
      { obj: { idx: props.profile.idx, pref: index } },
    ]);
    setN(n - 1);
    props.setGroup(yesSubmit(props.group));
    store.dispatch({
      type: "SET_PREF_SLOT",
      index,
      img: props.profile.images[0],
    });
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

  function modalView() {
    store.dispatch({ type: "opened" });
  }

  const onSubmit = async () => {
    const rankedIndices = picksToRankedIndices(props.pref, poolSize);

    props.setGroup(null);
    store.dispatch({ type: "pDone" });
    store.dispatch({ type: "groupDone" });

    if (USE_MOCK_DATA) {
      const matchProfile = submitMockPreference(
        props.og.sex,
        props.og.idx,
        rankedIndices
      );
      props.setGroup([]);
      props.onMatchComplete?.(matchProfile);
      return;
    }

    const REF = db.collection("profiles").doc(uid);
    const response = await REF.get();
    const groupData = response.data().groups;

    let res_group = await db.collection("groups").doc(fullGroup.id).get();
    res_group = res_group.data();

    if (props.og.sex === "Male") {
      res_group.m_pref[props.og.idx] = rankedIndices;
    } else {
      res_group.f_pref[props.og.idx] = rankedIndices;
    }

    res_group.cnt = (res_group.cnt || 0) + 1;

    for (let i = 0; i < groupData.length; i++) {
      if (groupData[i].id === fullGroup.id) groupData[i].marked = true;
    }
    await REF.update({ groups: groupData });
    await db.collection("groups").doc(res_group.id).set(res_group);

    if (res_group.cnt === TOTAL_GROUP) {
      await runMatching(res_group, uid);
      props.setGroup([]);
      props.onMatchComplete?.(null);
      props.setGetData(Math.random() * 99);
    } else {
      props.setGroup(null);
      props.onMatchComplete?.(null);
      props.setGetData(Math.random() * 99);
    }
  };

  const rankHint = `1 being the highest, ${poolSize} being the lowest.`;

  return props.group === null ? (
    <div className="profile">
      <div className="profileImg">
        <Loading />
      </div>
      <div className="profileBtnList">{rankOptions.map(buttons)}</div>
      <p>Choose your preference!</p>
      <p>{rankHint}</p>
    </div>
  ) : n !== 0 ? (
    <div className="profile">
      <div className="profileImg">
        {upArr()}
        <img
          onClick={modalView}
          src={props.profile ? props.profile.images[0] : ``}
          alt="Profile"
        />

        <div className="profileDesc">
          <h3>
            {props.profile ? props.profile.f_name : ``},{" "}
            {props.profile ? props.profile.age : ``}
          </h3>
        </div>
        {downArr()}
      </div>

      <div className="profileBtnList">{rankOptions.map(buttons)}</div>
      <p>Choose your preference!</p>
      <p>{rankHint}</p>
    </div>
  ) : props.pref.length === poolSize ? (
    <div className="profile">
      <div className="profileImg">
        <img style={{ opacity: 0 }} src={PLACEHOLDER_DOG} alt="" />
        <div className="conBtn">
          <p>Do you wish to submit?</p>
          <div
            style={{ marginRight: "9px" }}
            className="btn btn-primary"
            onClick={onSubmit}
          >
            Yes
          </div>
          <div className="btn btn-primary">No</div>
        </div>
      </div>

      <div className="profileBtnList">{rankOptions.map(buttons)}</div>
      <p>Choose your preference!</p>
      <p>{rankHint}</p>
    </div>
  ) : (
    <div className="profile">
      <div className="profileImg">
        <img style={{ opacity: 0 }} src={PLACEHOLDER_DOG} alt="" />
        <div className="conBtn">
          <p>Sorry! You do not have any groups right now.</p>
        </div>
      </div>

      <div className="profileBtnList">{rankOptions.map(buttons)}</div>
      <p>Choose your preference!</p>
      <p>{rankHint}</p>
    </div>
  );
}
