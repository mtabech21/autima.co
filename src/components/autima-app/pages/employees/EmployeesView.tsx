import React, { useCallback, useContext, useEffect, useState } from 'react'
import styles from "./employeesview.module.scss"
import { FaPlus } from 'react-icons/fa'
import { IoAccessibility, IoAlertCircle, IoAlertOutline, IoOpenOutline, IoSearch } from 'react-icons/io5';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../../../App';
import { useNavigate } from 'react-router-dom';
import { companyContext } from '../../../../hooks/useCompany';

interface EmployeesViewProps {
  
}

enum AutimaAlert {

}

interface AutimaEmployee {
  uid: string,
  storeId: string,
  branchId: string,
  firstName: string,
  lastName: string,
  position: string,
  alerts?: AutimaAlert[]
}


const EmployeesView = () => {
  const company = useContext(companyContext)

  useEffect(() => {
    company.reload()
  }, [])

  const nav = useNavigate()

  return (
    <>
      <div style={{ background: "white", display: "flex", overflow: "clip"}}>
        <div className={styles.wrapper}>
          
          <div className={styles.header}><div>Employees</div><div title="Onboard Employee" className={styles.headerAddBtn} onClick={()=> {nav("onboard")} }><div style={{fontSize: ".5em", color: "black", paddingRight: ".5em"}}>Onboard</div><FaPlus /></div></div>
          <br />
          <div className={`${styles.employeesListWrapper} ${styles.pending}`}>
            <div className={styles.employeesListHeader}>
              <div style={{color: "gray", marginLeft: "1em"}}>Pending Company Invites</div>
              <div style={{marginRight: "1em", color: 'gray'}}>{company.pendingInvites.length} Invites</div>
              
            </div>
            <div className={styles.employeesList}>
              {company.pendingInvites.map((v, i) => (
                <InviteRow uid={""}  position={v.position} key={i} localId={v.localId} branch={v.storeId} fullName={v.userEmail} alerts={[EmployeeAlertType.pending]}/>
              ))}
            </div>
          </div>
          <div className={styles.employeesListWrapper}>
            <div className={styles.employeesListHeader}>
              <div style={{ color: "gray", marginLeft: "1em" }}>Spirit Halloween</div>
              <select placeholder='Stores'>
                <option>All Stores</option>
                <option>{null}</option>
              </select>
              <div className={styles.searchInput}>
                <IoSearch/>
                <input style={{fontSize: "1em", maxWidth: "10em", padding: ".2em .2em" }}/>
              </div>
            </div>
            <div className={styles.employeesList}>
              {company.employees.map((v, i) => (
                <EmployeeRow uid={v.uid}  key={i} position={v.position} alerts={v.alerts} branch={v.branchId} fullName={`${v.firstName} ${v.lastName}`} localId={"000"} />
              ))}
            </div>
          </div>
        </div>
        <div className={styles.rightBarWrapper}>
          <div className={styles.rightBar}>
            <div>Upcoming Tools</div>
            <br />
            <div>...Tool1</div>
            <div>...Tool2</div>
            <div>...Tool3</div>
            <div>...Tool4</div>
            <div>...Tool5</div>
            <br />
            <br />
            <div>Upcoming Tools</div>
            <br />
            <div>...Tool1</div>
            <div>...Tool2</div>
            <div>...Tool3</div>
            <div>...Tool4</div>
            <div>...Tool5</div>
            <br />
            <br />
            <div>Upcoming Tools</div>
            <br />
            <div>...Tool1</div>
            <div>...Tool2</div>
            <div>...Tool3</div>
            <div>...Tool4</div>
            <div>...Tool5</div>
            <br />
          </div>
        </div>
      </div>
    </>
  );
}


interface EmployeeRowProps {
  uid: string,
  localId: string,
  fullName: string,
  branch: string,
  position: string,
  alerts: EmployeeAlertType[]

}

export enum EmployeeAlertType {
  pending = "orange", important = "orangered", notification = "lightgray"
}

const EmployeeRow = (props: EmployeeRowProps) => {
  const nav = useNavigate()
  return (
    
      <div onClick={() => nav(props.uid)} className={styles.employeeRow}>
      <div id={styles["localId"]}>{props.localId}</div>
      <div id={styles["name"]}>{props.fullName}</div>
      <div id={styles["branchId"]}>{props.branch}</div>
      <div id={styles["position"]}>{props.position}</div>
      <div id={styles["alert"]}>
        {props.alerts.map((v) => (
          <IoAlertCircle style={{color: v}}/>
        ))
        }
      </div>
      <div id={styles["link"]}></div>
      </div>
  )

}
const InviteRow = (props: EmployeeRowProps) => {

  return (
    
      <div className={styles.employeeRow}>
      <div id={styles["localId"]}>{props.localId}</div>
      <div id={styles["name"]}>{props.fullName}</div>
      <div id={styles["alert"]}>
        {props.alerts.map((v) => (
          <IoAlertCircle style={{color: v}}/>
        ))
        }
      </div>
      <div id={styles["position"]}>{props.position}</div>
      <div id={styles["branchId"]}>{props.branch}</div>
      <div id={styles["link"]}></div>
      </div>
  )

}

export default EmployeesView