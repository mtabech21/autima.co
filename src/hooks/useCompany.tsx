import { QueryConstraint, addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where } from "firebase/firestore"
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react"
import { db } from "../App"
import { useNavigate } from "react-router-dom"
import { FieldPath, FieldValue } from "firebase-admin/firestore"
import { remove } from "firebase/database"
import { EmployeeAlertType } from "../components/autima-app/pages/employees/EmployeesView"

export interface AutimaStore {
  storeId: string
  branchId: string
  cityName: string
}
export enum AutimaAlert {

}

export interface CompanyInfo {
  companyName: string,
  storesName: string,
  city: string,
  localIds: {}
  positions: string[]
}

export interface StoreInfo {
  storeId: string,
  companyId: string,
  branchId: string,
  cityName: string,
  address?: string,
}
export interface AutimaEmployee {
  uid: string,
  companyId: string,
  storeId: string,
  branchId: string,
  firstName: string,
  lastName: string,
  position: string,
  alerts: EmployeeAlertType[]
}

export type Invite = {
  companyId: string,
  storeId: string,
  position: string,
  userEmail: string
  localId: string
}

export type CompanyContext = {
  id: string,
  stores: AutimaStore[]
  employees: AutimaEmployee[],
  storeList: StoreInfo[],
  pendingInvites: Invite[]
  info: CompanyInfo
  useCreateStore: () => {
    branchId: string;
    setBranchId: React.Dispatch<React.SetStateAction<string>>;
    refs: {
        branchName: React.MutableRefObject<React.LegacyRef<HTMLInputElement> | undefined>;
    };
    submit: () => void;
  }
  deleteStore: (storeId: string) => void
  reload: () => void

}

export const useCompany = (id: string): CompanyContext => {
  const [errors, setErrors] = useState([] as Error[])
  const [reloadListener, setReloadListener] = useState(false)
  const reload = () => { setReloadListener(prev => !prev) }
  
  const nav = useNavigate()

  const companyDoc = doc(db,"companies", id)
  

  const [stores, setStores] = useState([] as AutimaStore[])
  const [employees, setEmployees] = useState([] as AutimaEmployee[])
  const [storeList, setStoreList] = useState([] as StoreInfo[])
  const [info, setInfo] = useState({} as CompanyInfo)
  const [pendingInvites, setPendingInvites] = useState([] as Invite[])
  

  const deleteStore = (storeId: string) => {
    deleteDoc(doc(db, "stores", storeId!)).then(() => {
      nav(-1)
    })
    reload()
  }

  useEffect(() => {
    getInfo().then(res => {
      setInfo(res as CompanyInfo)
    })
    getStores().then(res => {
      setStores(res as AutimaStore[])
    })
    getEmployees().then(res => {
      setEmployees(res as AutimaEmployee[])
    })
    listStores().then(res => {
      setStoreList(res as StoreInfo[])
    })
    getPendingInvites().then(res => {
      setPendingInvites(res as Invite[])
    })
    return 
  }, [reloadListener])
  
  const getStores: () => Promise<AutimaStore[]> = useCallback(async () => {
    const storesQ = query(collection(db, "stores"), where("companyId", "==", id))
    var result: AutimaStore[] = []
    await getDocs(storesQ).then(snap => {
      
      snap.forEach(sn => {
      
        let data = sn.data()
        result.push({
          branchId: data.branchId,
          cityName: data.cityName,
          storeId: sn.id
        })
      })
    })
    return result
 
  }, [id])

  const getPendingInvites: () => Promise<Invite[]> = useCallback(async () => {
    const invitesQ = query(collection(db,"invites"), where("companyId","==",id))
    var result: Invite[] = []
    await getDocs(invitesQ).then((snap) => {
      
      snap.forEach(sn => {
      
        let data = sn.data()
        result.push({
          companyId: data.companyId,
          storeId: data.storeId,
          position: data.position,
          userEmail: data.userEmail,
          localId: data.localId
        })
      })
    })
    return result
  },[reloadListener])

  const listStores = useCallback(async (): Promise<StoreInfo[]> => {
    var results: StoreInfo[] = [{
      companyId: id,
      storeId: id,
      branchId: "Company",
      cityName: ""
    }]
    await getStores().then(v=>v.forEach(store => {
        results.push({
          storeId: store.storeId,
          branchId: store.branchId,
          cityName: store.cityName
        } as StoreInfo)
    })
    );
    return results
  },[stores])
  
  const getEmployees: (stores?: string[]) => Promise<AutimaEmployee[]> = useCallback(async (store?: string[]) => {
    var result: AutimaEmployee[] = []
    const queryC: QueryConstraint[] = []
    if (store != null) {
      stores.forEach(store => {
        queryC.push(where("storeId","==",store))
      });
    }
    const employeesQ = query(collection(db, "companies", id, "employees"), ...queryC )
    await getDocs(employeesQ).then(snap => {
      snap.forEach(sn => {
        let data = sn.data()
        result.push({
          uid: sn.id,
          storeId: data.storeId,
          branchId: data.branchId,
          companyId: data.companyId,
          firstName: data.firstName,
          lastName: data.lastName,
          position: data.position,
          alerts: []
        })
      })

    })
    return result
  }, [id])

  const getInfo: () => Promise<CompanyInfo> = useCallback(async () => {
    var result = {} as CompanyInfo
    await getDoc(companyDoc).then((snap) => {
      result = snap.data() as CompanyInfo
    })
    return result
  }, [id])

  return {id, stores, storeList , employees, info, useCreateStore, deleteStore, reload, pendingInvites}
}
/////////////////
/////////////////
/////////////////
/////////////////






export function businessUID(from: string) {
  return `${from}b`
}


interface UpdateType {
  positions: {
    add(position: string): void;
    remove(position: string): void;
}
}




const useCreateStore = () => {
  const company = useContext(companyContext)
  const [branchId, setBranchId] = useState("")

  const refs = {
    branchName: useRef<React.LegacyRef<HTMLInputElement>>()
  }

  function submit() {
    let newBranch = collection(db, "stores")
    addDoc(newBranch, {
      companyId: company.id,
      branchId: branchId,
      cityName: "Montreal, QC"
    }).then(() => {
      company.reload()
    })
  }

  return {branchId, setBranchId, refs, submit}
}

export const companyContext = createContext<CompanyContext>({} as CompanyContext)

export default useCompany