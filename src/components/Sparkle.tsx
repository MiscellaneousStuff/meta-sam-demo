import React, { useContext, useEffect, useState } from "react";
import AppContext from "./hooks/createContext";

const Sparkle = ({ isActive }: { isActive: Boolean }) => {
  const {
    isModelLoaded: [isModelLoaded, setIsModelLoaded],
    segmentTypes: [segmentTypes, setSegmentTypes],
  } = useContext(AppContext)!;
  const FILL = segmentTypes === "All" ? "#2962D9" : "#000";
  const [showStar1, setShowStar1] = useState<Boolean>(false);
  const [showStar2, setShowStar2] = useState<Boolean>(false);
  const [showStar3, setShowStar3] = useState<Boolean>(false);
  const [timers, setTimers] = useState(new Array(6).fill(null));

  const animate = () => {
    setShowStar1(true);
    setTimers([
      setTimeout(() => {
        setShowStar2(true);
        setTimers((prev) => [
          ...prev,
          setTimeout(() => {
            setShowStar3(true);
            setTimers((prev) => [
              ...prev,
              setTimeout(() => {
                setShowStar3(false);
                setTimers((prev) => [
                  ...prev,
                  setTimeout(() => {
                    setShowStar2(false);
                    setTimers((prev) => [
                      ...prev,
                      setTimeout(() => {
                        setShowStar1(false);
                        setTimers((prev) => [
                          ...prev,
                          setTimeout(() => {
                            animate();
                          }, 700),
                        ]);
                      }, 100),
                    ]);
                  }, 150),
                ]);
              }, 800),
            ]);
          }, 100),
        ]);
      }, 150),
    ]);
  };

  const clearTimers = () => {
    for (const timer of timers) {
      clearTimeout(timer);
    }
  };

  useEffect(() => {
    if (!isModelLoaded.allModel) {
      animate();
    } else {
      clearTimers();
    }
    return () => {
      clearTimers();
    };
  }, [isModelLoaded.allModel]);

  return (
    <>
      <svg
        className="w-5 m-1 md:m-0"
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M8 3L5.5 8.5L0 11L5.5 13.5L8 19L10.5 13.5L16 11L10.5 8.5"
          fill={isActive ? FILL : "#000"}
          className={`${
            isModelLoaded.allModel ? "" : "ease-in-out duration-1000"
          }${
            showStar1 || isModelLoaded.allModel ? " opacity-100" : " opacity-0"
          }`}
        />
        <path
          d="M18 14L16.74 16.74L14 18L16.74 19.25L18 22L19.25 19.25L22 18L19.25 16.74"
          fill={isActive ? FILL : "#000"}
          className={`${
            isModelLoaded.allModel ? "" : "ease-in-out duration-1000"
          }${
            showStar2 || isModelLoaded.allModel ? " opacity-100" : " opacity-0"
          }`}
        />
        <path
          d="M18 0L16.74 2.75L14 4L16.74 5.26L18 8L19.25 5.26L22 4L19.25 2.75"
          fill={isActive ? FILL : "#000"}
          className={`${
            isModelLoaded.allModel ? "" : "ease-in-out duration-1000"
          }${
            showStar3 || isModelLoaded.allModel ? " opacity-100" : " opacity-0"
          }`}
        />
      </svg>
    </>
  );
};

export default Sparkle;
