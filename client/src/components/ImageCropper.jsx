// components/ImageCropper.jsx
import React, { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import getCroppedImg from "../utils/cropImage";
import { v4 as uuidv4 } from "uuid";

const ImageCropper = ({ image, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleCropComplete = useCallback((_, areaPixels) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleDone = async () => {
    const croppedImage = await getCroppedImg(
      image,
      croppedAreaPixels,
      uuidv4()
    );
    onCropComplete(croppedImage);
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/90 z-50 flex flex-col justify-center items-center">
      <div className="relative w-[90vw] h-[60vh] bg-black">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={handleCropComplete}
        />
      </div>
      <div className="flex mt-4 gap-4">
        <button className="bg-green-600 px-4 py-2 rounded" onClick={handleDone}>
          Crop
        </button>
        <button className="bg-red-500 px-4 py-2 rounded" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default ImageCropper;
