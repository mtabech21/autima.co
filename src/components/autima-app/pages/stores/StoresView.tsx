import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import NewStoreForm from "./components/NewStoreForm";
import { IoAddOutline, IoAddSharp, IoPeople, IoRadio, IoRadioButtonOff, IoRadioButtonOn } from "react-icons/io5";
import styles from "./stores.module.scss"
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { StoreInfo, companyContext } from "../../../../hooks/useCompany";
import useLiveStore from "../../../../hooks/useLiveStore";
import { ActiveUser } from "../../../../au-types";





function StoresView() {
  const company = useContext(companyContext)
  const [showNewStoreForm, setShowNewStoreForm] = useState(false);

  return (
    <>
    
      <div style={{display: "flex"}}>
        <div className={styles.wrapper }>
          <div className={styles.gridHeader}><div>Stores</div><div title="Add Store" className={styles.headerAddBtn} onClick={()=>setShowNewStoreForm(true)}><FaPlus /></div></div>
          <br />
          <div style={{ height: "3px", backgroundColor: "black", borderRadius: "3px" }}></div>
          <br />
          <div className={styles.storesGrid}>
            {company.stores.length > 0 ? 
              company.stores.sort((a, b) =>  a.branchId.localeCompare(b.branchId) ).map((store) =>
                <StoreCard key={store.branchId} store={store} />
              ) :
                <StoreCardAdd onClick={() => setShowNewStoreForm(true)}/>
            }
          </div>
        </div>
        {showNewStoreForm && <div className={styles.newStoreForm}><NewStoreForm closeButtonDo={() => setShowNewStoreForm(false)}/></div>}
      </div>
    </>
  );

}



const StoreCard = (props: {store: StoreInfo}) => {
  const nav = useNavigate()
  const current = useLiveStore(props.store)



  return (
    <div className={styles.storeCard} onClick={() => nav(props.store.storeId)}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "top", fontSize: "1em"}}>
        <div>
          <div style={{ fontWeight: "bold", width: "100%" }}>{props.store.branchId}</div>
          <div>{props.store.cityName}</div>
        </div>
        <div style={{ width: "100%", textAlign: "end", color: `${current.online ? "green" : "red"}` }}>{!current.online ? <IoRadioButtonOn /> : <IsOnline employees={current.activeUsers}/>}</div>
      </div>
    </div>
  )
}

const IsOnline = (props: { employees: ActiveUser[] }) => {
  const [showActive, setShowActive] = useState(false)
  return (
    <div onMouseEnter={()=>setShowActive(false)} onMouseLeave={()=>setShowActive(false)} style={{textAlign: "end"}}>
      <><IoPeople />{showActive && <ActiveList employees={props.employees}/>}</>
      <div>{props.employees.length}</div>
      
    </div>
  )
}

const ActiveList = (props: { employees: ActiveUser[] }) => {
  
  return (
    <div style={{ position: "absolute", textAlign: "start" }}>
      {props.employees.map(emp => (
        <div>{emp.uid}</div>
      ))}
    </div>
  )
}

interface AddStoreProp {
  onClick: () => void
}
function StoreCardAdd(props: AddStoreProp){
  
  return (
    <div className={styles.storeCard} onClick={props.onClick}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", fontSize: "4em", padding: "1em", height: "100%", flexDirection: "column", color: "rgb(20,105,185)" }}>
          <FaPlus />
      </div>
    </div>
  )
}
export default StoresView;
