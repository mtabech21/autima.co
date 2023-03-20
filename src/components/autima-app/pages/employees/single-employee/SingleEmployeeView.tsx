import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useEmployee from '../../../../../hooks/useEmployee'
import useTimecards, { TimecardSession } from '../../../../../hooks/useTimecards'
import { PunchData, PunchType, Timecard } from '../../../../../au-types'
import styles from "./singleemployeeview.module.scss"
import adp from "./autimadatepicker.module.scss"
import { AiOutlineRight } from 'react-icons/ai'
import { IoArrowForward, IoCaretDown } from 'react-icons/io5'

function SingleEmployeeView() {
  const { uid } = useParams()
  const employee = useEmployee(uid!)

  useEffect(() => {
    employee.timecards.reload()
  },[employee.info])

  return (
      <div style={{margin: "2em"}}>
        <h1>{`${employee.info.firstName} ${employee.info.lastName} - (${employee.info.position})`}</h1>
        <div>
          {
            <TimecardTable session={employee.timecards}/>
          }
        </div>
      </div>
    
  )
}

const TimecardTable = (props: { session: TimecardSession }) => {
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
        <div>Store</div>
        <div>Time</div>
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

const TimecardRow = (props: { tc: Timecard }) => {
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
      <div style={{fontWeight: "bold"}}>{props.tc.date.toDate().toLocaleDateString("en-US", { day: "2-digit", month: "numeric", weekday: "short"})}</div>
                <div style={{display: "flex", width: "100%"}}>
                <div key={props.tc.punches[0].time.valueOf()} style={{padding: "0em 1em", textAlign: "center"}} >
                    <div>{props.tc.punches[0].time.toDate().toLocaleTimeString("en-US",{hour: "numeric", minute: "2-digit"})}</div>
        </div>
        <div key={props.tc.punches[props.tc.punches.length - 1].time.valueOf()} style={{padding: "0em 1em", textAlign: "center"}} >
                    <div>{props.tc.punches[props.tc.punches.length - 1].time.toDate().toLocaleTimeString("en-US",{hour: "numeric", minute: "2-digit"})}</div>
                  </div>
                </div>
      <div style={{fontWeight: "bold"}}>{`${getHoursStringFromMinutes(minutes)}`}</div>
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
    <div className={adp.window}>

    </div>
  )
}

export default SingleEmployeeView