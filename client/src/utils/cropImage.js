export default function getCroppedImg(imageSrc, pixelCrop, fileName) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.crossOrigin = "anonymous";
    image.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob((blob) => {
        if (!blob) {
          reject("Failed to crop");
        }
        blob.name = fileName;
        const fileUrl = URL.createObjectURL(blob);
        resolve({ blob, fileUrl });
      }, "image/jpeg");
    };
    image.onerror = () => {
      reject("Failed to load image");
    };
  });
}
