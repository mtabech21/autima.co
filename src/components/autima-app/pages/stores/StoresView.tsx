import React, {useCallback, useContext, useEffect, useState} from "react";
import NewStoreForm from "./components/NewStoreForm";
import { IoAddOutline, IoAddSharp } from "react-icons/io5";
import styles from "./stores.module.scss"
import { BranchID } from "../../../../au-types";
import { FaPlus } from "react-icons/fa";
import { Query, collection, getDocs, query, where } from "firebase/firestore";
import { UserContext } from "../../../../UserContext";
import { businessUID } from "../../../../hooks/useStore";
import { db } from "../../../../App";
import { useNavigate } from "react-router-dom";
import { companyContext } from "../../../../hooks/useCompany";


interface AutimaStore {
  storeID: string
  branchID: string
  cityName: string
}



function StoresView() {
  const company = useContext(companyContext)
  const [showNewStoreForm, setShowNewStoreForm] = useState(false);

  return (
    <>
    {showNewStoreForm && <div className={styles.newStoreForm}><NewStoreForm closeButtonDo={() => setShowNewStoreForm(false)}/></div>}
      <div style={{ background: "white", display: "flex", overflow: "clip"}}>
        <div className={styles.wrapper }>
          <div className={styles.gridHeader}><div>Stores</div><div title="Add Store" className={styles.headerAddBtn} onClick={()=>setShowNewStoreForm(true)}><FaPlus /></div></div>
          <br />
          <div style={{ height: "3px", backgroundColor: "black", borderRadius: "3px" }}></div>
          <br />
          <div className={styles.storesGrid}>
            {company.stores ?
              company.stores.sort((a, b) =>  a.branchID.localeCompare(b.branchID) ).map((store, i, arr) =>
                <StoreCard branchID={store.branchID} cityName={store.cityName} storeID={store.storeID} key={i} />
                
              ) :
              <StoreCardAdd onClick={() => setShowNewStoreForm(true)}/>
            }
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



const StoreCard: React.FC<AutimaStore> = (store) => {
  const nav = useNavigate()
  return (
    <div className={styles.storeCard} onClick={() => nav(store.storeID)}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1em", padding: "1em"}}>
        <div style={{ fontWeight: "bold", width: "100%" }}>{store.branchID}</div>
        <div style={{ width: "100%", textAlign: "end" }}>{store.cityName}</div>
      </div>
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
