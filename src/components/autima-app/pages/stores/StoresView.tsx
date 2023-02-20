import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import NewStoreForm from "./components/NewStoreForm";
import { IoAddOutline, IoAddSharp } from "react-icons/io5";
import styles from "./stores.module.scss"
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { companyContext } from "../../../../hooks/useCompany";


interface AutimaStore {
  storeId: string
  branchId: string
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
            {company.stores.length > 0 ? 
              company.stores.sort((a, b) =>  a.branchId.localeCompare(b.branchId) ).map((store, i, arr) =>
                <StoreCard branchId={store.branchId} cityName={store.cityName} storeId={store.storeId} key={i} />
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
    <div className={styles.storeCard} onClick={() => nav(store.storeId)}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1em", padding: "1em"}}>
        <div style={{ fontWeight: "bold", width: "100%" }}>{store.branchId}</div>
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
