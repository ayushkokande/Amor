import Profile from "./Profile.jsx";
import List from "./list";
import { useState } from "react";

export default function (props) {
  return (
    <section className="matchSection">
      <div>
        <Profile
          profile={props.profile}
          idx={props.idx}
          setIdx={props.setIdx}
          setGroup={props.setGroup}
          group={props.group}
          setProfile={props.setProfile}
          pref={props.pref}
          setPref={props.setPref}
          og={props.og}
          setGetData={props.setGetData}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <List />
      </div>
    </section>
  );
}
