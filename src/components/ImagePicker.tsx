import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { Button, Checkbox } from "react-daisyui";
import { useDropzone } from "react-dropzone";
import PhotoAlbum from "react-photo-album";
import { NavLink } from "react-router-dom";
import photos from "./helpers/photos";
import AppContext from "./hooks/createContext";
export interface ImagePickerProps {
  handleSelectedImage: (
    data: File | URL,
    options?: { shouldDownload?: boolean; shouldNotFetchAllModel?: boolean }
  ) => void;
  showGallery: [showGallery: boolean, setShowGallery: (e: boolean) => void];
}

const LegalModal = () => {
  return (
    <div className="modal" id="my-modal-2">
      <div className="modal-box">
        <div className="flex flex-row justify-between mb-2 text-sm">
          <span>Legal Nav</span>
          <span>
            <a href="#" className="font-bold">
              Close
            </a>
          </span>
        </div>
        <div className="h-40 m-1 bg-black"></div>
        <h3 className="my-2 text-2xl">Legal</h3>
        <p>Legal Text</p>
      </div>
    </div>
  );
};

const ImagePicker = ({
  handleSelectedImage,
  showGallery: [showGallery, setShowGallery],
}: ImagePickerProps) => {
  const [error, setError] = useState<string>("");
  const [isLoadedCount, setIsLoadedCount] = useState(0);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const {
    enableDemo: [enableDemo, setEnableDemo],
  } = useContext(AppContext)!;

  const isMobile = window.innerWidth < 768;

  const downloadAllImageResponses = () => {
    photos.forEach((photo, i) => {
      setTimeout(() => {
        handleSelectedImage(new URL(photo.src, location.origin), {
          shouldDownload: true,
        });
      }, i * 30000);
    });
  };

  const handleAttemptContinue = () => {
    setAcceptedTerms(true);
    setTimeout(() => setEnableDemo(true), 500);
  };

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

  const StarterModal = () => {
    return (
      <div
        className="fixed top-0 bottom-0 left-0 right-0 flex items-center justify-center w-full h-full z-1000 bg-gray-300/90"
        id="modal-terms"
      >
        <div className="modal-box align-middle h-min shadow-[0px_0px_20px_10px_#00000024]">
          <div className="flex justify-between">
            <h4 className="text-lg text-center text-bold">Before you begin</h4>
            <span>
              <a href="#" className="font-bold">
                <NavLink to={"/"}>Close</NavLink>
              </a>
            </span>
          </div>
          <ul className="px-6 pt-6 list-disc">
            <li className="p-1">
              This is a <strong>research demo </strong>and may not be used for
              any commercial purpose
            </li>
            <li className="p-1">
              Any images uploaded will be used solely to demonstrate the Segment
              Anything Model. All images and any data derived from them will be
              deleted at the end of the session.
            </li>
            <li className="p-1">
              Any images uploaded should not violate any intellectual property
              rights or Facebook's Community Standards.
            </li>
          </ul>

          <div className="flex flex-row m-4 md:mt-6 md:mb-6">
            <Checkbox
              className="mt-1 mr-2"
              checked={acceptedTerms}
              onChange={() => handleAttemptContinue()}
            />
            <div>
              <div className="pb-4">
                <span>
                  I have read and agree to the Segment Anything{" "}
                  <NavLink className="underline" to={"/terms"}>
                    Terms and Conditions
                  </NavLink>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const image = ({ imageProps }: { imageProps: any }) => {
    const { src, key, style, onClick } = imageProps;
    return (
      <img
        className="m-0 lg:hover:opacity-50 active:opacity-50"
        key={key}
        src={src}
        style={style}
        onClick={(e: any) => onClick!(e, { index: 0 })}
        onLoad={() => {
          setIsLoadedCount((prev) => prev + 1);
        }}
      ></img>
    );
  };

  return (
    <div className="pt-6 mx-4">
      {!enableDemo && <StarterModal />}
      {/* <Button onClick={downloadAllImageResponses}>
        Download All Image Responses
      </Button> */}
      <div className="flex flex-row py-5 text-sm align-middle md:text-lg">
        {/* <AiOutlineArrowDown className="mr-2" /> */}
        <div className="flex items-center">
          <svg
            width="8"
            height="10"
            viewBox="0 0 8 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2"
          >
            <path
              d="M8 6.32142L4 10L0 6.32142L0.69323 5.67114L3.5 8.25215L3.5 0H4.5L4.5 8.23964L7.29289 5.67114L8 6.32142Z"
              fill="#1C2B33"
            />
          </svg>
          <span>Find a photo in the gallery, or</span>
          <span {...getRootProps()}>
            <input {...getInputProps()} />
            <button className="ml-1 text-blue-700 underline">
              Upload an image
            </button>
          </span>
        </div>
      </div>
      <div
        className={`h-full w-full overflow-y-scroll pb-20 ${
          showGallery ? "fade-in" : ""
        }`}
      >
        <PhotoAlbum
          layout={isMobile ? "columns" : "rows"}
          photos={photos}
          columns={1}
          onClick={(e: any) => handleSelectedImage(e.target.src)}
          renderPhoto={image}
        />
      </div>
    </div>
  );
};

export default ImagePicker;
