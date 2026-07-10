import ListTemplate from "./ListTemplate";
import ProfileSelect from "./ProfileSelect";
import { useSelector } from "react-redux";

export default function () {
  let arr = useSelector((state) => state.match.pImg);

  function listCard(item, index) {
    if (item === "") return <ListTemplate number={index + 1} />;
    else return <ProfileSelect img={arr[index]} />;
  }

  return <div className="matchList">{arr.map(listCard)}</div>;
}
