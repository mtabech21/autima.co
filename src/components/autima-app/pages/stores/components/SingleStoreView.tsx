import { useNavigate, useParams } from "react-router-dom"
import styles from "../stores.module.scss"
import { useContext } from 'react'
import { IoArrowBack } from "react-icons/io5"
import { companyContext } from "../../../../../hooks/useCompany"



const SingleStoreView = () => {
  const company = useContext(companyContext)
  const nav = useNavigate()
  const { storeId } = useParams()
  return (
    <>
      <div className={styles.topbarSafezone} />
      <div>
        <div className={`${styles.addBtn} ${styles.backBtn}`} onClick={(e) => {
          e.preventDefault()
          nav(-1)

        }}><IoArrowBack />{" "} Stores</div>
        <button onClick={(e) => {
          e.preventDefault()
          company.deleteStore(storeId!)
        }}>Delete Store</button>
      </div>
    </>
  )
}


export default SingleStoreView