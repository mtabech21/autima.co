import { useContext, useMemo, useState } from "react"
import { CompanyInfo, companyContext } from "../../../../hooks/useCompany"
import styles from "./mybusiness.module.scss"
import { FaRegEdit } from "react-icons/fa"
import { IoArrowForward } from "react-icons/io5"
import { FieldPath } from "firebase-admin/firestore"
import { FieldValue, arrayRemove, arrayUnion, doc, setDoc, updateDoc } from "firebase/firestore"
import { db } from "../../../../App"





const MyBusinessView = () => {
  const company = useContext(companyContext)

  const [showManagePosition, setShowManagePosition] = useState(false) 


  return (
    <>
      <div style={{ background: "white", display: "flex", overflow: "clip"}}>
        <div className={styles.wrapper}>
          <h1>
            My Business
          </h1>
          <div className={styles.infoCard}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <div>General Information</div>
              <div className={styles.editButton}><FaRegEdit /></div>
            </div>
            <div style={{ fontSize: ".8em", padding: "1em", width: "95%" }}>
              <KeyValue k="Company Name" v={company.info.companyName} />
              <KeyValue k="Stores Name" v={company.info.storesName}/>
              <KeyValue k="Address" v={company.info.city} />
              <KeyValue k="Phone Number" v={""}/>
            </div>
          </div>
          <div className={styles.infoCard}>
            <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
              <div>Stores</div>
              <div className={styles.editButton}><IoArrowForward/></div>
            </div>

            <div >
              <div className={styles.positionsBtn} onClick={() => { setShowManagePosition(prev => !prev) }}>Manage Positions</div>
              {showManagePosition &&
                <PositionManager />
              }
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
  )
}

interface KVType {
  k: string,
  v: string,
}

const KeyValue = (props: KVType) => {


  return (
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: ".5em" }}>
      <div>{props.k}:</div>
      <div style={{maxWidth: "50%", fontWeight: "normal"}}>{props.v}</div>
    </div>
  )

}

const PositionManager = () => {
  const company = useContext(companyContext)
  const [input, setInput] = useState("")
  const companyDoc = doc(db,"companies", company.id)
  function addPosition() {
    setDoc(companyDoc, {
      positions: arrayUnion(input)
    }, { merge: true }).then(() => {
      company.reload()
    })
    setInput("")
  }
  function remove(v: string) {
    updateDoc(companyDoc, {
      positions: arrayRemove(v)
    })
    company.reload()
  }
  return (
    <div className={styles.posManager}>
      <div className={styles.posList}>
        {company.info.positions &&
          company.info.positions.map((v, i) => (
            <div key={i}  style={{display: "flex"}}>
              <div >{v}</div>
              <button onClick={()=> remove(v)}>X</button>
            </div>
          ))
        }
      </div>
      <div className={styles.posAdd}>
        <input value={input} onChange={e=> setInput(e.currentTarget.value)}/>
        <button onClick={(e) => { e.preventDefault(); addPosition() }} >Add</button>
      </div>
    </div>
  )
}

export default MyBusinessView