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
  

  const [isFullscreen, setIsFullscreen] = React.useState(false);

  // Watch for fullscreenchange
  useEffect(() => {
    function onFullscreenChange() {
      setIsFullscreen(Boolean(document.fullscreenElement));
    }

    document.addEventListener("fullscreenchange", onFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.exitFullscreen();
    };
  }, []);
  //INPUT REF
  const inputRef = useRef<React.ForwardedRef<HTMLInputElement>>() as React.ForwardedRef<HTMLInputElement>;
  //REACT ROUTER
  const navigate = useNavigate();

  return (
    <div className={style.clock}>
      <div className={style.topStyle}>
        <BackButton action={() => navigate("/")} />
        <Logo />
        <FullScreenButton screenState={isFullscreen} />
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

interface BBProp {
  action: ()=>void
}
function BackButton(props: BBProp) {
  return (
    <button className={style.navButton} onClick={props.action}>
      <IoArrowBack />
    </button>
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
          width: "10em",
        }}
        src={logo}
        alt="logo"
      />
    </div>
  );
}

interface FSBProp {
  screenState: boolean
}
function FullScreenButton(props: FSBProp) {
  return (
    <button
      className={style.navButton}
      onClick={() => {
        !props.screenState
          ? document.body.requestFullscreen()
          : document.exitFullscreen();
      }}
    >
      <IoScanOutline />
    </button>
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

const topStyle = {
  position: "relative",
  backgroundColor: "rgb(20,20,20)",
  minWidth: "100%",
  height: "4em",
  borderRight: "1px solid black",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export default ClockView;
