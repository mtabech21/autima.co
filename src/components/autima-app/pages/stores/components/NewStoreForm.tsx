import React from 'react'
import { IoAddOutline, IoClose, IoExit } from 'react-icons/io5'
import styles from "../stores.module.scss"

interface NewStoreFormProps {
  closeButtonDo: ()=>void
}

function NewStoreForm(props: NewStoreFormProps) {
  return (
    <div className={ styles.storeForm}>
      <div className={styles.topForm}>
        <IoClose onClick={props.closeButtonDo} className={styles.closeBtn}/>
        <div className={styles.formTitle}>Add New Branch</div>
        <IoClose className={styles.closeBtn} style={{opacity: "0"}}/>
      </div>
      <form>
      <div className={styles.form}>
        <div className={styles.formInputStores}>
          <div style={{fontWeight: "bold", padding: "1em"}}>Branch ID:</div>
        </div>
        <div className="end">Submit</div>
      </div>
      </form>

    </div>
  )
}

export default NewStoreForm