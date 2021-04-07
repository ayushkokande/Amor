export default function (props) {
  console.log(props.data);
  function click(e) {
    console.log(e);
  }
  return (
    <>
      <h2 className="form-title">Details</h2>
      <div className="form-group">
        <input
          type="text"
          name="f_name"
          className="inpText"
          placeholder="First Name"
          onChange={props.change}
          value={props.data.f_name}
        ></input>
      </div>
      <div className="form-group">
        <input
          type="text"
          name="l_name"
          className="inpText"
          placeholder="Last Name"
          onChange={props.change}
          value={props.data.l_name}
        ></input>
      </div>
      <div className="form-group">
        <input
          type="text"
          name="age"
          className="inpText"
          placeholder="Age"
          onChange={props.change}
          value={props.data.age}
        ></input>
      </div>
      <div className="form-group">
        <input
          type="text"
          name="sex"
          className="inpText"
          placeholder="Sex"
          onChange={props.change}
          value={props.data.sex}
        ></input>
      </div>
      <button onClick={props.prev}>Back</button>
      <button onClick={props.sub}>Submit</button>
    </>
  );
}
