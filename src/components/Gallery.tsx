import React, { PropsWithChildren } from "react";
import { bgColorToClass } from "./Content";
export type GalleryProps = {
  color?: "theme" | "white" | "gray" | "blue" | "red" | "yellow" | "green";
  whiteText?: boolean;
  columns?: number;
  flowVertical?: boolean;
  grid?: boolean;
  fullWidth?: boolean;
  noteLeft?: string;
  noteRight?: string;
  spaceTop?: boolean;
  spaceBottom?: boolean;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

function chunkArray(arr: any, n: number) {
  const chunks = [];
  for (let i = 0; i < arr.length; i += n) {
    chunks.push(arr.slice(i, i + n));
  }
  return chunks;
}

function zipArray(arrays: any) {
  let z = [];
  for (let i = 0, len = arrays[0].length; i < len; i++) {
    let p = [];
    for (let k = 0; k < arrays.length; k++) {
      p.push(arrays[k][i]);
    }
    z.push(p);
  }
  return z;
}

export default function Gallery({
  color,
  whiteText,
  columns = 1,
  flowVertical,
  grid,
  fullWidth,
  noteLeft,
  noteRight,
  spaceTop,
  spaceBottom,
  style,
  children,
}: PropsWithChildren<GalleryProps>) {
  const bgColor = color ? bgColorToClass[color] : `bg-white`;
  const textColor = whiteText ? "text-white" : "text-gray-700";
  const padTop = spaceTop ? "pt-20" : "pt-4";
  const padBottom = spaceBottom ? "pb-20" : "pb-4";

  const itemsCount = React.Children.count(children);
  const isSingle = itemsCount < 2;
  const cols = itemsCount / columns;
  const chunks = isSingle
    ? []
    : flowVertical
    ? chunkArray(children, cols)
    : zipArray(chunkArray(children, React.Children.count(children) / cols));

  return (
    <div
      className={`comp_gallery flex w-screen justify-center self-stretch ${bgColor} ${textColor}`}
      style={style}
    >
      <div
        className={`max-w-screen-xl flex flex-1 flex-row items-center justify-start px-5 md:px-20 xl:px-10 ${padTop} ${padBottom}`}
      >
        {!fullWidth && (
          <div className="hidden md:flex flex-1 flex-col mr-4 pt-4 items-start justify-start h-full text-sm">
            <div className={`opacity-70 ${textColor}`}>{noteLeft || ""}</div>
          </div>
        )}

        <div
          className={`flex flex-col md:flex-row flex-1 flex-grow-4 self-start max-w-none ${
            fullWidth ? "" : "mx-4"
          }`}
        >
          {!isSingle &&
            chunks.map((chs, k) => (
              <div className="flex-col flex-1" key={`group${k}`}>
                {chs.map((c: any, i: number) => (
                  <div
                    className={`p-1 md:p-3 ${
                      grid ? "aspect-[1/1]" : "aspect-auto"
                    }`}
                    key={`img${i}`}
                  >
                    {c}
                  </div>
                ))}
              </div>
            ))}
          {isSingle && <div className="p-1 aspect-auto">{children}</div>}
        </div>

        {!fullWidth && (
          <div className="hidden md:flex flex-1 flex-col ml-4 pb-4 items-start justify-end h-full text-sm">
            <div className={`opacity-70 ${textColor}`}>{noteRight || ""}</div>
          </div>
        )}
      </div>
    </div>
  );
}
