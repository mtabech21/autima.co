import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import useEmployee from '../../../../../hooks/useEmployee'
import useTimecards, { TimecardSession } from '../../../../../hooks/useTimecards'
import { PunchData, PunchType, Timecard } from '../../../../../au-types'
import styles from "./singleemployeeview.module.scss"
import adp from "./autimadatepicker.module.scss"
import { AiOutlineRight } from 'react-icons/ai'
import { IoArrowForward, IoCaretDown } from 'react-icons/io5'
import { TimecardTable } from './timecards/TimecardTable'

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



export default SingleEmployeeView