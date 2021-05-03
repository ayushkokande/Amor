import "./profileStyles.css";
import ViewModal from "./viewModal";
import store from "../../store/store";

export default function () {
  let profileData = {
    img: [
      {
        url:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf0lMYQSTz_LnR0EUDUrkQbu96QWlQ4FH9Gw&usqp=CAU",
      },
      {
        url:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf0lMYQSTz_LnR0EUDUrkQbu96QWlQ4FH9Gw&usqp=CAU",
      },
      {
        url:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf0lMYQSTz_LnR0EUDUrkQbu96QWlQ4FH9Gw&usqp=CAU",
      },
      {
        url:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf0lMYQSTz_LnR0EUDUrkQbu96QWlQ4FH9Gw&usqp=CAU",
      },
      {
        url:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf0lMYQSTz_LnR0EUDUrkQbu96QWlQ4FH9Gw&usqp=CAU",
      },
      {
        url:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQf0lMYQSTz_LnR0EUDUrkQbu96QWlQ4FH9Gw&usqp=CAU",
      },
    ],
    name: "Lumesh Konde",
    age: "20",
    sex: "Male",
    bio:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  };
  return (
    <>
      <section className="profilePage">
        <ViewModal />
        <div className="container">
          <div className="profilePic">
            <img src={profileData.img[0].url} />
          </div>
          <div className="buttons">
            <div className="btn">
              <svg>
                <rect></rect>
              </svg>
              Edit Profile
            </div>

            <div
              className="btn"
              onClick={() => store.dispatch({ type: "opened" })}
            >
              <svg>
                <rect></rect>
              </svg>
              View Profile
            </div>
          </div>
          <div className="container profileData">
            <div className="field">
              <span>Name</span>
              <div className="data">{profileData.name}</div>
            </div>
            <div className="field">
              <span>Age</span>
              <div className="data">{profileData.age}</div>
            </div>
            <div className="field">
              <span>Sex</span>
              <div className="data">{profileData.sex}</div>
            </div>
            <div className="field">
              <span>Bio</span>
              <div className="data">{profileData.bio}</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
