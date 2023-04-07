import React, { useContext } from "react";
import AppContext from "./hooks/createContext";

interface LoadingModalProps {
  handleResetState: () => void;
}

const LoadingModal = ({ handleResetState }: LoadingModalProps) => {
  const {
    showLoadingModal: [showLoadingModal, setShowLoadingModal],
    image: [image, setImage],
    isErasing: [isErasing, setIsErasing],
    eraserText: [eraserText, setEraserText],
  } = useContext(AppContext)!;

  console.log("Loading modal");
  
  return (
    <>
      {showLoadingModal && (
        <div className="modal modal-open">
          <div className="flex flex-col items-center justify-center h-72 modal-box">
            <div className="flex">
              <img className="object-contain w-10 mr-3" src={image?.src} />
              <img className="mr-3" src="../assets/arrow-icn.svg" />
              <img src="../assets/icn-nn.svg" />
              <img className="mr-3" src="../assets/arrow-icn.svg" />
              <img src="../assets/stack.svg" />
            </div>
            <p className="py-4 text-sm md:text-lg">
              {isErasing &&
                eraserText.isEmbedding &&
                "Re-extracting embedding on the erased image"}
              {isErasing &&
                eraserText.isErase &&
                "Masks can be fed into other open source models"}
              {!isErasing && "Extracting an embedding for the image..."}
            </p>
            <div className="loading-bar"></div>
            <button
              className="pt-8 text-lg font-bold"
              onClick={handleResetState}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default LoadingModal;
