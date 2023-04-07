import React, { useState } from "react";
import Video from "./Video";

export type ContentProps = {
  color?:
    | "theme"
    | "white"
    | "gray"
    | "blue"
    | "red"
    | "yellow"
    | "green"
    | "darkGray";
  whiteText?: boolean;
  centered?: boolean;
  noteLeft?: string;
  noteRight?: string;
  imageLeft?: string;
  videoLeft?: string;
  imageRight?: string;
  videoRight?: string;
  spaceTop?: boolean;
  spaceBottom?: boolean;
  small?: boolean;
  reorderForMobile?: boolean;
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
};
export const bgColorToClass = {
  theme: "",
  white: "bg-white",
  gray: "bg-gray-100",
  blue: "",
  red: "",
  yellow: "",
  green: "",
  darkGray: "bg-gray-800",
  none: "none",
};
export default function Content({
  color = "white",
  whiteText,
  centered,
  noteLeft,
  noteRight,
  imageLeft,
  videoLeft,
  imageRight,
  videoRight,
  spaceTop,
  spaceBottom,
  small,
  reorderForMobile,
  style,
  className = "",
  children,
}: ContentProps) {
  const bgColor = bgColorToClass[color];
  const textColor = whiteText ? "text-white" : "text-gray-700";
  const padTop = spaceTop ? "pt-20" : "pt-4";
  const padBottom = spaceBottom ? "pb-20" : "pb-4";
  const textSize = small ? "prose-sm" : "prose-lg";

  return (
    <div
      className={`comp_content bg-g flex w-screen justify-center self-stretch ${bgColor} ${textColor} ${
        whiteText ? "color-flip" : ""
      }`}
    >
      <div
        className={`flex flex-1 flex-col md:flex-row box-border max-w-screen-xl items-center justify-start px-5 md:px-20 xl:px-10 ${padTop} ${padBottom}`}
        style={style}
      >
        {(imageLeft || videoLeft || noteLeft) && (
          <div
            className="flex-1 flex-col mr-4 pt-2 items-start justify-start h-full text-sm"
            style={style}
          >
            {!videoLeft && imageLeft && (
              <div className="aspect-w-4 aspect-h-4">
                <img
                  src={imageLeft}
                  alt={noteLeft || ""}
                  className="object-contain"
                  style={style}
                />
              </div>
            )}
            {videoLeft && (
              <div className="aspect-w-4 aspect-h-4">
                <Video
                  url={videoLeft}
                  autoPlay
                  loop
                  muted
                  poster={imageLeft || undefined}
                  controls={false}
                  aspectRatio="fill"
                />
              </div>
            )}
            {noteLeft && <h6>{noteLeft}</h6>}
          </div>
        )}

        <div
          className={`flex-1 ${
            imageLeft || noteLeft || imageRight || noteRight
              ? ""
              : "flex-grow-4"
          } ${
            centered ? "self-centered" : "self-start"
          } max-w-none ${textSize} mx-4 ${textColor} ${className}`}
        >
          {children}
        </div>

        {(imageRight || noteRight) && (
          <div
            className={`flex-1 flex-col ml-4 pt-2 items-start justify-start h-full text-sm ${
              reorderForMobile ? "order-first md:order-none" : ""
            }`}
          >
            {!videoRight && imageRight && (
              <div className="aspect-auto">
                <img
                  src={imageRight}
                  alt={noteRight || ""}
                  className="object-contain mb-2 mt-2"
                />
              </div>
            )}
            {videoRight && (
              <div className="aspect-w-4 aspect-h-4">
                <Video
                  url={videoRight}
                  autoPlay
                  loop
                  muted
                  poster={imageRight || undefined}
                  controls={false}
                  aspectRatio="fill"
                />
              </div>
            )}
            {noteRight && <h6>{noteRight}</h6>}
          </div>
        )}
      </div>
    </div>
  );
}
