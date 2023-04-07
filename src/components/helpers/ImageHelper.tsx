const handleImageScale = (data: HTMLImageElement) => {
    const IMAGE_SIZE = 500;
    const UPLOAD_IMAGE_SIZE = 1024;
    let w = data.naturalWidth;
    let h = data.naturalHeight;
    let scale;
    let uploadScale;
    if (h < w) {
      scale = IMAGE_SIZE / h;
      if (h * scale > 1333) {
        scale = 1333 / h;
      }
      uploadScale = UPLOAD_IMAGE_SIZE / w;
    } else {
      scale = IMAGE_SIZE / w;
      if (w * scale > 1333) {
        scale = 1333 / w;
      }
      uploadScale = UPLOAD_IMAGE_SIZE / h;
    }
    return { height: h, width: w, scale, uploadScale };
  };
  
  export { handleImageScale };
  