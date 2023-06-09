import LZString from "lz-string";
import { InferenceSession, Tensor } from "onnxruntime-web";
import * as ort from "onnxruntime-web";
//import "./assets/scss/App.scss";
//import Footer from "./components/Footer";
import getFile from "./getFile";
import { handleImageScale } from "./ImageHelper";
import { modelScaleProps } from "./Interface";
import {
  getAllMasks,
  //getBestPredMask,
  keepArrayForMultiMask,
  //rleFrString,
  rleToImage,
  traceCompressedRLeStringToSVG,
  traceOnnxMaskToSVG,
} from "./mask_utils";
import {
  modelData,
  setParmsandQueryEraseModel,
  setParmsandQueryModel,
} from "./modelAPI";
import AppContext from "../hooks/createContext";

// if (process.env.MODEL_DIR === undefined) return;
export const MODEL_DIR =
  "./interactive_module_quantized_592547_2023_03_19_sam6_long_uncertain.onnx";

// console.log("MULTI MASK MODEL");
// if (process.env.MULTI_MASK_MODEL_DIR === undefined) return;
export const MULTI_MASK_MODEL_DIR =
  "./interactive_module_quantized_592547_2023_03_20_sam6_long_all_masks_extra_data_with_ious.onnx";

// Onnxruntime
ort.env.debug = true;
// set global logging level
ort.env.logLevel = "verbose";

// override path of wasm files - for each file
ort.env.wasm.numThreads = 2;
ort.env.wasm.simd = true;
// ort.env.wasm.proxy = true;
ort.env.wasm.wasmPaths = {
  "ort-wasm.wasm": "/ort-wasm.wasm",
  "ort-wasm-simd.wasm": "/ort-wasm-simd.wasm",
  "ort-wasm-threaded.wasm": "/ort-wasm-threaded.wasm",
  "ort-wasm-simd-threaded.wasm": "/ort-wasm-simd-threaded.wasm",
};

// ort.env.webgl.pack = true;
export const sortAndReturnIndices = (arr: Array<number>) => {
  const indices = Array.from(arr.keys());
  indices.sort((a, b) => arr[b] - arr[a]);
  return indices;
};

export const sortByIndices = (items: any, indices: Array<number>) => {
  const result = [];
  for (var i = 0; i < indices.length; i++) {
    result.push(items[indices[i]]);
  }
  return result;
};
