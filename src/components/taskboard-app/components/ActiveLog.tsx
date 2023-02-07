import React from "react";
import ActiveLogDiv from "./ActiveLogDiv";
import style from "../clockapp.module.scss"
import { ActiveUser } from "../../../au-types";


interface Props {
  data: ActiveUser[]
}

function ActiveLog(props: Props) {
  return (
    <>
    <div className={style.userLogHeader}>
      <div>STATUS</div>
    </div>
    <div className={style.activeLogDiv}>
      {props.data && props.data.map((v,i) => (
       <ActiveLogDiv key={i} data={v} />
      ))}
    </div>
    </>
  )}

export default ActiveLog;
