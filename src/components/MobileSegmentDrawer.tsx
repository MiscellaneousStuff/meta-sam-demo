import React, { useContext, useEffect, useState } from "react";
import { Button } from "react-daisyui";
import { useSwipeable } from "react-swipeable";
import AppContext from "./hooks/createContext";
import Sparkle from "./Sparkle";

interface MobileSegmentDrawerProps {
  handleResetInteraction: () => void;
  handleMagicErase: () => void;
  handleCreateSticker: () => void;
  userNegClickBool: [
    userNegClickBool: boolean,
    setUserNegClickBool: (e: boolean) => void
  ];
}

const MobileSegmentDrawer = ({
  handleResetInteraction,
  handleMagicErase,
  handleCreateSticker,
  userNegClickBool: [userNegClickBool, setUserNegClickBool],
}: MobileSegmentDrawerProps) => {
  const {
    segmentTypes: [segmentTypes, setSegmentTypes],
    svg: [svg, setSVG],
    stickers: [stickers, setStickers],
    activeSticker: [activeSticker, setActiveSticker],
    isModelLoaded: [isModelLoaded, setIsModelLoaded],
    click: [click, setClick],
    clicks: [clicks, setClicks],
    stickerTabBool: [stickerTabBool, setStickerTabBool],
    allsvg: [allsvg, setAllsvg],
    didShowAMGAnimation: [didShowAMGAnimation, setDidShowAMGAnimation],
    showLoadingModal: [showLoadingModal, setShowLoadingModal],
  } = useContext(AppContext)!;
  const [everythingBool, setEverythingBool] = useState<Boolean>(false);
  const [hasTouchedErase, sethasTouchedErase] = useState<Boolean>(false);

  useEffect(() => {
    setEverythingBool(segmentTypes === "All");
  }, [segmentTypes]);

  useEffect(() => {
    setStickerTabBool(() => false);
  }, [click]);

  const superDefer = (cb: Function) => {
    setTimeout(
      () =>
        window.requestAnimationFrame(() => {
          setTimeout(() => {
            cb();
          }, 0);
        }),
      0
    );
  };

  const handleStickerClick = (i: number) => {
    setActiveSticker(i);
  };

  const handlers = useSwipeable({
    onSwipedUp: () => setStickerTabBool(true),
    onSwipedDown: () => setStickerTabBool(false),
    swipeDuration: 200,
    delta: 5,
    preventScrollOnSwipe: true,
  });

  return (
    <div
      className={`z-40 relative shadow-[0px_0px_20px_10px_#00000024] bg-white ease-in-out duration-300 items-center md:hidden rounded-t-3xl text-center ${
        stickerTabBool ? " -translate-y-72" : ""
      }`}
    >
      <div {...handlers}>
        <div
          className="inline-block w-24 h-1 bg-gray-200 rounded-full"
          onClick={() => setStickerTabBool(!stickerTabBool)}
        ></div>
        <div className="flex w-[18rem] gap-4 mt-2 font-bold mx-auto">
          <button
            className={`flex flex-1 flex-row items-center px-2 py-1 text-sm justify-center ${
              userNegClickBool
                ? "text-gray-700 bg-gray-400"
                : "text-white bg-blue-700"
            } rounded-xl w-max`}
            onClick={() => setUserNegClickBool(false)}
          >
            <svg
              className="w-6 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke={`${userNegClickBool ? "#1C2B33" : "#fff"}`}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span>Add Mask</span>
          </button>
          <button
            className={`flex flex-1 flex-row items-center px-2 py-1 text-sm justify-center rounded-xl w-max ${
              userNegClickBool
                ? "text-white bg-blue-700"
                : "text-gray-700 bg-gray-400"
            } ${!clicks || clicks?.length === 0 ? "disabled" : ""}`}
            onClick={() => setUserNegClickBool(true)}
          >
            <svg
              className="w-6 h-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke={`${userNegClickBool ? "#fff" : "#1C2B33"}`}
              strokeWidth="2"
              strokeLinejoin="round"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>Remove Area</span>
          </button>
        </div>
        <ul className="flex w-screen mb-2 font-semi-bold justify-evenly text-secondary">
          <li>
            <a
              className={`flex flex-col items-center pt-2 ${
                isModelLoaded.allModel === false &&
                "opacity-70 pointer-events-none"
              }`}
              onClick={() => {
                setDidShowAMGAnimation(false);
                superDefer(() => {
                  if (segmentTypes !== "All") {
                    handleResetInteraction();
                    setSegmentTypes("All");
                    setStickerTabBool(() => false);
                  } else {
                    setSegmentTypes("Click");
                  }
                });
              }}
              onMouseDown={() => setEverythingBool((prev) => !prev)}
            >
              <Sparkle isActive={everythingBool} />
              <span
                className={
                  (!isModelLoaded.allModel ? "opacity-60" : "") +
                  (everythingBool ? "text-blue-700" : "#000")
                }
              >
                Everything
              </span>
            </a>
          </li>
          {/* <li>
          <a
            className={`flex flex-col items-center pt-2 ${!svg && "disabled"}`}
            onClick={() => {
              setDidShowAMGAnimation(false);
              handleMagicErase();
              setStickerTabBool(() => false);
              setShowLoadingModal(true);
            }}
            onTouchStart={() => sethasTouchedErase(true)}
            onTouchEnd={() => sethasTouchedErase(false)}
          >
            <svg
              className="w-5 m-1"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.03809 8.59341L8.45669 13.012L6.53991 14.9288C6.14938 15.3193 5.51622 15.3193 5.12569 14.9288L2.1213 11.9244C1.73078 11.5339 1.73078 10.9007 2.1213 10.5102L4.03809 8.59341Z"
                fill={hasTouchedErase ? "#1D4AB2" : "#344854"}
                strokeWidth="2"
              />
              <path
                d="M10.3203 1.41421L15.6363 6.73018L9.34113 13.0253L4.02517 7.70936L10.3203 1.41421Z"
                fill={hasTouchedErase ? "#1D4AB2" : "#344854"}
                strokeWidth="2"
              />
              <rect
                x="5.71484"
                y="15"
                width="14.2855"
                height="1.42855"
                fill={hasTouchedErase ? "#1D4AB2" : "#344854"}
              />
            </svg>
            <span className={hasTouchedErase ? "text-blue-700" : "#fff"}>
              Erase
            </span>
          </a>
        </li> */}
          <li>
            <a
              className="flex flex-col items-center pt-2"
              onClick={() => {
                setStickerTabBool(() => !stickerTabBool);
              }}
            >
              <svg
                className="w-5 m-1"
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.75 7C11.75 5.75 12.3125 5 13.25 5C14.1875 5 14.75 5.75 14.75 7C14.75 8.25 14.1875 9 13.25 9C12.3125 9 11.75 8.25 11.75 7Z"
                  fill={stickerTabBool ? "#1D4AB2" : "#000"}
                />
                <path
                  d="M6.75 5C5.8125 5 5.25 5.75 5.25 7C5.25 8.25 5.8125 9 6.75 9C7.6875 9 8.25 8.25 8.25 7C8.25 5.75 7.6875 5 6.75 5Z"
                  fill={stickerTabBool ? "#1D4AB2" : "#000"}
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M20 11.3431V4C20 1.79086 18.2091 0 16 0H4C1.79086 0 0 1.79086 0 4V16C0 18.2091 1.79086 20 4 20H11.3431C12.404 20 13.4214 19.5786 14.1716 18.8284L18.8284 14.1716C19.5786 13.4214 20 12.404 20 11.3431ZM4 2.5H16C16.8284 2.5 17.5 3.17157 17.5 4V9.75C17.5 9.88807 17.3881 10 17.25 10H14C12.0729 10 10.4641 11.3628 10.0847 13.1772C10.0763 13.2175 10.0412 13.2472 9.99998 13.2472C8.50209 13.2472 7.1324 12.6983 6.08108 11.7907C5.63659 11.4069 4.9555 11.3627 4.54028 11.7779C4.17718 12.141 4.14928 12.7273 4.52354 13.0789C5.8983 14.3704 7.72985 15.1813 9.74991 15.2433C9.88792 15.2476 9.99998 15.3591 9.99998 15.4972L10 17.25C10 17.3881 9.88807 17.5 9.75 17.5H4C3.17157 17.5 2.5 16.8284 2.5 16V4C2.5 3.17157 3.17157 2.5 4 2.5Z"
                  fill={stickerTabBool ? "#1D4AB2" : "#000"}
                />
              </svg>
              <span className={stickerTabBool ? "text-blue-700" : ""}>
                Cut-outs
              </span>
            </a>
          </li>
        </ul>
      </div>
      <div className="absolute w-full bg-white h-[17rem] mt-[-1px]">
        <div className="h-full pb-8 m-5 mb-0 overflow-auto bg-white">
          <Button
            size="md"
            className={`flex flex-row-reverse normal-case border-none mt-5 mx-auto bg-gray-300 ${
              !everythingBool && !svg && "disabled"
            }`}
            onClick={(e) => {
              e.currentTarget.blur();
              handleCreateSticker();
            }}
          >
            <div className="leading-normal text-black active:text-white hover:text-white">
              {everythingBool ? "Cut out all objects" : "Create cut-out"}
            </div>
            <svg
              className="mr-2"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.7895 0H13.4737V2.52632H16V4.21053H13.4737V6.73684H11.7895V4.21053H9.26316V2.52632H11.7895V0ZM3.36842 2.52632H6.73684V4.21053H3.36842C2.44211 4.21053 1.68421 4.96842 1.68421 5.89474V12.6316C1.68421 13.5663 2.44211 14.3158 3.36842 14.3158H10.1053C11.04 14.3158 11.7895 13.5663 11.7895 12.6316V9.26316H13.4737V12.6316C13.4737 14.4926 11.9663 16 10.1053 16H3.36842C1.50737 16 0 14.4926 0 12.6316V5.89474C0 4.03368 1.50737 2.52632 3.36842 2.52632Z"
                fill="black"
              />
            </svg>
          </Button>
          <div className="mt-5">
            {stickers.map((el: HTMLCanvasElement, i) => (
              <img
                key={i}
                className={`m-5 max-w-[75%] max-h-20 md:max-h-24 lg:max-h-28 xl:max-h-32 cursor-pointer inline hover:opacity-100 ${
                  stickers.length === 1 || i === activeSticker
                    ? "sticker-select"
                    : ""
                }`}
                alt="cutout"
                src={el.toDataURL()}
                onClick={(e) => handleStickerClick(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileSegmentDrawer;
