export default function (props) {

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
          name="email"
          onChange={props.change}
          value={props.data.email}
        ></input>
      </div>
      <div className="form-group em_pw">
        <i class="zmdi zmdi-lock-outline"></i>
        <input
          type="password"
          name="password"
          className=" text-muted inpText"
          id="exampleInputEmail1"
          aria-describedby="emailHelp"
          placeholder="Password"
          onChange={props.change}
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
          onChange={props.change}
        ></input>
      </div>
      <div class="form-button">
        <button onClick={props.next}>
          Next <i style={{ margin: 0 }} class="zmdi zmdi-arrow-right"></i>
        </button>
      </div>
    </>
  );
}
