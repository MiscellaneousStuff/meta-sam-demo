import { Tensor } from "onnxruntime-web";
import { createContext } from "react";
import { modelInputProps } from "../helpers/Interface";

interface contextProps {
  click: [
    click: modelInputProps | null,
    setClick: (e: modelInputProps | null) => void
  ];
  clicks: [
    clicks: modelInputProps[] | null,
    setClicks: (e: modelInputProps[] | null) => void
  ];
  clicksHistory: [
    clicksHistory: modelInputProps[] | null,
    setClicksHistory: (e: modelInputProps[] | null) => void
  ];
  image: [
    image: HTMLImageElement | null,
    setImage: (e: HTMLImageElement | null) => void
  ];
  prevImage: [
    prevImage: HTMLImageElement | null,
    setPrevImage: (e: HTMLImageElement | null) => void
  ];
  isLoading: [isLoading: boolean, setIsLoading: (e: boolean) => void];
  isErasing: [isErasing: boolean, setIsErasing: (e: boolean) => void];
  isErased: [isErased: boolean, setIsErased: (e: boolean) => void];
  error: [error: boolean, setError: (e: boolean) => void];
  svg: [svg: string[] | null, setSVG: (e: string[] | null) => void];
  svgs: [svgs: string[][] | null, setSVGs: (e: string[][] | null) => void];
  allsvg: [
    allsvg: { svg: string[]; point_coord: number[] }[] | null,
    setAllsvg: (e: { svg: string[]; point_coord: number[] }[] | null) => void
  ];
  stickers: [
    stickers: HTMLCanvasElement[],
    setStickers: (e: HTMLCanvasElement[]) => void
  ];
  activeSticker: [
    activerSticker: number,
    setActiveSticker: (e: number) => void
  ];
  isModelLoaded: [
    isModelLoaded: {
      boxModel: boolean;
      allModel: boolean;
    },
    setIsModelLoaded: React.Dispatch<
      React.SetStateAction<{ boxModel: boolean; allModel: boolean }>
    >
  ];
  segmentTypes: [
    segmentTypes: "Box" | "Click" | "All",
    setSegmentTypes: (e: "Box" | "Click" | "All") => void
  ];
  canvasWidth: [canvasWidth: number, setCanvasWidth: (e: number) => void];
  canvasHeight: [canvasHeight: number, setCanvasHeight: (e: number) => void];
  maskImg: [
    maskImg: HTMLImageElement | null,
    setMaskImg: (e: HTMLImageElement | null) => void
  ];
  maskCanvas: [
    maskCanvas: HTMLCanvasElement | null,
    setMaskCanvas: (e: HTMLCanvasElement | null) => void
  ];
  userNegClickBool: [
    userNegClickBool: boolean,
    setUserNegClickBool: (e: boolean) => void
  ];
  hasNegClicked: [
    hasNegClicked: boolean,
    setHasNegClicked: (e: boolean) => void
  ];
  stickerTabBool: [
    stickerTabBool: boolean,
    setStickerTabBool: React.Dispatch<React.SetStateAction<boolean>>
  ];
  enableDemo: [
    enableDemo: boolean,
    setEnableDemo: React.Dispatch<React.SetStateAction<boolean>>
  ];
  isMultiMaskMode: [
    isMultiMaskMode: boolean,
    setIsMultiMaskMode: React.Dispatch<React.SetStateAction<boolean>>
  ];
  isHovering: [
    isHovering: boolean | null,
    setIsHovering: React.Dispatch<React.SetStateAction<boolean | null>>
  ];
  showLoadingModal: [
    showLoadingModal: boolean,
    setShowLoadingModal: React.Dispatch<React.SetStateAction<boolean>>
  ];
  eraserText: [
    eraserText: {
      isErase: boolean;
      isEmbedding: boolean;
    },
    setEraserText: React.Dispatch<
      React.SetStateAction<{
        isErase: boolean;
        isEmbedding: boolean;
      }>
    >
  ];
  didShowAMGAnimation: [
    didShowAMGAnimation: boolean,
    setDidShowAMGAnimation: React.Dispatch<React.SetStateAction<boolean>>
  ];
  predMask: [
    predMask: Tensor | null,
    setPredMask: React.Dispatch<React.SetStateAction<Tensor | null>>
  ];
  predMasks: [
    predMasks: Tensor[] | null,
    setPredMasks: React.Dispatch<React.SetStateAction<Tensor[] | null>>
  ];
  predMasksHistory: [
    predMasksHistory: Tensor[] | null,
    setPredMasksHistory: React.Dispatch<React.SetStateAction<Tensor[] | null>>
  ];
  isAllAnimationDone: [
    isAllAnimationDone: boolean,
    setIsAllAnimationDone: React.Dispatch<React.SetStateAction<boolean>>
  ];
  isToolBarUpload: [
    isToolBarUpload: boolean,
    setIsToolBarUpload: React.Dispatch<React.SetStateAction<boolean>>
  ];
}

const AppContext = createContext<contextProps | null>(null);

export default AppContext;
