import React, { PropsWithChildren, useState } from "react";

export type FAQProps = {
  question?: string;
  className?: string;
  children: React.ReactNode;
};

export default function FAQ({
  question,
  className = "",
  children,
}: PropsWithChildren<FAQProps>) {
  const [isCollapsed, setIsCollapsed] = useState(true);

  return (
    <div className={`flex items-center border-t ${className}`}>
      <h6 className="flex-1 py-4">
        <span className="font-bold">{question}</span>
        <div
          className={`transition-all overflow-hidden ${
            isCollapsed ? "max-h-0" : "max-h-80"
          } `}
        >
          {children}
        </div>
      </h6>
      <img
        src={`${
          isCollapsed ? "/assets/circle-plus.svg" : "/assets/circle-minus.svg"
        }`}
        className="w-6 flex-0 m-0"
        onClick={() => setIsCollapsed((prev) => !prev)}
      />
    </div>
  );
}
