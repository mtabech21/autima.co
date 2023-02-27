import { doc, getDoc, setDoc } from "firebase/firestore"
import { useCallback, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { db } from "../App"
import { ProfileInfo } from "./useProfile"
import { StoreInfo } from "./useCompany"




interface EmployeeContext {
  reload: () => void,
  info: ProfileInfo,
  store: StoreInfo,
  terminateEmployment: () => void

}



const useEmployee = (uid: string): EmployeeContext => {
  const [errors, setErrors] = useState([] as Error[])
  const [reloadListener, setReloadListener] = useState(false)
  const reload = () => { setReloadListener(prev => !prev) }

  const nav = useNavigate()

  const [info, setInfo] = useState({} as ProfileInfo)
  const [store, setStore] = useState({} as StoreInfo)

  useEffect(() => {
    getEmployee().then(res => {
      setInfo(res)
    })
  }, [reloadListener])

  const getEmployee: () => Promise<ProfileInfo> = useCallback(async () => {
    const employeeDoc = doc(db, "profiles", uid)
    
    var result = {} as ProfileInfo
    await getDoc(employeeDoc).then(snap => {
      if (snap.exists()) {
        result = snap.data() as ProfileInfo
        getStore(result.storeId).then(res => {
          setStore(res)
        })
      }
    })
    return result
  }, [reloadListener])
  const getStore: (id: string) => Promise<StoreInfo> = useCallback(async (id: string) => {
    let result = {} as StoreInfo
    const companyRef = doc(db, "stores", id)
    await getDoc(companyRef).then((snap) => {
      if (snap.exists()) {
        result = snap.data() as StoreInfo
      }
    })
    return result


  }, [reloadListener])

  function terminateEmployment() {
    const employeeDoc = doc(db, "profiles", uid)
    if (window.confirm(`Are you sure you want to terminate ${info.firstName} ${info.lastName}? This action is irreversible.`)) {
      setDoc(employeeDoc, {
        storeId: null,
        companyId: null,
        position: null
      }, { merge: true }).then(() => {
        nav(-1)
      })
    }
  }

  return { reload, info, store, terminateEmployment }

}

export default useEmployee