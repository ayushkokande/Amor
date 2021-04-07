export default function () {
    return (
      <>
        <h2 className="form-title">Details</h2>
        <div className="form-group">
          <input
            type="email"
            className="inpText"
            placeholder="First Name"
          ></input>
        </div>
        <div className="form-group">
          <input type="email" className="inpText" placeholder="Last Name"></input>
        </div>
        <div className="form-group">
          <input type="email" className="inpText" placeholder="Age"></input>
        </div>
        <div className="form-group">
          <input type="email" className="inpText" placeholder="Sex"></input>
        </div>
        <button type="submit">Submit</button>
      </>
    );
  }
  