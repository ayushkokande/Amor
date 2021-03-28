import { useSelector } from "react-redux";
import store from "../../store/store";
import ProfileModal from "./profileModal";
import { useState } from "react";

export default function (props) {
  const [cl, setCL] = useState("");

  let profileList = useSelector((state) => state.match.matchList);
  let arr = [1, 2, 3, 4, 5, 6];

  function action(val) {
    return { type: val };
  }

  function clickHandler(e) {
    store.dispatch(action(e.target.innerText));
  }

  function buttons(item, index) {
    return (
      <button className="profileBtn" onClick={clickHandler}>
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

  return (
    <div className="profile">
      <div onClick={modalView} className="profileImg">
        <img
          src="https://photogenicsmedia.com/wp-content/uploads/2020/08/ALISSAIRIS.jpg"
          alt=""
        />
        <div className="profileDesc">
          <h3>Iris, 23</h3>
        </div>
      </div>

      <div className="profileBtnList">{arr.map(buttons)}</div>
      <p>Choose your preference!</p>
      <p>1 being the highest, 6 being the lowest.</p>
    </div>
  );
}
