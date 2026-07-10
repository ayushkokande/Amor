import { useState } from "react";
import { useSelector } from "react-redux";
import RightArr from "./ViewRightArr";
import store from "../../store/store";

export default function (props) {
  const [idx, setIdx] = useState(0);
  const [cardFront, setCardFront] = useState("Card card-front");
  const [cardBack, setCardBack] = useState("Card card-back");

  let user = useSelector((state) => state.user.data);
  let CL = "modale" + useSelector((state) => state.modal.cl);
  let n = user && user.images ? user.images.length : 0;

  function upArr() {
    if (idx != 0)
      return (
        <i
          onClick={() => {
            setIdx(idx - 1);
          }}
          className="upArr fas fa-angle-up"
        ></i>
      );
  }

  function downArr() {
    if (idx != n - 1)
      return (
        <i
          onClick={() => {
            setIdx(idx + 1);
          }}
          className="downArr fas fa-angle-down"
        ></i>
      );
  }

  function modalImg() {
    return (
      <div className="swipeImage">
        <img src={user?.images?.[idx] || null} alt="D" />
      </div>
    );
  }

  function action() {
    return { type: "closed" };
  }

  function close(e) {
    e.stopPropagation();
    store.dispatch(action());
  }

  let outerBody = document.querySelector(".modale");
  let innerBody = document.querySelector(".modalContent");
  if (outerBody != null && innerBody != null) {
    innerBody.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      return false;
    });

    outerBody.addEventListener("click", (e) => {
      store.dispatch(action());
    });
  }

  let Img = document.querySelector(".Card img");
  if (Img != null)
    Img.addEventListener("click", (e) => {
      // alert("D");
      e.preventDefault();
      e.stopPropagation();
      setCardFront(cardFront + " flip-front");
      setCardBack(cardBack + " flip-back");
      return false;
    });

  let Card_back = document.querySelector(".card-back");
  if (Card_back != null)
    Card_back.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      setCardBack("Card card-back");
      setCardFront("Card card-front");
      return false;
    });

  let uparr = document.querySelector(".upArr");
  if (uparr != null)
    uparr.addEventListener("click", (e) => {
      setIdx(idx - 1);
      return false;
    });

  let downarr = document.querySelector(".downArr");
  if (downarr != null)
    downarr.addEventListener("click", (e) => {
      setIdx(idx + 1);
      return false;
    });

  return (
    <div className={CL} aria-hidden="true">
      <div className="modalContent">
        <div className={cardFront}>
          {upArr()}
          {modalImg()}
          {downArr()}
        </div>
        <div
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setCardBack("Card card-back");
            setCardFront("Card card-front");
            // e.stopImmediatePropagation();
            return false;
          }}
          className={cardBack}
        >
          <div className="content">
            <p>Name: {user?.f_name ?? null}</p>
            <p>Age: {user?.age ?? null}</p>
            <p>Sex: {user?.sex ?? null}</p>
            <p>Bio: {user?.bio ?? null}</p>
          </div>
        </div>
        <RightArr
          cardBack={cardBack}
          cardFront={cardFront}
          setCardBack={setCardBack}
          setCardFront={setCardFront}
        />
      </div>
    </div>
  );
}
