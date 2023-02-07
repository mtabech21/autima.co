import React, { useEffect, useRef, useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./app.scss";
import HomeView from "./pages/home-view/HomeView";
import Topbar from "./topbar/Topbar";
import Sidebar from "./sidebar/Sidebar";
import StoresView from "./pages/stores/StoresView";

function AutimaApp() {
  let appWindow = useRef() as  React.MutableRefObject<HTMLInputElement>;
  const [scrollState, setScrollState] = useState<number>(0);
  useEffect(() => {
    appWindow.current.addEventListener("scroll", () => {
      setScrollState(appWindow.current.scrollTop);
    });
  });
  return (
    <>
      <Sidebar />
      <div ref={appWindow} className={"manager-app"}>
        <div
          className="topbar-container"
          style={
            scrollState > 5
              ? {
                background: "white",
                boxShadow: "0px 0px 2px 0px gray",
                transition: "all 300ms ease",
              }
              : {}}
        >
          <Topbar />
        </div>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/stores" element={<StoresView />} /> 
        </Routes>
      </div>
    </>
  );
}

export default AutimaApp;
