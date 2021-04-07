import store from "../../store/store";

export default function () {
  function clickHandler(e) {
    e.preventDefault();
    store.dispatch({ type: 1 });
  }

  return (
    <>
      <h2 className="form-title">Get Started</h2>
      <div className="form-group">
        <label for="email">
          <i className="zmdi zmdi-email"></i>
        </label>
        <input
          type="email"
          className="inpText"
          placeholder="Your email"
        ></input>
      </div>
      <div className="form-group em_pw">
        <i class="zmdi zmdi-lock-outline"></i>
        <input
          type="password"
          className=" text-muted inpText"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          placeholder="Password"
        ></input>
      </div>
      <div className="form-group em_pw">
        <i className="zmdi zmdi-lock"></i>
        <input
          type="password"
          className=" text-muted inpText"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          placeholder="Enter password again"
        ></input>
      </div>
      <div class="form-button">
        <button onClick={clickHandler}>
          Next <i style={{ margin: 0 }} class="zmdi zmdi-arrow-right"></i>
        </button>
      </div>
    </>
  );
}
