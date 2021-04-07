import { useSelector } from "react-redux";
import Page0 from "./page0";
import Page1 from "./page1";

export default function () {
  let idx = useSelector((state) => state.signUpIdx.idx);

  const arr = [Page0, Page1];

  return (
    <div className="formContainer">
      <div className="Container">
        <form method="POST" id="signUpForm">{arr[idx]()}</form>
      </div>
    </div>
  );
}
