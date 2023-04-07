import React, { useContext, useState } from "react";
import AppContext from "./hooks/createContext";

interface MobileOptionNavBarProps {
  handleResetInteraction: () => void;
  handleUndoInteraction: () => void;
  handleRedoInteraction: () => void;
  handleResetState: () => void;
  handleImage: (img?: HTMLImageElement) => void;
  userNegClickBool: [
    userNegClickBool: boolean,
    setUserNegClickBool: (e: boolean) => void
  ];
}

const MobileOptionNavBar = ({
  handleResetInteraction,
  handleRedoInteraction,
  handleResetState,
  handleUndoInteraction,
  handleImage,
  userNegClickBool: [userNegClickBool, setUserNegClickBool],
}: MobileOptionNavBarProps) => {
  const {
    svg: [svg, setSVG],
    clicksHistory: [clicksHistory, setClicksHistory],
    segmentTypes: [segmentTypes, setSegmentTypes],
    isErased: [isErased, setIsErased],
    isLoading: [, setIsLoading],
  } = useContext(AppContext)!;
  const [hasTouchedUpload, setHasTouchedUpload] = useState<Boolean>(false);
  return (
    <div className="flex justify-between w-full p-2 md:hidden">
      <div>
        <button
          className={`p-3.5 py-2.5 text-sm font-bold w-min algin-center rounded-l-md bg-white ${
            ((!svg && !isErased) || segmentTypes === "All") && "disabled"
          }`}
          onClick={() => {
            if (isErased) {
              setIsErased(false);
              setIsLoading(true);
              handleImage();
            }
            handleResetInteraction();
            setSegmentTypes("Click");
            setUserNegClickBool(false);
          }}
        >
          Reset
        </button>
        <button
          className={`p-3.5 py-2.5 text-sm w-min font-bold bg-white ${
            (!svg || segmentTypes === "All") && "disabled"
          }`}
          onClick={handleUndoInteraction}
        >
          Undo
        </button>
        <button
          className={`p-3.5 py-2.5 text-sm font-bold w-min rounded-r-md bg-white ${
            (!clicksHistory?.length || segmentTypes === "All") && "disabled"
          }`}
          onClick={handleRedoInteraction}
        >
          Redo
        </button>
      </div>
      <button
        className="flex flex-row p-3.5 py-2.5  text-sm text-center border-none rounded-md bg-white"
        onClick={handleResetState}
        onTouchStart={() => setHasTouchedUpload(true)}
      >
        <svg
          className="pr-2"
          width="24"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M16.3636 13.0909H4.90909V1.63636H16.3636M16.3636 0H4.90909C4.4751 0 4.05888 0.172402 3.75201 0.47928C3.44513 0.786158 3.27273 1.20237 3.27273 1.63636V13.0909C3.27273 13.5249 3.44513 13.9411 3.75201 14.248C4.05888 14.5549 4.4751 14.7273 4.90909 14.7273H16.3636C16.7976 14.7273 17.2138 14.5549 17.5207 14.248C17.8276 13.9411 18 13.5249 18 13.0909V1.63636C18 1.20237 17.8276 0.786158 17.5207 0.47928C17.2138 0.172402 16.7976 0 16.3636 0ZM1.63636 3.27273H0V16.3636C0 16.7976 0.172402 17.2138 0.47928 17.5207C0.786158 17.8276 1.20237 18 1.63636 18H14.7273V16.3636H1.63636M12.24 7.60091L9.99 10.4973L8.38636 8.56636L6.13636 11.4545H15.1364L12.24 7.60091Z"
            fill="#112266"
          />
        </svg>
        <span>Upload</span>
      </button>
    </div>
  );
};

export default MobileOptionNavBar;
