import Konva from "konva";
import React, {
  Profiler,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import * as _ from "underscore";
import Canvas from "./Canvas";
import FeatureSummary from "./FeatureSummary";
import {
  AnnotationProps,
  modelInputProps,
  StageProps,
} from "./helpers/Interface";
import AppContext from "./hooks/createContext";
import ImagePicker from "./ImagePicker";
import LoadingModal from "./LoadingModal";
import MobileOptionNavBar from "./MobileOptionNavBar";
import MobileSegmentDrawer from "./MobileSegmentDrawer";
import PointsModal from "./PointsModal";
import SegmentDrawer from "./SegmentDrawer";
import ToolTip from "./ToolTip";

type Points = { sx: number; sy: number; x: number; y: number };

const Stage = ({
  scale,
  handleResetState,
  handleMagicErase,
  handleImage,
  hasClicked,
  setHasClicked,
  handleSelectedImage,
  image,
  isStandalone,
  model,
}: StageProps) => {
  const {
    click: [click, setClick],
    clicks: [clicks, setClicks],
    clicksHistory: [clicksHistory, setClicksHistory],
    svg: [svg, setSVG],
    stickers: [stickers, setStickers],
    segmentTypes: [segmentTypes, setSegmentTypes],
    isErased: [isErased, setIsErased],
    canvasHeight: [canvasHeight, setCanvasHeight],
    maskImg: [, setMaskImg],
    userNegClickBool: [userNegClickBool, setUserNegClickBool],
    activeSticker: [activeSticker, setActiveSticker],
    isLoading: [isLoading, setIsLoading],
    hasNegClicked: [hasNegClicked, setHasNegClicked],
    stickerTabBool: [stickerTabBool, setStickerTabBool],
    isMultiMaskMode: [isMultiMaskMode, setIsMultiMaskMode],
    svgs: [svgs, setSVGs],
    isHovering: [isHovering, setIsHovering],
    showLoadingModal: [showLoadingModal, setShowLoadingModal],
    predMask: [predMask, setPredMask],
    predMasks: [predMasks, setPredMasks],
    predMasksHistory: [predMasksHistory, setPredMasksHistory],
    isToolBarUpload: [isToolBarUpload, setIsToolBarUpload],
  } = useContext(AppContext)!;
  const [annotations, setAnnotations] = useState<Array<AnnotationProps>>([]);
  const [newAnnotation, setNewAnnotation] = useState<Array<AnnotationProps>>(
    []
  );
  const [prevAnnotaiton, setPrevAnnotation] = useState<Array<AnnotationProps>>(
    []
  );
  const [showGallery, setShowGallery] = useState<boolean>(true);
  const [isHoverToolTip, setIsHoverToolTip] = useState<boolean>(false);
  const [numOfDragEvents, setNumOfDragEvents] = useState<number>(0);
  const [shouldUpdateOnDrag, setShouldUpdateOnDrag] = useState<boolean>(true);
  const [points, setPoints] = useState<Points>();
  const [canvasScale, setCanvasScale] = useState<number>(1);
  const [homepageTimer, setHomepageTimer] = useState<any>();
  const [shouldShowHomepageOverlay, setShouldShowHomepageOverlay] =
    useState(false);
  const DRAG_THRESHOLD = 4;
  const HOMEPAGE_IMAGE = "/assets/gallery/dogs-with-stick.jpg";
  const HOMEPAGE_TIME_LIMIT = 5000;
  const MOBILE_CUTOUT_LIMIT = 30;
  const konvaRef = useRef<Konva.Stage>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [allText, setAllText] = useState<
    string | React.DOMElement<React.DOMAttributes<HTMLElement>, HTMLElement>
  >("");

  useEffect(() => {
    if (isStandalone && model) {
      const url = new URL(HOMEPAGE_IMAGE, location.origin);
      handleSelectedImage(url, {
        // shouldDownload: true,
        shouldNotFetchAllModel: true,
      });
    }
    return () => {
      handleResetState();
    };
  }, [isStandalone, model]);

  useEffect(() => {
    if (isStandalone && clicks && clicks?.length > 0) {
      setHomepageTimer(
        setTimeout(() => {
          setShouldShowHomepageOverlay(true);
        }, HOMEPAGE_TIME_LIMIT)
      );
    } else {
      homepageTimer && clearTimeout(homepageTimer);
    }
    return () => {
      homepageTimer && clearTimeout(homepageTimer);
    };
  }, [isStandalone, clicks]);

  const superDefer = (cb: Function) => {
    setTimeout(
      () =>
        window.requestAnimationFrame(() => {
          setTimeout(() => {
            cb();
          }, 0);
        }),
      0
    );
  };

  const handleCreateSticker = () => {
    if (konvaRef.current === null) return;
    setIsLoading(true);
    superDefer(() =>
      superDefer(() => superDefer(() => superDefer(doHandleCreateSticker)))
    );
  };

  const doHandleCreateSticker = () => {
    if (konvaRef.current === null) return;

    const cropImageFromCanvasTS = (ref: any) => {
      let newCanvas = null;
      try {
        const canvas = ref!.toCanvas().getContext("2d");

        let w = ref.width();
        let h = ref.height();
        const pix: { x: number[]; y: number[] } = { x: [], y: [] };
        const imageData = canvas.getImageData(0, 0, w, h);
        let x;
        let y;
        let index;

        for (y = 0; y < h; y++) {
          for (x = 0; x < w; x++) {
            index = (y * w + x) * 4;
            if (imageData.data[index + 3] > 0) {
              pix.x.push(x);
              pix.y.push(y);
            }
          }
        }
        pix.x.sort(function (a: number, b: number) {
          return a - b;
        });
        pix.y.sort(function (a: number, b: number) {
          return a - b;
        });
        const n = pix.x.length - 1;

        w = 1 + pix.x[n] - pix.x[0];
        h = 1 + pix.y[n] - pix.y[0];
        const cut = canvas.getImageData(pix.x[0], pix.y[0], w, h);

        canvas.width = w;
        canvas.height = h;
        canvas.putImageData(cut, 0, 0);
        newCanvas = document.createElement("canvas");
        newCanvas.width = w;
        newCanvas.height = h;
        newCanvas.getContext("2d")!.putImageData(cut, 0, 0);
      } catch (error) {
        console.log(error);
        return;
      }
      return newCanvas;
    };

    const isMobile = window.innerWidth < 768;
    const konvaClone = konvaRef.current.clone();
    const svgLayer = konvaClone.findOne(".svgMask");
    const pathNodes = svgLayer.find("Path");
    const imageNode = svgLayer.find("Image")[0];
    if (segmentTypes === "All") {
      for (const pathNode of pathNodes) {
        pathNode.attrs.visible = true;
      }
    }
    const newStickers: HTMLCanvasElement[] = [];
    let counter = 0;
    konvaClone.findOne(".annotations").hide();
    konvaClone.findOne(".animateAllSvg").hide();
    svgLayer.globalCompositeOperation("destination-atop");
    imageNode.opacity(-1);
    imageNode.remove();
    for (const pathNode of pathNodes) {
      pathNode.opacity(-1).remove();
    }
    for (const pathNode of pathNodes) {
      counter++;
      svgLayer.add(imageNode);
      svgLayer.add(pathNode);
      const newSticker = cropImageFromCanvasTS(konvaClone);
      if (newSticker) newStickers.push(newSticker);
      imageNode.remove();
      pathNode.remove();
      if (isMobile && counter === MOBILE_CUTOUT_LIMIT) break;
    }
    setActiveSticker(0);
    setStickers([...(newStickers || []), ...(stickers || [])]);
    handleResetInteraction();
    setIsLoading(false);
  };

  const handleMouseDown = (e: any) => {
    if (stickerTabBool) return;
    if (clicksHistory) setClicksHistory(null);
    if (predMasksHistory) setPredMasksHistory(null);
    if (segmentTypes !== "Box") return;
    const { x, y } = e.target.getStage().getPointerPosition();
    setNumOfDragEvents(0);
    if (newAnnotation.length === 0) {
      setNewAnnotation([{ x, y, width: 0, height: 0, clickType: -1 }]);
    }
  };

  const handleMoveToMask = _.throttle((e: any, x: number, y: number) => {
    const click = getClick(e, x, y);
    if (!click) return;
    setClicks([click]);
  }, 15);

  const handleMouseMove = (e: any) => {
    if (stickerTabBool) return;
    const { x, y } = e.target.getStage().getPointerPosition();
    if (segmentTypes === "Click" && shouldUpdateOnDrag && !hasClicked) {
      handleMoveToMask(e, x, y);
    } else if (newAnnotation.length === 1) {
      const sx = newAnnotation[0].x;
      const sy = newAnnotation[0].y;
      setNewAnnotation([getAnnotation({ sx, sy, x, y })]);
      setAnnotations([]);
      if (shouldUpdateOnDrag) {
        setPoints({ sx, sy, x, y });
        setNumOfDragEvents((prevValue) => prevValue + 1);
      }
    }
  };

  useEffect(() => {
    if (shouldUpdateOnDrag) {
      if (numOfDragEvents === DRAG_THRESHOLD && points) {
        setNumOfDragEvents(0);
        handleSegmentByBox(points);
      }
    }
  }, [numOfDragEvents, points]);

  const handleMouseUp = (e: any, shouldSetClick?: boolean) => {
    if (stickerTabBool) return;
    setIsLoading(true);
    setHasClicked(true);
    const { x, y } = e.target.getStage().getPointerPosition();
    switch (segmentTypes) {
      case "Click":
        if (hasClicked || shouldSetClick) {
          if (shouldSetClick) {
            const newClick = getClick(e, x, y) || null;
            if (newClick?.clickType === 0) {
              setHasNegClicked(true);
            }
            setClick(newClick);
          } else {
            handleSegmentByClick(e, x, y);
          }
        }
        break;
      case "Box":
        const sx = newAnnotation[0].x;
        const sy = newAnnotation[0].y;
        const width = x - sx;
        const height = y - sy;
        const isClick = width === 0 && height === 0;
        setNewAnnotation([]);
        if (isClick) {
          // A box must exist before a click is accepted
          if (clicks?.length && clicks[0].width && clicks[0].height) {
            const newClick = getClick(e, x, y);
            const boxPoints = {
              sx: (clicks[0].x * canvasScale) / scale!.scale,
              sy: (clicks[0].y * canvasScale) / scale!.scale,
              x: (clicks[0].width * canvasScale) / scale!.scale,
              y: (clicks[0].height * canvasScale) / scale!.scale,
            };
            adjustPointsToRange(boxPoints, newClick);
            setAnnotations([getAnnotation(boxPoints)]);
            handleSegmentByBox(boxPoints, newClick);
          } else {
            setHasClicked(false);
            setIsLoading(false);
          }
        } else {
          const points = { sx, sy, x, y };
          setPoints(points);
          adjustPointsToRange(points);
          setAnnotations([getAnnotation(points)]);
          handleSegmentByBox(points);
        }
        break;
      default:
        break;
        // return null;
    }
  };

  const handleMouseOut = () => {
    if (stickerTabBool) return;
    if (clicks?.length === 1 && segmentTypes === "Click" && !hasClicked) {
      _.defer(handleResetInteraction);
      setTimeout(handleResetInteraction, 25);
    }
  };

  const getClick = (
    e: any,
    x: number,
    y: number
  ): modelInputProps | undefined => {
    let clickType;
    if (e.evt.button === 0 || !e.evt.button) {
      clickType = 1;
    } else if (e.evt.button === 2) {
      clickType = 0;
    }
    if (clickType === undefined) return;
    if (userNegClickBool) clickType = 0;
    x *= scale!.scale / canvasScale;
    y *= scale!.scale / canvasScale;
    return { x, y, width: null, height: null, clickType };
  };

  const handleSegmentByClick = (e: any, x: number, y: number) => {
    const click = getClick(e, x, y);
    if (!click) return;
    setClicks([...(clicks || []), click]);
  };

  const handleSegmentByBox = (
    { sx, sy, x, y }: Points,
    extraClick?: modelInputProps,
    newerClicks?: modelInputProps[]
  ) => {
    sx *= scale!.scale / canvasScale;
    sy *= scale!.scale / canvasScale;
    x *= scale!.scale / canvasScale;
    y *= scale!.scale / canvasScale;
    const newClick = {
      x: Math.min(sx, x),
      y: Math.min(sy, y),
      width: Math.max(sx, x),
      height: Math.max(sy, y),
      clickType: 2,
    };
    const newClicks = newerClicks || [...(clicks || [])];
    if (extraClick) {
      newClicks.push(extraClick);
    }
    if (newClicks[0] && !newClicks[0].width) {
      newClicks.unshift(newClick);
    } else {
      newClicks[0] = newClick;
    }
    setClicks(newClicks);
  };

  const getAnnotation = ({ sx, sy, x, y }: Points): AnnotationProps => {
    return {
      x: sx,
      y: sy,
      width: x - sx,
      height: y - sy,
      clickType: 2,
    };
  };

  const adjustPointsToRange = (
    points: Points,
    extraClick?: modelInputProps,
    newClicks?: modelInputProps[]
  ) => {
    const range = findClickRange(extraClick, newClicks);
    if (!range || !range.xMin || !range.yMin || !range.xMax || !range.yMax)
      return;
    let { sx, sy, x, y } = points;
    const xMin = Math.min(sx, x);
    const yMin = Math.min(sy, y);
    const xMax = Math.max(sx, x);
    const yMax = Math.max(sy, y);
    if (range.xMin < xMin) {
      if (sx < x) {
        sx = range.xMin;
      } else {
        x = range.xMin;
      }
    }
    if (range.yMin < yMin) {
      if (sy < y) {
        sy = range.yMin;
      } else {
        y = range.yMin;
      }
    }
    if (range.xMax > xMax) {
      if (sx > x) {
        sx = range.xMax;
      } else {
        x = range.xMax;
      }
    }
    if (range.yMax > yMax) {
      if (sy > y) {
        sy = range.yMax;
      } else {
        y = range.yMax;
      }
    }
    points.sx = sx;
    points.sy = sy;
    points.x = x;
    points.y = y;
  };

  const findClickRange = (
    extraClick?: modelInputProps,
    newClicks?: modelInputProps[]
  ) => {
    let xMin;
    let yMin;
    let xMax;
    let yMax;
    const allClicks = newClicks ? newClicks : clicks ? [...clicks!] : null;
    if (!allClicks) return;
    if (extraClick) {
      allClicks.push(extraClick);
    }
    for (let click of allClicks) {
      if (click.width) continue;
      if (click.clickType === 0) continue;
      if (!xMin || click.x < xMin) {
        xMin = click.x;
      }
      if (!yMin || click.y < yMin) {
        yMin = click.y;
      }
      if (!xMax || click.x > xMax) {
        xMax = click.x;
      }
      if (!yMax || click.y > yMax) {
        yMax = click.y;
      }
    }
    xMin = xMin ? (xMin * canvasScale) / scale!.scale : xMin;
    yMin = yMin ? (yMin * canvasScale) / scale!.scale : yMin;
    xMax = xMax ? (xMax * canvasScale) / scale!.scale : xMax;
    yMax = yMax ? (yMax * canvasScale) / scale!.scale : yMax;
    return { xMin, yMin, xMax, yMax };
  };

  const handleResetInteraction = (forceFullReset?: boolean) => {
    setSVG(null);
    setSVGs(null);
    setClick(null);
    setClicks(null);
    setAnnotations([]);
    setNewAnnotation([]);
    setClicksHistory(null);
    setMaskImg(null);
    setUserNegClickBool(false);
    setIsHovering(null);
    setPredMask(null);
    setPredMasks(null);
    setPredMasksHistory(null);
    setIsLoading(false);
    setPoints(undefined);
    if (segmentTypes === "Click" && !forceFullReset) {
      if (!isMultiMaskMode) {
        setHasClicked(false);
      }
    } else {
      setHasClicked(false);
      setIsMultiMaskMode(false);
    }
  };

  const handleMultiMaskMode = () => {
    if (!isMultiMaskMode) {
      if (clicks && clicks.length > 1) {
        handleResetInteraction();
      }
      setHasClicked(true);
    } else if (!clicks) {
      setHasClicked(false);
    }
    setIsMultiMaskMode(!isMultiMaskMode);
  };

  useEffect(() => {
    if (!clicks) {
      setAnnotations([]);
      setNewAnnotation([]);
      setPoints(undefined);
    }
  }, [clicks]);

  const handleUndoInteraction = () => {
    if (clicks?.length === 1 && annotations?.length && segmentTypes === "Box") {
      setPrevAnnotation(annotations);
      setAnnotations([]);
      setNewAnnotation([]);
    }
    if (predMasks?.length && clicks?.length) {
      const newPredMasks = [...predMasks];
      const oldPredMask = newPredMasks.pop();
      const newPredMasksHistory = [...(predMasksHistory || [])];
      setPredMasks(newPredMasks);
      if (oldPredMask) {
        newPredMasksHistory.push(oldPredMask);
      }
      setPredMasksHistory(newPredMasksHistory);
      const newClicks = [...clicks];
      const oldClick = newClicks.pop();
      const newClicksHistory = [...(clicksHistory || [])];
      if (oldClick) {
        newClicksHistory.push(oldClick);
      }
      setClicksHistory(newClicksHistory);
      if (clicks.length === 1) {
        setPredMask(null);
        setHasClicked(false);
        setClicks(null);
        setSVG(null);
        setIsErased(false);
        setMaskImg(null);
      } else {
        setIsLoading(true);
        setPredMask(newPredMasks[newPredMasks.length - 1]);
        if (points) {
          const pointsClone = { ...points };
          adjustPointsToRange(pointsClone, undefined, newClicks);
          setAnnotations([getAnnotation(pointsClone)]);
          handleSegmentByBox(pointsClone, undefined, newClicks);
        } else {
          setClicks(newClicks);
        }
      }
    }
  };

  const handleRedoInteraction = () => {
    if (
      clicksHistory?.length &&
      prevAnnotaiton?.length &&
      segmentTypes === "Box"
    ) {
      setAnnotations(prevAnnotaiton);
      setNewAnnotation([]);
      setPrevAnnotation([]);
    }
    if (predMasksHistory?.length && clicksHistory?.length) {
      setIsLoading(true);
      setHasClicked(true);
      const newPredMasks = [...(predMasks || [])];
      const newPredMasksHistory = [...(predMasksHistory || [])];
      const newPredMask = newPredMasksHistory.pop();
      if (newPredMask) {
        newPredMasks.push(newPredMask);
      }
      setPredMasksHistory(newPredMasksHistory);
      setPredMasks(newPredMasks);
      setPredMask(newPredMasks[newPredMasks.length - 1]);
      const newClicks = [...(clicks || [])];
      const newClicksHistory = [...(clicksHistory || [])];
      const newClick = newClicksHistory.pop();
      if (newClick) {
        newClicks.push(newClick);
      }
      setClicksHistory(newClicksHistory);
      if (points) {
        const pointsClone = { ...points };
        adjustPointsToRange(pointsClone, undefined, newClicks);
        setAnnotations([getAnnotation(pointsClone)]);
        handleSegmentByBox(pointsClone, undefined, newClicks);
      } else {
        setClicks(newClicks);
      }
    }
  };

  return (
    <>
      {isStandalone ? (
        <>
          {image && (
            <div
              className="relative md:w-full md:h-auto"
              ref={containerRef}
              style={
                window.innerWidth < 768
                  ? { height: "calc(100vh/2" }
                  : { height: canvasHeight }
              }
            >
              <Canvas
                konvaRef={konvaRef}
                annotations={annotations}
                newAnnotation={newAnnotation}
                scale={scale}
                handleMouseUp={handleMouseUp}
                handleMouseDown={handleMouseDown}
                handleMouseMove={handleMouseMove}
                handleMouseOut={handleMouseOut}
                containerRef={containerRef}
                hasClicked={hasClicked}
                setCanvasScale={setCanvasScale}
                isStandalone={isStandalone}
                isHoverToolTip={[isHoverToolTip, setIsHoverToolTip]}
                allText={[allText, setAllText]}
              />
              <div
                className={`absolute top-0 right-0 bottom-0 left-0 bg-opacity-70 bg-black flex items-center justify-center text-white text-lg font-bold transition-opacity ${
                  shouldShowHomepageOverlay
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
                id="canvas-overlay"
              >
                <FeatureSummary
                  actions={[{ action: "Demo", actionUrl: "/demo" }]}
                  darkMode
                  centerAlign
                >
                  <h3>Want to keep going?</h3>
                </FeatureSummary>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {image || isToolBarUpload ? (
            <div className="flex items-stretch justify-center flex-1 overflow-hidden stage">
              {showLoadingModal ? (
                <LoadingModal handleResetState={handleResetState} />
              ) : (
                <PointsModal />
              )}
              <SegmentDrawer
                handleResetState={handleResetState}
                handleResetInteraction={handleResetInteraction}
                handleUndoInteraction={handleUndoInteraction}
                handleRedoInteraction={handleRedoInteraction}
                handleMagicErase={handleMagicErase}
                handleCreateSticker={handleCreateSticker}
                handleImage={handleImage}
                userNegClickBool={[userNegClickBool, setUserNegClickBool]}
                handleMultiMaskMode={handleMultiMaskMode}
                showGallery={[showGallery, setShowGallery]}
                hasClicked={hasClicked}
                handleSelectedImage={handleSelectedImage}
              />
              <div className="relative flex flex-col items-center justify-center flex-1 overflow-hidden md:overflow-visible md:px-12 md:py-9">
                <div className="absolute top-0 z-30 flex flex-col items-center justify-center w-full md:relative">
                  <MobileOptionNavBar
                    handleResetInteraction={handleResetInteraction}
                    handleUndoInteraction={handleUndoInteraction}
                    handleRedoInteraction={handleRedoInteraction}
                    handleResetState={handleResetState}
                    handleImage={handleImage}
                    userNegClickBool={[userNegClickBool, setUserNegClickBool]}
                  />
                  <ToolTip
                    isHoverToolTip={[isHoverToolTip, setIsHoverToolTip]}
                    hasClicked={hasClicked}
                    annotations={annotations}
                    allText={[allText, setAllText]}
                  />
                </div>
                <div
                  className="relative flex-1 w-full mb-3 md:my-7"
                  ref={containerRef}
                >
                  <Profiler
                    id="Canvas"
                    onRender={(
                      id, // the "id" prop of the Profiler tree that has just committed
                      phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
                      actualDuration, // time spent rendering the committed update
                      baseDuration, // estimated time to render the entire subtree without memoization
                      startTime, // when React began rendering this update
                      commitTime, // when React committed this update
                      interactions
                    ) => {
                      // console.log(`${id} took ${actualDuration}ms`);
                    }}
                  >
                    <Canvas
                      konvaRef={konvaRef}
                      annotations={annotations}
                      newAnnotation={newAnnotation}
                      scale={scale}
                      handleMouseUp={handleMouseUp}
                      handleMouseDown={handleMouseDown}
                      handleMouseMove={handleMouseMove}
                      handleMouseOut={handleMouseOut}
                      containerRef={containerRef}
                      hasClicked={hasClicked}
                      setCanvasScale={setCanvasScale}
                      isHoverToolTip={[isHoverToolTip, setIsHoverToolTip]}
                      allText={[allText, setAllText]}
                    />
                  </Profiler>
                </div>
                <MobileSegmentDrawer
                  handleResetInteraction={handleResetInteraction}
                  handleMagicErase={handleMagicErase}
                  handleCreateSticker={handleCreateSticker}
                  userNegClickBool={[userNegClickBool, setUserNegClickBool]}
                />
              </div>
            </div>
          ) : !isToolBarUpload ? (
            <div className="flex items-stretch justify-center flex-1 overflow-hidden stage">
              <ImagePicker
                handleSelectedImage={handleSelectedImage}
                showGallery={[showGallery, setShowGallery]}
              />
            </div>
          ) : (
            <></>
          )}
        </>
      )}
    </>
  );
};

export default Stage;
