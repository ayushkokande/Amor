import { useRef, useState } from "react";
import UploadedImage from "./uploadedImg";

export default function (props) {
  const fileRef = useRef();
  const [uploaded, setUploaded] = useState(false);
  const [upUrl, setUpUrl] = useState(null);
  const [done, setDone] = useState({ done: false, url: null });
  const [styles, setStyles] = useState({});

  function getBase64(file) {
    return new Promise((resolve) => {
      let baseURL = "";
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  }

  function handleChange(e) {
    let file = e.target.files[0];
    fileRef.current = file;
    let d;
    setStyles({ zIndex: "1" });
    getBase64(file)
      .then((result) => {
        d = result;
        setUpUrl(d);
        setUploaded(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function cropImgUploaded(url) {
    props.imgUpload(url, props.idx);
  }

  return !done.done ? (
    <>
      <label className="imgUp col-auto">
        <div
          style={uploaded ? { animation: "spin 10s linear infinite" } : {}}
          className="circle"
        ></div>
        <span>
          <i class="fas fa-plus"></i>
        </span>
        <input type="file" onChange={handleChange} required />
      </label>
      <div style={styles} className="fileContainer">
        <UploadedImage
          imgUrl={upUrl}
          uploaded={uploaded}
          setUploaded={setUploaded}
          setSt={() => setStyles({})}
          setDone={setDone}
          cropImgUploaded={cropImgUploaded}
        />
      </div>
    </>
  ) : (
    <>
      <label style={{ backgroundColor: "#fff" }} className="imgUp col-auto">
        <div className="circle"></div>
        <div className="croppedImg">
          <img src={done.url} />
        </div>
        <input type="file" onChange={handleChange} required />
      </label>
      <div style={styles} className="fileContainer">
        <UploadedImage
          imgUrl={upUrl}
          uploaded={uploaded}
          setUploaded={setUploaded}
          setSt={() => setStyles({})}
          setDone={setDone}
          cropImgUploaded={cropImgUploaded}
        />
      </div>
    </>
  );
}
