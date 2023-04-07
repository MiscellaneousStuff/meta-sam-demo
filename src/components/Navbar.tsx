import React from "react";
import { MdClose } from "react-icons/md";
import { NavLink, useLocation } from "react-router-dom";

interface NavBarProps {
  resetState: () => void;
}

const NavBar = ({ resetState }: NavBarProps) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const desktopClasses = "mr-10 font-medium text-base";
  const mobileClasses = "mx-8 text-xl font-semibold";
  return (
    <div className="sticky top-0 z-50 flex items-center justify-center w-full bg-white md:border-b-gray-200 md:border-b-[1px] pt-3 pb-3">
      <img
        onClick={() => {
          setIsMenuOpen(true);
        }}
        className="absolute left-0 h-3 mx-6 md:hidden"
        src="/assets/hamburger.svg"
        alt="Mobile Menu"
      />
      <NavLink
        className="mt-2 text-xl font-bold leading-tight md:mx-6 lg:text-2xl"
        onClick={resetState}
        to={"/"}
        style={{ fontWeight: 700 }}
      >
        <div>Segment Anything</div>
        <div className="text-xs font-normal text-center text-gray-500 lg:text-sm md:text-start">
          Research by Meta AI
        </div>
      </NavLink>
      <div className="hidden ml-auto md:flex [&>*]:flex [&>*]:items-center h-full">
        <NavLink
          onClick={resetState}
          className={`hover:underline underline-offset-4 ${desktopClasses} ${
            location.pathname === "/" && "underline text-blue-700"
          }`}
          to={"/"}
        >
          Home
        </NavLink>
        <NavLink
          onClick={resetState}
          className={`hover:underline underline-offset-4 ${desktopClasses} ${
            location.pathname === "/demo" && "underline text-blue-700"
          } `}
          to={"/demo"}
        >
          Demo
        </NavLink>
        <a
          onClick={resetState}
          className={`hover:underline underline-offset-4 ${desktopClasses}`}
          href={"/dataset/index.html"}
        >
          Dataset
        </a>
        <NavLink
          onClick={resetState}
          className={`hover:underline underline-offset-4 ${desktopClasses}`}
          to={
            "https://ai.facebook.com/blog/segment-anything-foundation-model-image-segmentation/"
          }
          target={"_blank"}
        >
          Blog
        </NavLink>
        <NavLink
          onClick={resetState}
          className={`hover:underline underline-offset-4 ${desktopClasses}`}
          to={"https://arxiv.org/abs/2304.02643"}
          target={"_blank"}
        >
          Paper
        </NavLink>
        <a
          className="mr-6 min-w-[24px]"
          href="https://github.com/facebookresearch/segment-anything"
          target={"_blank"}
        >
          <img
            className="hidden h-6 align-baseline md:inline xl:h-auto hover:opacity-50"
            src="/assets/Github.svg"
            alt="Github"
            style={{ fill: "red" }}
          ></img>
        </a>
      </div>
      <div
        className={
          " fixed overflow-hidden z-10 bg-opacity-25 inset-0 transform ease-in-out " +
          (isMenuOpen
            ? " transition-opacity opacity-100 duration-500 translate-x-0  "
            : " transition-all delay-500 opacity-0 translate-x-full  ")
        }
      >
        <section
          className={
            "w-screen right-0 absolute bg-white h-full shadow-[0px_0px_25px_10px_#00000024] delay-400 duration-500 ease-in-out transition-all transform  " +
            (isMenuOpen ? " translate-x-0 " : " translate-x-full ")
          }
        >
          <article className="relative flex flex-col w-screen h-full max-w-lg pb-10 mt-8 space-y-6 overflow-y-scroll">
            <div
              className="flex items-center pb-1 border-b-2"
              onClick={() => {
                setIsMenuOpen(false);
              }}
            >
              <NavLink
                className="mt-2 ml-[22%] text-xl font-bold leading-tight md:mx-6 lg:text-2xl"
                onClick={resetState}
                to={"/"}
                style={{ fontWeight: 700 }}
              >
                <div>Segment Anything</div>
                <div className="text-xs font-normal text-center text-gray-500 lg:text-sm md:text-start">
                  Research by Meta AI
                </div>
              </NavLink>
              <header className="pb-2 pr-4 ml-auto mr-8 text-2xl font-bold">
                <MdClose />
              </header>
            </div>
            <NavLink
              onClick={() => {
                resetState();
                setIsMenuOpen(false);
              }}
              className={`${mobileClasses} hover:underline underline-offset-4 ${
                location.pathname === "/" && "underline text-blue-700"
              }`}
              to={"/"}
            >
              Home
            </NavLink>
            <NavLink
              onClick={() => {
                resetState();
                setIsMenuOpen(false);
              }}
              className={`${mobileClasses} hover:underline underline-offset-4 ${
                location.pathname === "/demo" && "underline text-blue-700"
              }`}
              to={"/demo"}
            >
              Demo
            </NavLink>
            <a
              onClick={() => {
                resetState();
                setIsMenuOpen(false);
              }}
              className={`${mobileClasses} hover:underline underline-offset-4`}
              href={"/dataset/index.html"}
            >
              Dataset
            </a>
            <NavLink
              onClick={() => {
                resetState();
                setIsMenuOpen(false);
              }}
              className={`${mobileClasses} hover:underline underline-offset-4`}
              to={
                "https://ai.facebook.com/blog/segment-anything-foundation-model-image-segmentation/"
              }
              target={"_blank"}
            >
              Blog
            </NavLink>
            <NavLink
              onClick={() => {
                resetState();
                setIsMenuOpen(false);
              }}
              className={`${mobileClasses} hover:underline underline-offset-4`}
              to={"https://arxiv.org/abs/2304.02643"}
              target={"_blank"}
            >
              Paper
            </NavLink>
            <NavLink
              onClick={() => {
                resetState();
                setIsMenuOpen(false);
              }}
              className={`${mobileClasses} hover:underline underline-offset-4`}
              to={"https://github.com/facebookresearch/segment-anything"}
              target={"_blank"}
            >
              <span>Github</span>
            </NavLink>
          </article>
        </section>
        <section
          className="w-screen h-full cursor-pointer "
          onClick={() => {
            setIsMenuOpen(false);
          }}
        ></section>
      </div>
    </div>
  );
};

export default NavBar;
