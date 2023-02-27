import React from 'react'
import { useParams } from 'react-router-dom'
import useEmployee from '../../../../../hooks/useEmployee'

function SingleEmployeeView() {
  const { uid } = useParams()
  const employee = useEmployee(uid!)



  return (
    <>
      <div>{JSON.stringify(employee.info)}</div>
      <button onClick={employee.terminateEmployment}>TERMINATE EMPLOYEE</button>
    </>
    
  )
}

export default SingleEmployeeView