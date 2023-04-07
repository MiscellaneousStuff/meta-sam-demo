import React, { useContext } from "react";
import { AnnotationProps } from "./helpers/Interface";
// import useTimeout from "./helpers/useTimeout";
import AppContext from "./hooks/createContext";

interface ToolTipProps {
  isHoverToolTip: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  allText: [allText: any, setAllText: any];
  hasClicked: boolean;
  annotations: Array<AnnotationProps>;
}

const ToolTip = ({
  hasClicked,
  annotations,
  isHoverToolTip: [isHoverToolTip, setIsHoverToolTip],
  allText: [allText, setAllText],
}: ToolTipProps) => {
  const {
    segmentTypes: [segmentTypes, setSegmentTypes],
    clicks: [clicks, setClicks],
    eraserText: [eraserText, setEraserText],
    isErasing: [isErasing, setIsErasing],
    isMultiMaskMode: [isMultiMaskMode, setIsMultiMaskMode],
  } = useContext(AppContext)!;

  // useEffect(() => {
  //   return () => {
  //     clearTimeout(timerRefOne.current);
  //     clearTimeout(timerRefTwo.current);
  //     clearTimeout(timerRefThree.current);
  //   };
  // }, []);

  // const timerRefOne = useRef<any>(null);
  // const timerRefTwo = useRef<any>(null);
  // const timerRefThree = useRef<any>(null);

  const isMobile = window.innerWidth < 768;
  const getText = () => {
    if (isErasing) return null;
    // if (eraserText.isErase)
    //   return "Masks can be input into other open source models, like Erase.";
    // if (eraserText.isEmbedding)
    //   return "Re-extracting an embedding on the erased image.";
    if (isMultiMaskMode) {
      if (clicks?.length)
        return "Move your cursor on or off the image to expand or collapse the layers.";
      return "SAM predicts multiple mask possibilities with a single click. Select an object to start.";
    }
    if (segmentTypes === "Click") {
      if (isMobile) {
        if (hasClicked && clicks?.length)
          return "Cut out the selected object using the Cut-out tool.";
        return "Select any object, SAM is running in the browser.";
      }
      if (hasClicked && clicks?.length)
        return "Cut out the selected object, or try multi-mask mode.";
      if (isHoverToolTip)
        return "When hovering over the image, SAM is running in the browser.";
    }
    if (segmentTypes === "Box") {
      if (annotations.length) return "Refine by adding or subtracting points.";
      return "Draw a box around an object.";
    }
    if (segmentTypes === "All") {
      return allText;
    }
    return null;
  };
  return (
    <>
      <div
        className={`z-40 flex md:h-8 h-14 mt-2 md:mt-6 w-11/12 items-center top-[7%] md:w-full justify-center ${
          !!getText() || "invisible"
        }`}
      >
        <div className="flex gap-1 p-2 bg-blue-200 rounded-lg w-fit">
          {getText()}
        </div>
      </div>
    </>
  );
};

export default ToolTip;
