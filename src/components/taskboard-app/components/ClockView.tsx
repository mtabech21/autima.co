import React, { useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ActiveLog from "./ActiveLog";
import Clock from "./Clock";
import Input from "./Input";
import SelectionDiv from "./SelectionDiv";
import { IoArrowBack, IoScanOutline } from "react-icons/io5";
import { AiOutlineGlobal } from "react-icons/ai";
import { taskboardContext } from "../TaskboardApp";
import logo from "../../../assets/logo_white.svg";
import style from "../clockapp.module.scss"

function ClockView() {
  const session = useContext(taskboardContext);

  window.addEventListener("keypress", (e) => {
    if (inputRef != null) {
      //@ts-ignore
      if ((e.key === "c") && (inputRef.current != null)) {
        //@ts-ignore
        inputRef.current.focus();
      }
    }
  });
  

  //INPUT REF
  const inputRef = useRef<React.ForwardedRef<HTMLInputElement>>() as React.ForwardedRef<HTMLInputElement>;
  //REACT ROUTER

  return (
    <div className={style.clock}>
      <div className={style.topStyle}>
        <Logo />
      </div>
      <ConnectionStatus />
      <Clock />

      <div className={style.userForm}>
        {session.clock.selectingTypeFor ?
          <SelectionDiv />
          :
          <Input ref={inputRef} />
        }
      </div>
      <ActiveLog data={session.clock.activeUsers} />
      <BottomBar />
    </div>
  );
}

function ConnectionStatus() {
  const tb = useContext(taskboardContext)
  return (
    <div style={{ width: "100%" }} className={style.onlineStatusInApp}>
      {tb.online ? "Online" : "Offline"}
      <AiOutlineGlobal style={{ height: "20px", color:  `${tb.online? "green" : "red"}`}} />-
      <span style={{ color: "black", fontWeight: 500 }}>{tb.store.branchId}</span> ({tb.store.cityName})
    </div>
  );
}



function Logo() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <img
        style={{
          height: "100%",
          padding: ".5em"
        }}
        src={logo}
        alt="logo"
      />
    </div>
  );
}

function BottomBar() {
  return (
    <div className={style.reportsLinkDiv}>
      <a
        href="/reports"
        style={{ color: "rgb(20,105,185)", fontWeight: "400" }}
      >
        Manage Timecards
      </a>
    </div>
  );
}



export default ClockView;
