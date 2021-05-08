import Profile from "./Profile.jsx";
import List from "./list";
import { v4 } from "uuid";

export default function (props) {
  return (
    <section className="matchSection">
      <div key={v4()}>
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
      <div key={v4()} style={{ display: "flex", alignItems: "center" }}>
        <List />
      </div>
    </section>
  );
}
