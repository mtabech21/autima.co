import { createContext, useEffect, useRef, useState } from "react"
import { TimecardSession } from "../../../../../../hooks/useTimecards"
import styles from "./timecards.module.scss"
import { IoArrowForward, IoCaretDown } from "react-icons/io5"
import { PunchData, PunchType, Timecard } from "../../../../../../au-types"


export const TimecardTable = (props: { session: TimecardSession }) => {
  const [isSelectingaDates, setIsSelectingDates] = useState(false)
  function getHoursStringFromMinutes(minutes: number): string {
    let numberOfHours = String((minutes - minutes % 60) / 60)
    let numberOfMinutes = String(minutes % 60)
    if (numberOfMinutes.length < 2) {
      numberOfMinutes = `0${numberOfMinutes}`
    }
    let result = numberOfHours+":"+numberOfMinutes
    return result
  }

  return (
    <div className={styles.tcTable} >
      <div className={styles.tcTableHeader}>
        <div>Timecard</div>
        <div onClick={() => {setIsSelectingDates(true)}} className={styles.dateInterval}>
          <div>{`${props.session.dateInterval?.from.toLocaleDateString('en-US', { dateStyle: "long" })} - ${props.session.dateInterval?.to.toLocaleDateString('en-US', { dateStyle: "long" })}`}</div>
          <div style={{ color: "rgb(20,105,185)", paddingLeft: ".5em" }}><IoCaretDown /></div>
          {isSelectingaDates && 
            <AutimaDatePicker />
          }
        </div>
        <div className={styles.tcTableHeaderNav}>Manage Timecards<IoArrowForward/></div>
      </div>
      <div className={styles.tcTableColumns}>
        <div>Date</div>
        <div>Activity</div>
        <div>Hours</div>
      </div>
      {
            props.session.list.map((tc,i) => (
              <TimecardRow key={i} tc={tc} />
            ))
      }
      <div className={styles.tcTableBottom}>
        <div style={{ fontWeight: 'bold', fontFamily: "monospace" }}>Total</div>
        <div>{getHoursStringFromMinutes(getIntervalMinutes(props.session.list))}</div>
      </div>
    </div>
  )
}

const TimecardRow = (props: { tc: Timecard}) => {
  const minutes = getDayMinutes(props.tc.punches)
  function getHoursStringFromMinutes(minutes: number): string {
    let numberOfHours = String((minutes - minutes % 60) / 60)
    let numberOfMinutes = String(minutes % 60)
    if (numberOfMinutes.length < 2) {
      numberOfMinutes = `0${numberOfMinutes}`
    }
    let result = numberOfHours+":"+numberOfMinutes
    return result
  }
  return (
    <div key={props.tc.date.valueOf()} className={styles.tcTableRow}>
      <div style={{ fontWeight: "bold" }}>{props.tc.date.toDate().toLocaleDateString("en-US", { day: "2-digit", month: "numeric", weekday: "short" })}</div>
      <div style={{ display: "flex", width: "100%", height: "100%", background: "gray", margin: "0em .5em" }}>

      </div>
      <div style={{ fontWeight: "bold" }}>{`${getHoursStringFromMinutes(minutes)}`}</div>
    </div>
  )
}

function getIntervalMinutes(timecards: Timecard[]): number {
  let total = 0
  timecards.forEach((tc) => {
    total += getDayMinutes(tc.punches)
  })
  return total
}
let date = new Date()
date.getHours()

function getDayMinutes(punches: PunchData[]): number {
  let total = 0
  punches.forEach((punch, i, punches) => {
    switch (punch.type) {
      case PunchType.in: {
        var nextPunch = punches[i + 1]
        if (nextPunch == undefined) { break }
        total += nextPunch.time.toDate().getTime() - punch.time.toDate().getTime()
      }
      case PunchType.out:
        break
      case PunchType.meal:
        break
      case PunchType.paid: {
        var nextPunch = punches[i + 1]
        if (nextPunch == undefined) { break }
        total += nextPunch.time.toDate().getTime() - punch.time.toDate().getTime()
      }
    }
  })
  return Math.round(total/1000/60)
}


const AutimaDatePicker = (props: any) => {

  

  return (
    <div >

    </div>
  )
}