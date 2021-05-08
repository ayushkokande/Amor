import Profile from "./Profile.jsx";
import List from "./list";
import { v4 } from "uuid";

export default function (props) {
  return (
    <section className="matchSection">
      <div key={v4()}>
        <Profile
          pref={props.pref}
          setPref={props.setPref}
          setGroup={props.setGroup}
          group={props.group}
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
