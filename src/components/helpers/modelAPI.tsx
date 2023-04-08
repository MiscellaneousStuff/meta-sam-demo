import { Tensor } from "onnxruntime-web";

import {
  clickType,
  modeDataProps,
  modelInputProps,
  queryEraseModelProps,
  queryModelReturnTensorsProps,
  setParmsandQueryEraseModelProps,
  setParmsandQueryModelProps,
} from "./Interface";

const API_ENDPOINT          = "https://model-zoo.metademolab.com/predictions/segment_everything_box_model";
const ALL_MASK_API_ENDPOINT = "https://model-zoo.metademolab.com/predictions/automatic_masks";
//const API_ENDPOINT = process.env.API_ENDPOINT;
//const ALL_MASK_API_ENDPOINT = process.env.ALL_MASK_API_ENDPOINT;
const ERASE_API_ENDPOINT = process.env.ERASE_API_ENDPOINT;

const setParmsandQueryModel = ({
  width,
  height,
  uploadScale,
  imgData,
  handleSegModelResults,
  handleAllModelResults,
  imgName,
  shouldDownload,
  shouldNotFetchAllModel,
}: setParmsandQueryModelProps) => {
  // console.log("setParmsandQueryModel");
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * uploadScale);
  canvas.height = Math.round(height * uploadScale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.drawImage(imgData, 0, 0, canvas.width, canvas.height);
  // console.log("plot uploaded image");
  canvas.toBlob(
    (blob) => {
      blob &&
        queryModelReturnTensors({
          blob,
          handleSegModelResults,
          handleAllModelResults,
          image_height: canvas.height,
          imgName,
          shouldDownload,
          shouldNotFetchAllModel,
        });
    },
    "image/jpeg",
    1.0
  );
};

const queryModelReturnTensors = async ({
  blob,
  handleSegModelResults,
  handleAllModelResults,
  image_height, // Original image height
  imgName,
  shouldDownload,
  shouldNotFetchAllModel,
}: queryModelReturnTensorsProps) => {

  // console.log("image_height, imgName, shouldDownload, shouldNotFetchAllModel:", image_height, imgName, shouldDownload, shouldNotFetchAllModel)
  // console.log("pre-queryModelReturnTensors");
  if (!API_ENDPOINT) return;
  if (!ALL_MASK_API_ENDPOINT) return;
  // console.log("post-queryModelReturnTensors");
  const segRequest =
    imgName && !shouldDownload
      ? fetch(`/assets/gallery/${imgName}.txt`)
      : fetch(`${API_ENDPOINT}`, {
          method: "POST",
          body: blob,
        });
  segRequest.then(async (segResponse) => {
    if (shouldDownload) {
      const segResponseClone = segResponse.clone();
      const segResponseBlob = await segResponseClone.blob();
      downloadBlob(segResponseBlob, imgName);
    }
    const segJSON = await segResponse.json();
    const embedArr = segJSON.map((arrStr: string) => {
      const binaryString = window.atob(arrStr);
      const uint8arr = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        uint8arr[i] = binaryString.charCodeAt(i);
      }
      const float32Arr = new Float32Array(uint8arr.buffer);
      return float32Arr;
    });
    const lowResTensor = new Tensor("float32", embedArr[0], [1, 256, 64, 64]);
    handleSegModelResults({
      tensor: lowResTensor,
    });
  });
  if (!shouldNotFetchAllModel) {
    const allImgName = imgName + ".all";
    const allRequest =
      imgName && !shouldDownload
        ? fetch(`/assets/gallery/${allImgName}.txt`)
        : fetch(`${ALL_MASK_API_ENDPOINT}`, {
            method: "POST",
            body: blob,
          });
    allRequest.then(async (allResponse) => {
      if (shouldDownload) {
        const allResponseClone = allResponse.clone();
        const allResponseBlob = await allResponseClone.blob();
        downloadBlob(allResponseBlob, allImgName);
      }
      const allJSON = await allResponse.json();
      handleAllModelResults({
        allJSON,
        image_height,
      });
    });
    allRequest.catch((e) => console.log(e));
  }
};

const queryEraseModel = async ({
  image,
  mask,
  handlePredictedImage,
}: queryEraseModelProps) => {
  const [eraseResponse] = await Promise.all([
    fetch(`${ERASE_API_ENDPOINT}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        image: image,
        // @ts-ignore
        mask: Array.from(mask),
        dilate_kernel_size: 24,
      }),
    }),
  ]);
  const [eraseJSON] = await Promise.all([eraseResponse.text()]);
  const imgSrc = "data:image/png;base64, " + eraseJSON;
  handlePredictedImage(imgSrc);
};

const getBase64StringFromDataURL = (dataURL: string) =>
  dataURL.replace("data:", "").replace(/^.+,/, "");

const setParmsandQueryEraseModel = ({
  width,
  height,
  uploadScale,
  imgData,
  mask,
  handlePredictedImage,
}: setParmsandQueryEraseModelProps) => {
  // console.log("Querying erase model");
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * uploadScale);
  canvas.height = Math.round(height * uploadScale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.drawImage(imgData || new Image(), 0, 0, canvas.width, canvas.height);
  const dataURL = canvas.toDataURL();
  const b64im = getBase64StringFromDataURL(dataURL);
  queryEraseModel({
    image: b64im,
    mask,
    handlePredictedImage,
  });
};

const downloadBlob = (data: any, name: string) => {
  const blob = new Blob([data]);
  const link = document.createElement("a");
  link.download = name + ".txt";
  link.href = URL.createObjectURL(blob);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

const getPointsFromBox = (box: modelInputProps) => {
  if (box.width === null || box.height === null) return;
  const upperLeft = { x: box.x, y: box.y };
  const bottomRight = { x: box.width, y: box.height };
  return { upperLeft, bottomRight };
};

const isFirstClick = (clicks: Array<modelInputProps>) => {
  return (
    (clicks.length === 1 &&
      (clicks[0].clickType === clickType.POSITIVE ||
        clicks[0].clickType === clickType.NEGATIVE)) ||
    (clicks.length === 2 &&
      clicks.every(
        (c) =>
          c.clickType === clickType.UPPER_LEFT ||
          c.clickType === clickType.BOTTOM_RIGHT
      ))
  );
};

const modelData = ({
  clicks,
  tensor,
  modelScale,
  point_coords,
  point_labels,
  last_pred_mask,
}: modeDataProps) => {
  const lowResTensor = tensor;
  let pointCoords;
  let pointLabels;
  let pointCoordsTensor;
  let pointLabelsTensor;
  // point_coords, point_labels params below are only truthy in text model
  // if (point_coords && point_labels) {
  //   pointCoords = new Float32Array(4);
  //   pointLabels = new Float32Array(2);
  //   pointCoords[0] = point_coords[0][0];
  //   pointCoords[1] = point_coords[0][1];
  //   pointLabels[0] = point_labels[0]; // UPPER_LEFT
  //   pointCoords[2] = point_coords[1][0];
  //   pointCoords[3] = point_coords[1][1];
  //   pointLabels[1] = point_labels[1]; // BOTTOM_RIGHT
  //   pointCoordsTensor = new Tensor("float32", pointCoords, [1, 2, 2]);
  //   pointLabelsTensor = new Tensor("float32", pointLabels, [1, 2]);
  // }
  // point click model check
  if (clicks) {
    let n = clicks.length;
    const clicksFromBox = clicks[0].clickType === 2 ? 2 : 0;

    // For click only input (no box) need to add an extra
    // negative point and label
    pointCoords = new Float32Array(2 * (n + 1));
    pointLabels = new Float32Array(n + 1);

    // Check if there is a box input
    if (clicksFromBox) {
      // For box model need to include the box clicks in the point
      // coordinates and also don't need to include the extra
      // negative point
      pointCoords = new Float32Array(2 * (n + clicksFromBox));
      pointLabels = new Float32Array(n + clicksFromBox);
      const {
        upperLeft,
        bottomRight,
      }: {
        upperLeft: { x: number; y: number };
        bottomRight: { x: number; y: number };
      } = getPointsFromBox(clicks[0])!;
      pointCoords = new Float32Array(2 * (n + clicksFromBox));
      pointLabels = new Float32Array(n + clicksFromBox);
      pointCoords[0] = upperLeft.x / modelScale.onnxScale;
      pointCoords[1] = upperLeft.y / modelScale.onnxScale;
      pointLabels[0] = 2.0; // UPPER_LEFT
      pointCoords[2] = bottomRight.x / modelScale.onnxScale;
      pointCoords[3] = bottomRight.y / modelScale.onnxScale;
      pointLabels[1] = 3.0; // BOTTOM_RIGHT

      last_pred_mask = null;
    }

    // Add regular clicks
    for (let i = 0; i < n; i++) {
      pointCoords[2 * (i + clicksFromBox)] = clicks[i].x / modelScale.onnxScale;
      pointCoords[2 * (i + clicksFromBox) + 1] =
        clicks[i].y / modelScale.onnxScale;
      pointLabels[i + clicksFromBox] = clicks[i].clickType;
    }

    // Add in the extra point/label when only clicks and no box
    // The extra point is at (0, 0) with label -1
    if (!clicksFromBox) {
      pointCoords[2 * n] = 0.0;
      pointCoords[2 * n + 1] = 0.0;
      pointLabels[n] = -1.0;
      // update n for creating the tensor
      n = n + 1;
    }

    // Create the tensor
    pointCoordsTensor = new Tensor("float32", pointCoords, [
      1,
      n + clicksFromBox,
      2,
    ]);
    pointLabelsTensor = new Tensor("float32", pointLabels, [
      1,
      n + clicksFromBox,
    ]);
  }
  const imageSizeTensor = new Tensor("float32", [
    modelScale.maskHeight,
    modelScale.maskWidth,
  ]);
  if (pointCoordsTensor === undefined || pointLabelsTensor === undefined)
    return;

  // if there is a previous tensor, use it, otherwise we default to an empty tensor
  const lastPredMaskTensor =
    last_pred_mask && clicks && !isFirstClick(clicks)
      ? last_pred_mask
      : new Tensor("float32", new Float32Array(256 * 256), [1, 1, 256, 256]);

  // +!! is javascript shorthand to convert truthy value to 1, falsey value to 0
  const hasLastPredTensor = new Tensor("float32", [
    +!!(last_pred_mask && clicks && !isFirstClick(clicks)),
  ]);

  return {
    low_res_embedding: lowResTensor,
    point_coords: pointCoordsTensor,
    point_labels: pointLabelsTensor,
    image_size: imageSizeTensor,
    last_pred_mask: lastPredMaskTensor,
    has_last_pred: hasLastPredTensor,
  };
};

export { setParmsandQueryModel, modelData, setParmsandQueryEraseModel };