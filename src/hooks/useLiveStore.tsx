import { useCallback, useEffect, useState } from "react"
import { ActiveUser } from "../au-types"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../App"
import { StoreInfo } from "./useCompany"


interface LiveStore {
  activeUsers: ActiveUser[],
  online: boolean,
  sales: {
    today: number,
    yesterday: number,
    wtd: number,
    ytd: number
  },
  goal: {
    today: number,
    yesterday: number,
    wtd: number,
    ytd: number
  }
  reload: () => void
  store: StoreInfo
}


const useLiveStore = (store: StoreInfo): LiveStore => {
  const [reloadListener, setReloadListener] = useState(false)
  function reload() {setReloadListener(prev=>!prev)}
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([] as ActiveUser[])
  const [online, setOnline] = useState(false)
  const [sales, setSales] = useState({} as {
    today: number,
    yesterday: number,
    wtd: number,
    ytd: number
  })
  const [goal, setGoal] = useState({} as {
    today: number,
    yesterday: number,
    wtd: number,
    ytd: number
  })

  

  useEffect(() => {
    getActiveUsers().then(res => {
      setActiveUsers(res as ActiveUser[])
    })
    if (activeUsers.length == 0) {
      setOnline(false)
    } else if (activeUsers.length > 0) {
      setOnline(true)
    }
  }, [activeUsers])
  
  const getActiveUsers: () => Promise<ActiveUser[]> = useCallback(async () => {
    const activesQ = query(collection(db, "companies", store.companyId, "actives"), where("storeId", "==", store.storeId))
    let result = [] as ActiveUser[]
    await getDocs(activesQ).then(snaps => {
      snaps.forEach(snap => {
        let data = snap.data() as ActiveUser
        data.uid = snap.id
        result.push(data)
      })
    })
    
    return result
  },[reloadListener])



  return {activeUsers, online, sales, goal, reload, store}
}

export default useLiveStore