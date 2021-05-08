import { useSelector } from "react-redux";
import { v4 } from "uuid";

export default function ({ number }) {
  const imgArr = useSelector((state) => state.match.pImg);
  return imgArr[number - 1] === "" ? (
    <div key={v4()} className="listTemp">
      <p key={v4()}>{number}</p>
    </div>
  ) : (
    <div key={v4()} className="listTemp">
      <img
        key={v4()}
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfvynI7tPysDIjInzILS9qTm1IG1mZWdUD5Q&usqp=CAU"
        alt="D"
      />
    </div>
  );
}
