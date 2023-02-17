import React, { useContext } from 'react'
import { IoAddOutline, IoClose, IoExit } from 'react-icons/io5'
import styles from "../stores.module.scss"
import useCreateStore from '../../../../../hooks/useStore'
import { UserContext } from '../../../../../UserContext'

interface NewStoreFormProps {
  closeButtonDo: ()=>void
}



function NewStoreForm(props: NewStoreFormProps) {
  const create = useCreateStore()
  
  return (
    <div className={ styles.storeForm}>
      <div className={styles.topForm}>
        <IoClose onClick={props.closeButtonDo} className={styles.closeBtn}/>
        <div className={styles.formTitle}>Add New Branch</div>
        <IoClose className={styles.closeBtn} style={{opacity: "0"}}/>
      </div>
      <form onSubmit={(e) => { e.preventDefault() }}>
        <div className={styles.form}>
          <div className={styles.prompt}>
            <div style={{paddingRight: "1em"}}>Store ID:</div>
            <input value={create.branchID} onChange={(e)=> {create.setBranchID(e.currentTarget.value)}}/>
          </div>
          <button className={styles.submitBtn} onClick={create.submit}>ADD BRANCH</button>
        </div>
      </form>

    </div>
  )
}

export default NewStoreForm