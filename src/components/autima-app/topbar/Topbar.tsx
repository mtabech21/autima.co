import React from "react";
import {
  AiFillBell,
  AiFillMessage,
  AiFillCalendar,
  AiOutlineFieldTime,
  AiFillCaretRight,
  AiOutlineGlobal,
} from "react-icons/ai";
import style from "./topbar.module.scss";
import { useNavigate } from "react-router-dom";

function ManagerTopBar() {
  const navigate = useNavigate();
  return (
    <div className={style.topbar}>
      <div className={style.onlineStatusTopbar}>
        Online
        <AiOutlineGlobal style={{ height: "20px", color: "green" }} />
      </div>
      <div
        style={{
          fontSize: "14px",
          fontWeight: "500",
          marginRight: "auto",
          display: "flex",
          alignItems: "center",
          justifySelf: "flex-start",
        }}
      >
        <AiFillCaretRight style={{ margin: "10px" }} />
        <p>{"Spirit Halloween (H&M Global)"}</p>
      </div>
      <button>
        <AiFillCalendar />
      </button>
      <button>
        <AiFillMessage />
      </button>
      <button>
        <AiFillBell />
      </button>
      <div
        onClick={() => navigate(`/taskboard/testKey`)}
        className={style.navToClockBtn}
      >
        <AiOutlineFieldTime />
        <h1>-</h1>
      </div>
    </div>
  );
}

export default ManagerTopBar;
