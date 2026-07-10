import { useRef, useState } from "react";
import UploadedImage from "./uploadedImg";
import firebase from "firebase";
import { v4 } from "uuid";

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
    // props.imgUpload(url, props.idx);

    var storage = firebase.storage();
    var storageRef = storage.ref();
    let nam = v4().toString();
    var uploadTask = storageRef
      .child(`images/${nam.slice(-8)}.jpg`)
      .putString(url, "data_url");

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log("Upload is paused");
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          props.imgUpload(downloadURL, props.idx);
          console.log("File available at", downloadURL);
        });
      }
    );
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
