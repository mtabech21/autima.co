import React, {useState} from "react";
import NewStoreForm from "./components/NewStoreForm";
import { IoAddOutline, IoAddSharp } from "react-icons/io5";
import styles from "./stores.module.scss"
import { BranchID } from "../../../../au-types";
import { FaPlus } from "react-icons/fa";


function StoresView() {
  const [showNewStoreForm, setShowNewStoreForm] = useState(false);

  return (
    <>
    {showNewStoreForm && <div className={styles.newStoreForm}><NewStoreForm closeButtonDo={() => setShowNewStoreForm(false)}/></div>}
      <div style={{ maxHeight: "100%"}}>
        <div className={styles.topbarSafezone} />
        {/*SAFEZONE*/}
        <div className={styles.wrapper}>
          <div style={{fontSize: "2em", fontWeight: "bold"}}>Stores</div>
          <br />
          <div style={{ height: "3px", backgroundColor: "black", borderRadius: "3px" }}></div>
          <br />
          <div className={styles.storesGrid}>

            <StoreCardAdd onClick={() => setShowNewStoreForm(true)}/>
          </div>
        </div>
      </div>
    </>
  );
}

interface StoreCardProps {
  branchID: BranchID
  cityName: string

}

function StoreCard(props: StoreCardProps){
  
  return (
    <div className={styles.storeCard}>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", fontSize: "1em", padding: "1em"}}>
        <div style={{ fontWeight: "bold", width: "100%" }}>{props.branchID}</div>
        <div style={{ width: "100%", textAlign: "end" }}>{props.cityName}</div>
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
