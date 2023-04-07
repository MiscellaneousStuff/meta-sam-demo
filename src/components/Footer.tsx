import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import FeedbackModal from "./FeedbackModal";

const Footer = () => {
  const location = useLocation();
  return (
    <>
      {location.pathname === "/" && (
        <>
          <div className="flex flex-row-reverse items-baseline justify-between mx-8 my-2 xl:my-4">
            <a href="https://ai.facebook.com/">
              <img src="/assets/Meta.svg" alt="Meta AI"></img>
            </a>
            <div>
              {/* <a href="">Terms</a>
  <a className="mx-6" href="">
    Privacy
  </a> */}
              <span className="mr-4">© 2023 Meta</span>
              <a className="mx-4" href="#feedback-modal">
                Feedback
              </a>
              <a
                className="mx-4"
                href="https://www.facebook.com/privacy/policies/cookies/"
                target={"_blank"}
              >
                Cookie Policy
              </a>
              <NavLink className={"mx-4"} to={"/terms"}>
                Terms
              </NavLink>
            </div>
          </div>
          <FeedbackModal />
        </>
      )}
    </>
  );
};

export default Footer;
