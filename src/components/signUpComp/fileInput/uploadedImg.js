import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "./cropImage";
import Button from "@material-ui/core/Button";
import { withStyles } from "@material-ui/core/styles";
import ImgDialog from "./ImgDialog";

const styles = {
    conContainer: {
      position: "absolute",
      width: "100vw",
      height: "100vh"
    },
    overlayContainer: {
      position: "absolute",
      width: "100vw",
      height: "100vh"
    },
    cropContainer: {
      position: "relative",
      width: "100%",
      height: 200,
      background: "#333"
    },
    controls: {
      display: "flex",
      flexDirection: "column"
    },
    cropButton: {
      flexShrink: 0,
      marginLeft: 16
    },
    buttonContainer: {
      position: "absolute",
      bottom: "5%",
      left: "50%",
      transform: "translate(-50%,0%)"
    }
  };
  

function Crop({ classes, imgUrl, uploaded, setUploaded, setSt, setDone }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      const croppedImage = await getCroppedImg(
        imgUrl,
        croppedAreaPixels,
        rotation
      );
      // console.log("donee", { croppedImage });
      setCroppedImage(croppedImage);
      console.log(croppedImage);
    } catch (e) {
      console.error(e);
    }
  }, [croppedAreaPixels, imgUrl, rotation]);

  const onClose = useCallback(() => {
    setCroppedImage(null);
  }, []);

  function Continue() {
    setCroppedImage(null);
    setSt();
    setUploaded(false);
    setDone({done: true, url: croppedImage});
  }

  return uploaded ? (
    <>
        <div style={{zIndex: 5}}>
        <div>
            <Cropper
            image={imgUrl}
            crop={crop}
            rotation={rotation}
            zoom={zoom}
            aspect={7 / 9}
            onCropChange={setCrop}
            onRotationChange={setRotation}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            />
        </div>
        <div className={classes.buttonContainer}>
            <Button
            onClick={showCroppedImage}
            variant="contained"
            color="primary"
            >
            Show Result
            </Button>
            <Button
            onClick={() => {
                setSt();
                setUploaded(false);
            }}
            variant="contained"
            color="primary"
            >
            Close
            </Button>
        </div>
        <ImgDialog
        img={croppedImage}
        onClose={() => {            
            onClose();
        }}
        Continue={Continue}
      />
      </div>
    </>
  ) : null;
}

const StyledCrop = withStyles(styles)(Crop);

export default function UploadedImg(props) {
  return (
    <StyledCrop imgUrl={props.imgUrl} uploaded={props.uploaded} setUploaded={props.setUploaded} setSt={props.setSt} setDone={props.setDone}/>
  );
}
