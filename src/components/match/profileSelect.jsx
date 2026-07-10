import { v4 } from "uuid";

export default function (props) {
  return (
    <div key={v4()} className="profileSelect">
      <img src={props.img} alt="profile" />
    </div>
  );
}
