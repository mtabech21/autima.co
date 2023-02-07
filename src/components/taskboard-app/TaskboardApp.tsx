import style from "./clockapp.module.scss";
import React, { createContext, useContext, useMemo } from "react";
import { useParams } from "react-router-dom";
import ClockView from "./components/ClockView";
import Taskboard from "./components/Taskboard";
import Topmenu from "./components/Topmenu";
import Bottommenu from "./components/Bottommenu";
import  tbLogo from "../../assets/tb_logo_black.svg"
import useTaskboard from "../../hooks/useTaskboard";
import { TaskboardSession } from "../../au-types";

export const taskboardContext = createContext<TaskboardSession>({} as TaskboardSession)

function TaskboardApp() {
  let taskboard = useTaskboard("testKey")
  return (
    <taskboardContext.Provider value={taskboard}>
      <div style={{ width: "100%", display: "flex", padding: '1em', gap: "1em" }}>
        <ClockView />
        <div style={{ display: "flex", width: "75%", flexDirection: "column", gap: "1em" }}>
          <div className={style.tbLogo}>
            <img style={{ height: "3em" }} src={tbLogo} />
            <div style={{ border: "1px solid black" }}>ALPHA v0.0.0.1</div>
          </div>
          <Topmenu />
          <Taskboard />
          <Bottommenu />
        </div>
      </div>
    </taskboardContext.Provider>
  );
}

export default TaskboardApp;
