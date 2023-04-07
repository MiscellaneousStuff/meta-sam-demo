import React from "react";
import { useCookies } from "react-cookie";

const PointsModal = () => {
  const [toggle, setToggle] = React.useState(true);
  const [cookies, setCookie, removeCookie] = useCookies(["sa-mask-info"]);

  if (cookies["sa-mask-info"]) return null;

  return (
    <div className={`modal ${toggle && "modal-open"}`}>
      <div className="w-96 modal-box">
        <div className="flex flex-row justify-between mb-4 text-sm">
          <span>How to use the selection tool</span>
          <span>
            <a
              href="#"
              className="font-bold text-blue-700"
              onClick={() => {
                setCookie("sa-mask-info", "true");
                setToggle(false);
              }}
            >
              Close
            </a>
          </span>
        </div>
        <video src="../assets/tut-negative-points.mp4" autoPlay playsInline />
        <h3 className="my-2 text-2xl">Add and subtract areas</h3>
        <p>
          Mask areas by adding points. Select <b>Add Area</b>, then select the
          object. Refine the mask by selecting <b>Remove Area</b>, then select
          the area.
        </p>
      </div>
    </div>
  );
};

export default PointsModal;
