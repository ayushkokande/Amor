import { useSelector } from "react-redux";

export default function ({ number }) {
  const imgArr = useSelector((state) => state.match.pImg);
  return imgArr[number - 1] === "" ? (
    <div className="listTemp">
      <p>{number}</p>
    </div>
  ) : (
    <div className="listTemp">
      <img
        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSfvynI7tPysDIjInzILS9qTm1IG1mZWdUD5Q&usqp=CAU"
        alt="D"
      />
    </div>
  );
}
