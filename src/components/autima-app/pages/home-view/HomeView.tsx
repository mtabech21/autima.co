import React, { useContext } from "react";
import "./home.scss";
import HomeHeader from "./components/HomeHeader";
import { UserContext } from "../../../../UserContext";

function HomeView() {
  const profile = useContext(UserContext);
  
  return (
    <div className={"manager-home-container"}>
      <HomeHeader />
      <div
        style={{
          height: "max-content",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      ></div>
      <div className="grid-cont">
        <div className="grid-div a"></div>
        <div className="grid-div b"></div>
        <div className="grid-div c"></div>
        <div className="grid-div d"></div>
        <div className="grid-div e"></div>
        <div className="grid-div f"></div>
        <div className="grid-div g"></div>
        <div className="grid-div h"></div>
        <div className="grid-div i"></div>
      </div>
    </div>
  );
}

export default HomeView;
