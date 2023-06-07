import React, { useContext, useState } from "react";
//import { getCookieConsentValue } from "react-cookie-consent";

import { useDropzone } from "react-dropzone";
//import * as ReactGA from "react-ga4";
import Animate from "./hooks/Animation";
import AppContext from "./hooks/createContext";
import SegmentOptions from "./SegmentOptions";
//import Sparkle from "./Sparkle";

interface SegmentDrawerProps {
  handleResetState: () => void;
  handleResetInteraction: (flag?: boolean) => void;
  handleUndoInteraction: () => void;
  handleRedoInteraction: () => void;
  handleCreateSticker: () => void;
  handleMagicErase: () => void;
  handleImage: (img?: HTMLImageElement) => void;
  handleMultiMaskMode: () => void;
  userNegClickBool: [
    userNegClickBool: boolean,
    setUserNegClickBool: (e: boolean) => void
  ];
  showGallery: [showGallery: boolean, setShowGallery: (e: boolean) => void];
  hasClicked: boolean;
  handleSelectedImage: (
    data: File | URL,
    options?: { shouldDownload?: boolean; shouldNotFetchAllModel?: boolean }
  ) => void;
}

const SegmentDrawer = ({
  handleResetState,
  handleResetInteraction,
  handleUndoInteraction,
  handleRedoInteraction,
  handleCreateSticker,
  handleMagicErase,
  handleImage,
  handleMultiMaskMode,
  userNegClickBool: [userNegClickBool, setUserNegClickBool],
  showGallery: [showGallery, setShowGallery],
  hasClicked,
  handleSelectedImage,
}: SegmentDrawerProps) => {
  const {
    isModelLoaded: [isModelLoaded, setIsModelLoaded],
    segmentTypes: [segmentTypes, setSegmentTypes],
    isLoading: [isLoading, setIsLoading],
    isErased: [isErased, setIsErased],
    isMultiMaskMode: [isMultiMaskMode, setIsMultiMaskMode],
    stickers: [stickers, setStickers],
    activeSticker: [activeSticker, setActiveSticker],
    didShowAMGAnimation: [didShowAMGAnimation, setDidShowAMGAnimation],
    isAllAnimationDone: [isAllAnimationDone, setIsAllAnimationDone],
    isToolBarUpload: [isToolBarUpload, setIsToolBarUpload],
  } = useContext(AppContext)!;

  const [uploadClick, setUploadClick] = useState<boolean>(true);
  const [visibleClickHover, setVisibleClickHover] = useState<boolean>(false);
  const [visibleBoxHover, setVisibleBoxHover] = useState<boolean>(false);
  const [visibleAllHover, setVisibleAllHover] = useState<boolean>(false);
  const [visibleStickerHover, setVisibleStickerHover] =
    useState<boolean>(false);
  const [isCutOut, setIsCutOut] = useState<boolean>(false);
  const handleStickerClick = (i: number) => {
    setActiveSticker(i);
  };
  const [error, setError] = useState<string>("");
  const [isClickCollapsed, setIsClickCollapsed] = useState(true);
  const [isBoxCollapsed, setIsBoxCollapsed] = useState(true);
  const [isAllCollapsed, setIsAllCollapsed] = useState(true);
  const [isCutOutCollapsed, setIsCutOutCollapsed] = useState(true);
  const [isClickMounted, setIsClickMounted] = useState(false);
  const [isBoxMounted, setIsBoxMounted] = useState(false);
  const [isAllMounted, setIsAllMounted] = useState(false);
  const [isCutOutMounted, setIsCutOutMounted] = useState(false);
  let clickTimeout: string | number | NodeJS.Timeout | undefined,
    boxTimeout: string | number | NodeJS.Timeout | undefined,
    allTimeout: string | number | NodeJS.Timeout | undefined,
    cutOutTimeout: string | number | NodeJS.Timeout | undefined;

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpeg", ".jpg"],
    },
    onDrop: (acceptedFile) => {
      try {
        if (acceptedFile.length === 0) {
          setError("File not accepted! Try again.");
          return;
        }
        if (acceptedFile.length > 1) {
          setError("Too many files! Try again with 1 file.");
          return;
        }
        const reader = new FileReader();
        reader.onloadend = () => {
          handleSelectedImage(acceptedFile[0]);
        };
        reader.readAsDataURL(acceptedFile[0]);
      } catch (error) {
        console.log(error);
      }
    },
    maxSize: 50_000_000,
  });

  console.error(
    isMultiMaskMode,
    visibleClickHover,
    "isClickMounted",
    isClickMounted,
    isAllMounted,
    segmentTypes
  );

  return (
    <section className="flex-col hidden w-1/5 pt-[6%] overflow-y-auto md:flex lg:w-72">
      <div
        className={`shadow-[0px_0px_15px_5px_#00000024] rounded-xl md:mx-1 lg:mx-5`}
      >
        <div className="p-4 pt-5">
          {uploadClick && (
            <div className="flex justify-between px-3 py-2 mb-3 cursor-pointer rounded-xl outline outline-gray-200">
              <button
                className="flex"
                onClick={() => {
                  setShowGallery(true);
                  setIsCutOut(false);
                  setIsToolBarUpload(true);
                }}
              >
                <span {...getRootProps()} className="flex text-sm">
                  <input {...getInputProps()} />
                  <img src="assets/upload_arrow.svg" className="w-5 mr-1" />
                  Upload
                </span>
              </button>
              <button
                className="flex"
                onClick={() => {
                  setIsToolBarUpload(false);
                  setShowGallery(false);
                  setIsCutOut(false);
                  setDidShowAMGAnimation(false);
                  handleResetState();
                }}
              >
                <img src="assets/icn-image-gallery.svg" className="w-5 mr-1" />
                <span className="text-sm">Gallery</span>
              </button>
            </div>
          )}
          <div
            onClick={() => {
              segmentTypes !== "Click" && handleResetInteraction();
              clearTimeout(clickTimeout);
              setSegmentTypes("Click");
              setIsCutOut(false);
              setDidShowAMGAnimation(false);
            }}
            className={`transition-all overflow-hidden pb-2 ${
              segmentTypes !== "Click" &&
              (isClickCollapsed ? "max-h-[40px]" : "max-h-[85px]")
            } px-3 py-2 cursor-pointer rounded-xl ${
              segmentTypes === "Click"
                ? "outline-blue-700 outline outline-[2.5px]"
                : "outline outline-gray-200 "
            } ${isCutOut && "hidden"}`}
            onMouseEnter={() => {
              clearTimeout(clickTimeout);
              clickTimeout = setTimeout(() => {
                setIsClickCollapsed(false);
                setVisibleClickHover(true);
                setIsClickMounted(!isClickMounted);
              }, 700);
            }}
            onMouseLeave={() => {
              setIsClickCollapsed(true);
              setIsBoxCollapsed(true);
              setIsAllCollapsed(true);
              setIsCutOutCollapsed(true);
              // setVisibleClickHover(false);
              clearTimeout(clickTimeout);
              setIsClickMounted(false);
              setIsBoxMounted(false);
              setIsAllMounted(false);
              setIsCutOutMounted(false);
            }}
          >
            {segmentTypes === "Click" && (
              <p className={`my-3 text-[11px] text-blue-700 opacity-70`}>
                Click an object one or more times. Shift-click to remove
                regions.
              </p>
            )}
            <div className="flex justify-between mx-5 my-3">
              <div
                onClick={() => setUserNegClickBool(false)}
                className="flex flex-col items-center"
              >
                <p
                  className={`w-8 h-7 text-3xl leading-7 text-center align-middle rounded-lg mb-1 ${
                    userNegClickBool
                      ? "outline outline-1"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  +
                </p>
                <p
                  className={`text-xs font-bold ${
                    !userNegClickBool && "text-blue-600"
                  }`}
                >
                  Add Mask
                </p>
              </div>

              <div
                onClick={() => setUserNegClickBool(true)}
                className={`flex flex-col items-center ${
                  !hasClicked ? "disabled" : ""
                }`}
              >
                <p
                  className={`w-8 h-7 text-3xl leading-6 text-center align-middle rounded-lg mb-1 ${
                    userNegClickBool
                      ? "bg-blue-600 text-white"
                      : "outline outline-1"
                  }`}
                >
                  -
                </p>
                <p
                  className={`text-xs font-bold ${
                    userNegClickBool && "text-blue-600"
                  }`}
                >
                  Remove Area
                </p>
              </div>
            </div>
            {segmentTypes === "Click" && (
              <SegmentOptions
                handleResetInteraction={handleResetInteraction}
                handleUndoInteraction={handleUndoInteraction}
                handleRedoInteraction={handleRedoInteraction}
                handleCreateSticker={handleCreateSticker}
                handleMagicErase={handleMagicErase}
                handleImage={handleImage}
                hasClicked={hasClicked}
                isCutOut={[isCutOut, setIsCutOut]}
                handleMultiMaskMode={handleMultiMaskMode}
              />
            )}
          </div>

          <div
            onClick={() => {
              segmentTypes !== "Box" && handleResetInteraction(true);
              clearTimeout(boxTimeout);
              setIsMultiMaskMode(false);
              setSegmentTypes("Box");
              setIsCutOut(false);
              setDidShowAMGAnimation(false);
            }}
            className={`transition-all overflow-hidden ${
              segmentTypes !== "Box" &&
              (isBoxCollapsed ? "max-h-[40px]" : "max-h-[85px]")
            } my-2 rounded-xl px-4 py-2 cursor-pointer ${
              segmentTypes === "Box"
                ? "outline-blue-700 outline outline-[2.5px]"
                : "outline outline-gray-200"
            } ${isCutOut && "hidden"}`}
            onMouseEnter={() => {
              clearTimeout(boxTimeout);
              boxTimeout = setTimeout(() => {
                setIsBoxCollapsed(false);
                setVisibleBoxHover(true);
                setIsBoxMounted(true);
              }, 700);
            }}
            onMouseLeave={() => {
              setIsClickCollapsed(true);
              setIsBoxCollapsed(true);
              setIsAllCollapsed(true);
              setIsCutOutCollapsed(true);
              // setVisibleBoxHover(false);
              clearTimeout(boxTimeout);
              setIsClickMounted(false);
              setIsBoxMounted(false);
              setIsAllMounted(false);
              setIsCutOutMounted(false);
            }}
          >
            <div className="flex justify-between mx-5 my-3">
              <div
                onClick={() => setUserNegClickBool(false)}
                className="flex flex-col items-center"
              >
                <p
                  className={`w-8 h-7 text-3xl leading-7 text-center align-middle rounded-lg mb-1 ${
                    userNegClickBool
                      ? "outline outline-1"
                      : "bg-blue-600 text-white"
                  }`}
                >
                  +
                </p>
                <p
                  className={`text-xs font-bold ${
                    !userNegClickBool && "text-blue-600"
                  }`}
                >
                  Add Mask
                </p>
              </div>

              <div
                onClick={() => setUserNegClickBool(true)}
                className={`flex flex-col items-center ${
                  !hasClicked ? "disabled" : ""
                }`}
              >
                <p
                  className={`w-8 h-7 text-3xl leading-6 text-center align-middle rounded-lg mb-1 ${
                    userNegClickBool
                      ? "bg-blue-600 text-white"
                      : "outline outline-1"
                  }`}
                >
                  -
                </p>
                <p
                  className={`text-xs font-bold ${
                    userNegClickBool && "text-blue-600"
                  }`}
                >
                  Remove Area
                </p>
              </div>
            </div>
          </div>

          <div
            onClick={() => {
              segmentTypes !== "All" && handleResetInteraction();
              clearTimeout(allTimeout);
              setSegmentTypes("All");
              setIsCutOut(false);
              setDidShowAMGAnimation(false);
            }}
            className={`transition-all overflow-hidden ${
              segmentTypes === "All" &&
              isAllAnimationDone === false &&
              "disabled"
            } ${
              segmentTypes !== "All" &&
              (isAllCollapsed ? "max-h-[40px]" : "max-h-[85px]")
            } my-2 rounded-xl px-4 py-2 cursor-pointer ${
              segmentTypes === "All"
                ? "outline-blue-700 outline outline-[2.5px]"
                : "outline outline-gray-200"
            } ${
              (!isModelLoaded["allModel"] || (isLoading && !isErased)) &&
              "pointer-events-none"
            } ${isCutOut && "hidden"}`}
            onMouseEnter={() => {
              clearTimeout(allTimeout);
              allTimeout = setTimeout(() => {
                setIsAllCollapsed(false);
                setVisibleAllHover(true);
                setIsAllMounted(true);
              }, 700);
            }}
            onMouseLeave={() => {
              setIsClickCollapsed(true);
              setIsBoxCollapsed(true);
              setIsAllCollapsed(true);
              setIsCutOutCollapsed(true);
              // setVisibleAllHover(false);
              clearTimeout(allTimeout);
              setIsClickMounted(false);
              setIsBoxMounted(false);
              setIsAllMounted(false);
              setIsCutOutMounted(false);
            }}
          >
            <div className="flex">
              <span
                className={`pl-3 font-bold ${
                  segmentTypes === "All" && "text-blue-600"
                } ${
                  (!isModelLoaded["allModel"] || (isLoading && !isErased)) &&
                  "disabled"
                }`}
              >
                Everything
              </span>
            </div>
            {segmentTypes !== "All" && visibleAllHover && (
              <Animate isMounted={isAllMounted}>
                <p
                  className={`text-xs my-3 opacity-70 ${
                    (!isModelLoaded["allModel"] || (isLoading && !isErased)) &&
                    "disabled"
                  }`}
                >
                  Find all the objects in the image automatically.
                </p>
              </Animate>
            )}
            {segmentTypes === "All" && (
              <p
                className={`text-xs my-3 opacity-70 text-blue-700 ${
                  (!isModelLoaded["allModel"] || (isLoading && !isErased)) &&
                  "disabled"
                }`}
              >
                Find all the objects in the image automatically.
              </p>
            )}
            {segmentTypes === "All" && (
              <SegmentOptions
                handleResetInteraction={handleResetInteraction}
                handleUndoInteraction={handleUndoInteraction}
                handleRedoInteraction={handleRedoInteraction}
                handleCreateSticker={handleCreateSticker}
                handleMagicErase={handleMagicErase}
                handleImage={handleImage}
                hasClicked={hasClicked}
                isCutOut={[isCutOut, setIsCutOut]}
                handleMultiMaskMode={handleMultiMaskMode}
              />
            )}
          </div>

          <div
            onClick={(e) => {
              clearTimeout(cutOutTimeout);
              setIsMultiMaskMode(false);
              setIsCutOut(true);
              setUploadClick(false);
            }}
            className={`transition-all overflow-hidden my-2 rounded-xl px-4 py-2 cursor-pointer ${
              isCutOut
                ? "outline-blue-700 outline outline-[2.5px]"
                : "outline outline-gray-200"
            }`}
            onMouseEnter={() => {
              clearTimeout(cutOutTimeout);
              cutOutTimeout = setTimeout(() => {
                setIsCutOutCollapsed(false);
                setVisibleStickerHover(true);
                setIsCutOutMounted(true);
              }, 700);
            }}
            onMouseLeave={() => {
              setIsClickCollapsed(true);
              setIsBoxCollapsed(true);
              setIsAllCollapsed(true);
              setIsCutOutCollapsed(true);
              clearTimeout(cutOutTimeout);
              // setVisibleStickerHover(false);
              setIsClickMounted(false);
              setIsBoxMounted(false);
              setIsAllMounted(false);
              setIsCutOutMounted(false);
            }}
          >
            <div
              className={`flex ${
                isCutOut === false &&
                (isCutOutCollapsed ? "max-h-[40px]" : "max-h-[2048px]")
              }`}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                className="mt-1"
              >
                <path
                  d="M10.575 6.3C10.575 5.175 11.0812 4.5 11.925 4.5C12.7687 4.5 13.275 5.175 13.275 6.3C13.275 7.425 12.7687 8.1 11.925 8.1C11.0812 8.1 10.575 7.425 10.575 6.3Z"
                  fill={`${isCutOut ? "#2962D9" : "#000000"}`}
                />
                <path
                  d="M6.075 4.5C5.23125 4.5 4.725 5.175 4.725 6.3C4.725 7.425 5.23125 8.1 6.075 8.1C6.91875 8.1 7.425 7.425 7.425 6.3C7.425 5.175 6.91875 4.5 6.075 4.5Z"
                  fill={`${isCutOut ? "#2962D9" : "#000000"}`}
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M18 10.2088V3.6C18 1.61177 16.3882 0 14.4 0H3.6C1.61177 0 0 1.61177 0 3.6V14.4C0 16.3882 1.61177 18 3.6 18H10.2088C11.1636 18 12.0793 17.6207 12.7544 16.9456L16.9456 12.7544C17.6207 12.0793 18 11.1636 18 10.2088ZM3.6 2.25H14.4C15.1456 2.25 15.75 2.85442 15.75 3.6V8.75C15.75 8.88807 15.6381 9 15.5 9H12.6C10.8656 9 9.4177 10.2265 9.07625 11.8594C9.06866 11.8957 9.03707 11.9225 8.99998 11.9225C7.65188 11.9225 6.41916 11.4285 5.47297 10.6116C5.07293 10.2662 4.45995 10.2265 4.08625 10.6001C3.75946 10.9269 3.73435 11.4546 4.07118 11.771C5.3028 12.928 6.94175 13.6565 8.74991 13.7182C8.8879 13.7229 8.99998 13.8344 8.99998 13.9725L9 15.5C9 15.6381 8.88807 15.75 8.75 15.75H3.6C2.85442 15.75 2.25 15.1456 2.25 14.4V3.6C2.25 2.85442 2.85442 2.25 3.6 2.25Z"
                  fill={`${isCutOut ? "#2962D9" : "#000000"}`}
                />
              </svg>
              <span className={`pl-2 font-bold ${isCutOut && "text-blue-600"}`}>
                Cut-Outs
              </span>
              {isCutOut && (
                <button
                  className="ml-auto font-bold"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCutOut(false);
                    setSegmentTypes("Click");
                    setUploadClick(true);
                  }}
                >
                  Close
                </button>
              )}
            </div>
            {isCutOut === false && visibleStickerHover && (
              <Animate isMounted={isCutOutMounted}>
                <p className="my-2 text-xs opacity-70">See Cut-outs</p>
              </Animate>
            )}
            {isCutOut && (
              <>
                <Animate isMounted={isCutOut}>
                  <p className="my-1 text-xs text-blue-700">See Cut-outs</p>
                  <div className="overflow-y-auto h-[30rem] text-center">
                    {stickers.map((el: HTMLCanvasElement, i) => (
                      <img
                        key={i}
                        className={`sticker m-5 max-w-[75%] max-h-20 md:max-h-24 lg:max-h-28 xl:max-h-32 cursor-pointer inline hover:opacity-100 ${
                          i === activeSticker ? "sticker-select" : ""
                        }`}
                        alt="sticker"
                        src={el.toDataURL()}
                        onClick={(e) => handleStickerClick(i)}
                      />
                    ))}
                  </div>
                </Animate>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SegmentDrawer;
