import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore"
import { app, db } from "../App"
import { getFunctions, httpsCallable } from "firebase/functions"
import { AutimaEmployee, CompanyInfo, Invite, StoreInfo, businessUID } from "./useCompany"
import { User } from "firebase/auth"
import { createContext, useCallback, useEffect, useState } from "react"



export const profileContext = createContext<ProfileContext>({} as ProfileContext)

export type ProfileInfo = {
  firstName: string,
  lastName: string,
  companyId: string
  storeId: string,
  position: string,
  
}

interface ProfileContext {
  user: User,
  setAsBusinessAccount: () => void
  reload: () => void
  info: ProfileInfo
  invites: Invite[]
  joinCompany: (invite: Invite) => void
  store: StoreInfo | null
  company: CompanyInfo | null
}

const useProfile = (user: User): ProfileContext => {
  const [errors, setErrors] = useState([] as Error[])
  const [reloadListener, setReloadListener] = useState(false)
  const reload = () => {
    setReloadListener(prev => !prev)
  }

  const [info, setInfo] = useState({} as ProfileInfo)
  const [company, setCompany] = useState<CompanyInfo | null>(null)
  const [store, setStore] = useState<StoreInfo | null>(null)
  const [invites, setInvites] = useState([] as Invite[])

  useEffect(() => {
    getInfo().then(res => {
      setInfo(res)
    })
    getInvites().then(res => {
      setInvites(res)
    })
  }, [reloadListener])

  const getInfo: () => Promise<ProfileInfo> = useCallback(async () => {
    const profileDoc = doc(db, "profiles", user.uid)
    let result = {} as ProfileInfo
    await getDoc(profileDoc).then((snap) => {
      if (snap.exists()) {
        let data = snap.data()
        result = data as ProfileInfo
        if (result.companyId != null) {
          getCompany(result.companyId).then(res => {
            setCompany(res)
          })
        } else {
          setCompany(null)
        }
        if (result.storeId != null) {
          getStore(result.storeId).then(res => {
            setStore(res)
          })
        } else {
          setStore(null)
        }
      }
    })
    return result
  }, [reloadListener])
  const getCompany: (id: string) => Promise<CompanyInfo> = useCallback(async (id: string) => {
    let result = {} as CompanyInfo
    const companyRef = doc(db, "companies", id)
    await getDoc(companyRef).then((snap) => {
      if (snap.exists()) {
        result = snap.data() as CompanyInfo
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
  const getInvites: () => Promise<Invite[]> = useCallback(async () => {
    const invitesQ = query(collection(db, "invites"), where("userEmail", "==", user.email))
    var result = [] as Invite[]
    await getDocs(invitesQ).then(snap => {
      snap.forEach((v) => {
        result.push(v.data() as Invite)
      })
    })


    return result
  }, [reloadListener])

  async function joinCompany(invite: Invite) {
    const userRef = doc(db, "profiles", user.uid)
    const companyRef = doc(db, "companies", invite.companyId)
    const employeeDoc = doc(companyRef, "employees", user.uid)
      
    await setDoc(userRef, {
      position: invite.position,
        storeId: invite.storeId,
        companyId: invite.companyId,
        
      } as AutimaEmployee, { merge: true }).then( async () => {
        const invitesQ = query(collection(db, "invites"), where("userEmail", "==", user.email))
        await getDocs(invitesQ).then(snap => {
          snap.forEach((v) => {
            deleteDoc(v.ref)
          })
        })
      }).finally(async () => {
        await setDoc(employeeDoc, info)
      })
    updateDoc(companyRef,`localIds.${invite.localId}`, user.uid)
  }
  
  const setAsBusinessAccount = () => {
    const defaultCompany = (): CompanyInfo => {
      return {
        companyName: user.displayName,
        storesName: "Retail Name",
        city: "City, LC",
        positions: [],
        localIds: {
          userId: "§localId",
        }
      } as CompanyInfo
    }
    let newCompanyRef = doc(db, "companies",businessUID(user.uid))
    if (window.confirm("Converting this profile to a business profile is an irreversible action. Are you sure you want to proceed?")) {
      
      let functions = getFunctions(app)
      httpsCallable(functions, "setAsBusiness")({ bool: true }).then(() => {
        setDoc(newCompanyRef, defaultCompany())
        window.location.reload()
      })
     }
  }

  return {user, info, setAsBusinessAccount, reload, invites, joinCompany, store, company }
}

export default useProfile