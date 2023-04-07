import React, { useContext, useEffect, useState, useRef } from "react";
import AppContext from "./hooks/createContext";

interface SvgMaskProps {
  xScale: number;
  yScale: number;
  svgStr: string;
  id?: string | undefined;
  className?: string | undefined;
}

const SvgMask = ({
  xScale,
  yScale,
  svgStr,
  id = "",
  className = "",
}: SvgMaskProps) => {
  const {
    click: [click, setClick],
    image: [image],
    isLoading: [isLoading, setIsLoading],
    canvasWidth: [, setCanvasWidth],
    canvasHeight: [, setCanvasHeight],
    isErasing: [isErasing, setIsErasing],
    svg: [svg],
    isMultiMaskMode: [isMultiMaskMode, setIsMultiMaskMode],
  } = useContext(AppContext)!;
  const [key, setKey] = useState(Math.random());
  const [boundingBox, setBoundingBox] = useState<DOMRect | undefined>(
    undefined
  );
  const pathRef = useRef<SVGPathElement>(null);
  const getBoundingBox = () => {
    if (!pathRef?.current) return;
    setBoundingBox(pathRef.current.getBBox());
  };
  useEffect(() => {
    if (!isLoading) {
      setKey(Math.random());
    }
    getBoundingBox();
  }, [svg]);
  const bbX = boundingBox?.x;
  const bbY = boundingBox?.y;
  const bbWidth = boundingBox?.width;
  const bbHeight = boundingBox?.height;
  const bbMiddleY = bbY && bbHeight && bbY + bbHeight / 2;
  const bbWidthRatio = bbWidth && bbWidth / xScale;
  return (
    <svg
      className={`absolute w-full h-full pointer-events-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${xScale} ${yScale}`}
      key={key}
    >
      {!isMultiMaskMode && bbX && bbWidth && (
        <>
          <radialGradient
            id={"gradient" + id}
            cx={0}
            cy={0}
            r={bbWidth}
            gradientUnits="userSpaceOnUse"
            gradientTransform={`translate(${bbX - bbWidth / 4},${bbMiddleY})`}
          >
            <stop offset={0} stopColor="white" stopOpacity="0"></stop>
            <stop offset={0.25} stopColor="white" stopOpacity={0.7}></stop>
            <stop offset={0.5} stopColor="white" stopOpacity="0"></stop>
            <stop offset={0.75} stopColor="white" stopOpacity={0.7}></stop>
            <stop offset={1} stopColor="white" stopOpacity="0"></stop>
            <animateTransform
              attributeName="gradientTransform"
              attributeType="XML"
              type="scale"
              from={0}
              to={12}
              dur={`1.5s`}
              begin={".3s"}
              fill={"freeze"}
              additive="sum"
            ></animateTransform>
          </radialGradient>
        </>
      )}
      <clipPath id={"clip-path" + id}>
        <path d={svgStr} />
      </clipPath>
      <filter id={"glow" + id} x="-50%" y="-50%" width={"200%"} height={"200%"}>
        <feDropShadow dx="0" dy="0" stdDeviation="2" floodColor="#1d85bb" />
        <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#1d85bb" />
        <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#1d85bb" />
      </filter>
      <image
        width="100%"
        height="100%"
        xlinkHref={image?.src}
        clipPath={`url(#clip-path${id})`}
      />
      {!click && (!isLoading || isErasing) && (
        <>
          {!isMultiMaskMode && bbWidthRatio && (
            <path
              id={"mask-gradient" + id}
              className={`mask-gradient ${
                bbWidthRatio > 0.5 && window.innerWidth < 768 ? "hidden" : ""
              }`}
              d={svgStr}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0"
              fillOpacity="1"
              fill={`url(#gradient${id})`}
            />
          )}
          <path
            id={"mask-path" + id}
            className="mask-path"
            d={svgStr}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeOpacity=".8"
            fillOpacity="0"
            stroke="#1d85bb"
            strokeWidth="3"
            ref={pathRef}
            filter={`url(#glow${id})`}
          />
        </>
      )}
    </svg>
  );
};

export default SvgMask;
