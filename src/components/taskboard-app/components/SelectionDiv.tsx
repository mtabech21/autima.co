import { IoPizza } from "react-icons/io5";
import { MdOutlinePaid } from "react-icons/md";
import { RiLoginCircleLine, RiLogoutCircleRLine } from "react-icons/ri";
import React, { forwardRef, useRef, useState } from "react";
import { useEffect, useContext } from "react";
import style from "../clockapp.module.scss"
import { PunchType, PunchTypeFrom } from "../../../au-types";
import { taskboardContext } from "../TaskboardApp";

interface SelectionProps {
  type: PunchType
}

const Selection = forwardRef((props: SelectionProps, ref) => {
  const session = useContext(taskboardContext)
  

  const iconClockIn = <RiLoginCircleLine className={style.clockSelectIcon} />;
  const iconClockOut = <RiLogoutCircleRLine className={style.clockSelectIcon} />;
  const iconMeal = <IoPizza className={style.clockSelectIcon} />;
  const iconPaid = <MdOutlinePaid className={style.clockSelectIcon} />;

  return (
    <form onSubmit={(e) => {
      e.preventDefault()
      let uid = session.clock.selectingTypeFor
      if (uid == null) { throw "NO UID" }
      session.clock.punch(uid, props.type)
      session.clock.setSelectingTypeFor(null)
    }}
    className={style.clockSelectType}>
      <button
      ref={ref as React.LegacyRef<HTMLButtonElement>}
      className={style.clockSelectType}
        onMouseOver={(e) => {
          e.currentTarget.focus()

        }}
    >
      <div>{props.type == 0 ? "Clock In" : props.type == 1 ? "Clock Out" : props.type == 2 ? "Meal Break" : props.type == 3 ? "Paid Break" : "ERROR"}</div>
      {props.type === PunchType.in
        ? iconClockIn
        : props.type === PunchType.out
        ? iconClockOut
        : props.type === PunchType.meal
        ? iconMeal
        : props.type === PunchType.paid
        ? iconPaid
        : null}
    </button>
    </form>
  );
});

//@ts-ignore
const SelectionDiv = (props) => {
  const session = useContext(taskboardContext)
  const [selection, setSelection] = useState(0)
  const handleSelection = (e: any) => {
    if (e.key == "ArrowRight") {
      setSelection(prev => {
        if (prev%4 < 3) {
          return (prev + 1)
        } else {
          return (prev + 4)
        }
      })
    } else
    if (e.key == "ArrowLeft") {
      setSelection(prev => {
        if (prev%4 > 0) {
          return (prev - 1)
        } else {
          return (prev + 4)
        }
      })
    } else 
      if (e.key == "Enter") {
        if (refs[selection % 4] != null) {
          //@ts-ignore
          refs[selection % 4].current.submit
        }
      setSelection(prev => {

        return (prev + 4)
      
    })
    } else if (e.key == "x") {
      session.clock.setSelectingTypeFor(null)
    }
    else {
      setSelection(prev => {

          return (prev + 4)
        
      })
    }
    
  }
  useEffect(() => {
    window.addEventListener("keydown", e => handleSelection(e), {once: true})
    if (refs[selection % 4] != null) {
      //@ts-ignore
      refs[selection%4].current.focus()
    }
    return () => {
      window.removeEventListener("keydown",handleSelection,true)
    };
  }, [selection]);
  const refs = [
    useRef<React.LegacyRef<HTMLButtonElement>>(),
    useRef<React.LegacyRef<HTMLButtonElement>>(),
    useRef<React.LegacyRef<HTMLButtonElement>>(),
    useRef<React.LegacyRef<HTMLButtonElement>>()
  ]

  return (
    <div style={{display: "flex", flexDirection: "column", height: "100%"}}>
    <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
      <Selection type={ PunchType.in } ref={refs[0]} />
      <Selection type={ PunchType.out }ref={refs[1]}/>
      <Selection type={ PunchType.meal } ref={refs[2]}/>
      <Selection type={ PunchType.paid } ref={refs[3]}/>
      </div>
      <div className={style.selectOptions}>
        <div onClick={()=> session.clock.setSelectingTypeFor(null)} >Cancel <span style={{ color: "gray"}}>[X]</span></div>
        <div >Request Correction</div>
      </div>
      </div>
  );
};

export default SelectionDiv;
