import { get, onChildChanged, onValue, ref } from "firebase/database";
import { useContext, useEffect, useMemo, useState } from "react";
import { IoPerson } from "react-icons/io5";
import { db, liveDb } from "../../../App";
import { taskboardContext } from "../TaskboardApp";
import style from "../clockapp.module.scss"
import { ActiveUser, PunchType, PunchTypeFrom } from "../../../au-types";
import { PunchData } from "../../../au-types";
import { ProfileInfo } from "../../../hooks/useProfile";
import { doc, getDoc } from "firebase/firestore";


interface LHProps {
  data: PunchData[]
}
function LogHistory(props: LHProps) {

  
  return (
    <div>
      {props.data &&
        props.data.map((punch, i) => (
          <div key={i} className={style.logHistorySingle}>
            <div
              style={{
                backgroundColor: "rgb(20,105,185)",
                borderRadius: "50%",
              }}
            ></div>
            <div>{"•"}</div>
            <div
              style={{
                fontWeight: "bold",
              }}
            >
              {punch.time ? punch.time.toDate().toLocaleTimeString('en-US',{hour: "2-digit", minute: "2-digit"}) : "NaN"}
            </div>
            <div>{"-"}</div>
            <div>{getStringFromType(punch.type)}</div>
          </div>
        ))}
      <br/>
    </div>
  );
}

interface ALDProps {
  data: ActiveUser
}

function ActiveLogDiv(props: ALDProps) {
  const [reveal, setReveal] = useState(false);
  const [profile, setProfile] = useState({} as ProfileInfo)

  const getProfile = async () => {
    var result = {} as ProfileInfo
    let profileRef = doc(db,"profiles", props.data.uid)
    await getDoc(profileRef).then((snap) => {
      if (snap.exists()) {
        result = snap.data() as ProfileInfo
      }
    })
    return result
  }
  
  useEffect(() => {
    getProfile().then((res) => {
      setProfile(res)
    })
  },[])

  function getLatestStatus(): PunchData {
    if (props.data.punches != null) {
      return props.data.punches[props.data.punches.length - 1]
    } else {
      return {} as PunchData
    }
  }

  return (
    <div style={{ borderBottom: "1px solid rgba(136, 136, 136, 0.400)" }}>
      <div
        onClick={() => setReveal((prev) => !prev)}
        className={style.userLogBar}
        style={{ background: reveal ? "whitesmoke" : "white"}}
      >
        <div style={{ display: "flex", alignItems: "center", width: "40%" }}>
          { <IoPerson
            style={{
              fontSize: "1.2em",
              width: "35%",
              color:
              `${getLatestStatus().type === PunchType.in
                ? "green"
                : getLatestStatus().type === PunchType.out
                  ? "gray"
                  : getLatestStatus().type === PunchType.meal
                    ? "orange"
                    : "red"
              }`
            }}
          />}
      
          <div
            style={{
              width: "auto",
              minWidth: "25%",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >{`${profile.firstName} ${profile.lastName}`}</div>
        </div>
        <div
          style={{
            textAlign: "center",
            fontSize: "12px",
            color: "black",
            margin: "auto",
            fontFamily: "monospace",
            padding: "5px",
            borderRadius: "2px",
            backgroundColor: `${getLatestStatus().type === PunchType.in
                ? "green"
                : getLatestStatus().type === PunchType.out
                  ? "gray"
                  : getLatestStatus().type === PunchType.meal
                    ? "orange"
                    : "red"
              }`,
            opacity: 0.8,
          }}
        >
          {getLatestStatus().time ? `${getLatestStatus().time.toDate().toLocaleTimeString('en-US',{hour: "2-digit", minute: "2-digit"})}` : "NaN"}
        </div>
        { <div
          style={{
            fontSize: "14px",
            color: "black",
            margin: "auto",
            fontFamily: "monospace",
            textAlign: "center",
            width: "20%",
          }}
        >
          {getStringFromType(getLatestStatus().type)}
        </div> }
      </div>
      {props.data.punches ? reveal && <LogHistory data={props.data.punches} /> : null }
    </div>
  )

}
function getStringFromType(num: number) {
  switch (num) {
    case 0:
      return "In"
    case 1:
      return "Out"
    case 2:
      return "Meal"
    case 3:
      return "Paid"
    default: 
      return "NaN"
  }
}
export default ActiveLogDiv;
