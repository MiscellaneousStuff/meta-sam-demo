import { RefObject } from "react";

interface canvasScaleInitializerProps {
  width: number;
  height: number;
  containerRef: RefObject<HTMLDivElement>;
  shouldFitToWidth?: boolean;
}

interface canvasScaleResizerProps {
  width: number;
  height: number;
  containerWidth: number;
  containerHeight: number;
  shouldFitToWidth?: boolean;
}

const canvasScaleInitializer = ({
  width,
  height,
  containerRef,
  shouldFitToWidth,
}: canvasScaleInitializerProps) => {
  const containerWidth = containerRef.current?.offsetWidth || width;
  const containerHeight = containerRef.current?.offsetHeight || height;
  return canvasScaleResizer({
    width,
    height,
    containerWidth,
    containerHeight,
    shouldFitToWidth,
  });
};

const canvasScaleResizer = ({
  width,
  height,
  containerWidth,
  containerHeight,
  shouldFitToWidth,
}: canvasScaleResizerProps) => {
  const isMobile = window.innerWidth < 768;
  let scale = 1;
  const xScale = containerWidth / width;
  const yScale = containerHeight / height;
  if (isMobile) {
    scale = Math.max(xScale, yScale);
  } else {
    if (shouldFitToWidth) {
      scale = xScale;
    } else {
      scale = Math.min(xScale, yScale);
    }
  }
  const scaledWidth = scale * width;
  const scaledHeight = scale * height;
  const scalingStyle = {
    transform: `scale(${scale})`,
    transformOrigin: "left top",
  };
  const scaledDimensionsStyle = {
    width: scaledWidth,
    height: scaledHeight,
  };
  return {
    scalingStyle,
    scaledDimensionsStyle,
    scaledWidth,
    scaledHeight,
    containerWidth,
    containerHeight,
  };
};

export { canvasScaleInitializer, canvasScaleResizer };
