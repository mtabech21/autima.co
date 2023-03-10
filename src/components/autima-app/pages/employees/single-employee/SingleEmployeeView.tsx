import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useEmployee from '../../../../../hooks/useEmployee'
import useTimecards from '../../../../../hooks/useTimecards'
import { PunchData, PunchType, Timecard } from '../../../../../au-types'

function SingleEmployeeView() {
  const { uid } = useParams()
  const employee = useEmployee(uid!)

  useEffect(() => {
    employee.timecards.reload()
  },[employee.info])

  return (
    <>
      <div>{JSON.stringify(employee.info)}</div>
      <button onClick={employee.terminateEmployment}>TERMINATE EMPLOYEE</button>
      <div>
        <h1>TIMECARDS</h1>
        <div>
          {
            employee.timecards.list.map((tc) => (
              <TimecardRow key={tc.date.valueOf()} tc={tc} />
            ))
          }
        </div>
        <div>
          {getIntervalMinutes(employee.timecards.list)}
        </div>
      </div>
    </>
    
  )
}

const TimecardRow = (props: { tc: Timecard }) => {
  
  return (
    <div key={props.tc.date.valueOf()} style={{display: "flex", background: "white", borderBottom: "1px solid black", justifyContent: "space-between", alignItems: "center", padding: "0em 1em"}}>
      <div style={{fontWeight: "bold"}}>{props.tc.date.toDate().toLocaleDateString([], { day: "2-digit", month: "2-digit"})}</div>
                <div style={{display: "flex", width: "100%"}}>{props.tc.punches.map((punch) => (
                  <div key={punch.time.valueOf()} style={{padding: "0em 1em", textAlign: "center"}} >
                    <div>{punch.time.toDate().toLocaleTimeString("en-US",{hour: "numeric", minute: "2-digit"})}</div>
                    <div>{punch.type}</div>
                  </div>
                ))}</div>
      <div style={{fontWeight: "bold"}}>{getDayMinutes(props.tc.punches)}</div>
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

export default SingleEmployeeView