import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import firebase from "firebase/app";
import "firebase/storage";
import usePrevious from "../../hooks/usePrevious";
import FileInput from "./fileInput/fileInput";

export default function (props) {
  const [img, setImg] = useState(null);
  const [show, setShow] = useState(true);
  const prevImg = usePrevious(img);
  console.log(props.data);

  let arrUrl = [];

  useEffect(() => {
    if (img !== null && img !== prevImg) {
      console.log(img);
      getURL();
    }
  });

  function getURL() {
    var storage = firebase.storage();
    var storageRef = storage.ref();
    console.log(img);
    // Upload file and metadata to the object 'images/mountains.jpg'
    var uploadTask = storageRef.child("images/" + img.name).put(img);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
      (snapshot) => {
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
        switch (error.code) {
          case "storage/unauthorized":
            break;
          case "storage/canceled":
            break;

          case "storage/unknown":
            break;
        }
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log("File available at", downloadURL);
        });
      }
    );
  }

  let formVar = props.var;
  return (
    <>
      <div
        className="formContainer"
        style={{ backgroundImage: `url(/images/noisy.png)` }}
      >
        <AnimatePresence exitBeforeEnter>
          {show && (
            <motion.div
              variants={formVar}
              initial="initial"
              animate="enter"
              exit="exit"
              className="Container"
            >
              <div id="signUpForm" style={{ padding: "80px" }}>
                <h2 className="form-title">Details</h2>
                <div className="formUnd">
                  <svg>
                    <line
                      x1="0"
                      y1="0"
                      x2="1000"
                      y2="0"
                      style={{ stroke: "#000", strokeWidth: 2 }}
                    />
                  </svg>
                </div>
                <div className="formGroup">
                  <p>Upload your images!</p>
                  <div className="images">
                    <div className="ROW p2" style={{ marginBottom: "20px" }}>
                      <FileInput imgUpload={props.imgUpload} idx={0} />
                      <FileInput imgUpload={props.imgUpload} idx={1} />
                      <FileInput imgUpload={props.imgUpload} idx={2} />
                    </div>
                    <div className="ROW p2">
                      <FileInput imgUpload={props.imgUpload} idx={3} />
                      <FileInput imgUpload={props.imgUpload} idx={4} />
                      <FileInput imgUpload={props.imgUpload} idx={5} />
                    </div>
                  </div>
                  <div class="form-button">
                    <button
                      className="but"
                      style={{ marginRight: "20px" }}
                      onClick={() => {
                        props.changeDir(-1);
                        setTimeout(() => setShow(false), 1);
                        setTimeout(() => props.prev(), 900);
                      }}
                    >
                      Back{" "}
                      <i style={{ margin: 0 }} class="zmdi zmdi-arrow-left"></i>
                    </button>
                    <button
                      className="but"
                      onClick={() => {
                        props.changeDir(1);
                        setTimeout(() => setShow(false), 1);
                        setTimeout(() => props.next(), 700);
                      }}
                    >
                      Next{" "}
                      <i
                        style={{ margin: 0 }}
                        class="zmdi zmdi-arrow-right"
                      ></i>
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
