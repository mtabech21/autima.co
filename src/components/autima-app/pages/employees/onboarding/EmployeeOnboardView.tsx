import React, { LegacyRef, useContext, useEffect, useMemo, useRef, useState } from 'react'
import styles from "./employeeonboarding.module.scss"
import { AutimaStore, StoreInfo, companyContext } from '../../../../../hooks/useCompany'
import { addDoc, collection, doc, runTransaction, setDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../../../../App'
import { useNavigate } from 'react-router-dom'
import { update } from 'firebase/database'

interface EmployeeOnboardViewProps {
  
}



const EmployeeOnboardView = () => {
  const company = useContext(companyContext)
  const emailRef = useRef<React.LegacyRef<HTMLInputElement>>()
  const [email, setEmail] = useState("")
  const [localId, setLocalId] = useState("")
  const [selectedStore, setSelectedStore] = useState<string>(company.id)
  const [selectedPosition, setSelectedPosition] = useState<string>("General")
  const nav = useNavigate()

  function onboard() {
    const invitesRef = collection(db, "invites")
    
    if (localId.length < 5) { return }

    addDoc(invitesRef, {
      userEmail: email,
      storeId: selectedStore,
      position: selectedPosition,
      companyId: company.id,
      localId: localId
    }).then(() => {
      company.reload()
      nav(-1)
    })
    

  }

  return (
    <div className={styles.wrapper}>
      <div>{selectedPosition}</div>
      <div>{selectedStore}</div>
      <h1 style={{marginTop: "0em", whiteSpace: "nowrap"}}>Onboard Employee Form</h1>
      <div style={{ color: "rgb(80,105,185)", maxWidth: "70%", userSelect: "none", padding: "1em", borderRadius: "1em", border: "1px solid rgb(80,105,185)", fontSize: ".8em" }}>
      <h3 style={{ margin: "0em", padding: "0em" }}>Important</h3>
        <p style={{ margin: "0em", marginTop: ".8em" }}>Before you submit, make sure the form is <span style={{ textDecoration: "underline" }}>filled out correctly</span>. Recipient will receive a clickable link which will redirect them to your company's onboarding form. On completion, new employee will be automatically added to the selected <span style={{ fontWeight: "bold" }}>branch</span> with the selected <span style={{ fontWeight: "bold" }}>position</span>. {""}</p>
      </div>
      <div>
      <div style={{padding: '.5em'}}>
            <h3>Select Branch:</h3>
            <select value={selectedStore} onChange={(e)=> {setSelectedStore(e.target.value)}} style={{ fontSize: "1.2em", fontFamily: "monospace" }} name="Select">
              {company.storeList.sort((a, b) =>  a.branchId.localeCompare(b.branchId)).map((v, i) => (
                <option key={v.storeId} value={v.storeId}>{`${v.branchId} (${v.cityName})`}</option>
              ))}
              
        </select>
      </div>
      <div style={{padding: '.5em'}}>
        <h3>Select Position:</h3>
        <select  value={selectedPosition} onChange={(e)=> {setSelectedPosition(e.target.value)}} style={{fontSize: "1.2em",fontFamily: "monospace"}} name="Select">
          {company.info.positions?.sort((a, b) =>  a.localeCompare(b)).map((v, i) => (
                <option key={i} value={v}>{`${v}`}</option>
              ))}
        </select>
      </div>
      <div style={{ padding: '.5em' }}>
        <h3>Email Address:</h3>
        <input ref={emailRef.current} value={email} onChange={(e)=> {setEmail(e.currentTarget.value)}} />
        </div>
        <div style={{ padding: '.5em' }}>
        <h3>Employee ID:</h3>
        <input type='number' value={localId} onChange={(e)=> {setLocalId(e.currentTarget.value)}} />
      </div>
        </div>
      <div className={styles.submitForm} onClick={() => onboard()}>Onboard</div>
    </div>
  )
}


export default EmployeeOnboardView