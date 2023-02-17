import { useContext } from "react";
import style from "../clockapp.module.scss"
import { taskboardContext } from "../TaskboardApp";
import React from "react";



function Clock() {
  
  const taskboard = useContext(taskboardContext)

  return (
    <div
      style={{
        padding: "20px",
        userSelect: "none",
        paddingBottom: "30px",
        borderBottom: "1px solid rgba(136, 136, 136, 0.226)",
        width: "100%",
        boxSizing: "border-box",
        backgroundColor: "white",
      }}
    >
      <div
        style={{
          color: "rgb(20,105,185)",
          fontSize: "25px",
          fontFamily: "monospace",
          fontWeight: "800",
        }}
      >
        {taskboard.clock.getCurrentDate()}
      </div>
      <div
        style={{
          fontSize: "5em",
          color: "black",
          fontFamily: "monospace",
          fontWeight: "800",
          whiteSpace: "nowrap",
        }}
      >
        {taskboard.clock.currentTime.toLocaleTimeString(["en-US"], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </div>
    </div>
  );
}

export default Clock;
