import { Timestamp, arrayUnion, collection, doc, getDoc, onSnapshot, query, setDoc, where } from "firebase/firestore"
import { StoreInfo } from "./useCompany"
import { useCallback, useEffect, useState } from "react"
import { AUErrors, ActiveUser, PunchData, PunchType, UserID } from "../au-types"
import { db } from "../App"

export const usePunch = (store: StoreInfo) => {
  const activesQ = query(collection(db, "companies", store.companyId, "actives"), where("storeId", "==", store.storeId))
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([])
  const [updateListener, setUpdateListener] = useState(false)
  const [selectingTypeFor, setSelectingTypeFor] = useState<string | null>(null)

  const getLocalIds: (companyId: string) => Promise<Object> = useCallback(async (companyId: string) => {
    var result = {}
    await getDoc(doc(db, "companies", companyId)).then(snap => {
        if (snap.exists()) {
          let data = snap.data()
          result = data.localIds
          console.log(result)
        }
      })
    return result
  },[store])

  //onDbChange do:
  useEffect(() => {
    let unsub = onSnapshot(activesQ, (snap) => {
      snap.docChanges().forEach(change => {
        let data = change.doc.data()
        if (change.type === "added") {
          setActiveUsers(prev => {
            let newUser = new ActiveUser(change.doc.id, data.punches, data.fullName, data.storeId)
            let list = [...prev, newUser]
            return list
          })
      }
        if (change.type === "modified") {
          setActiveUsers(prev => {
            let newDoc = [...prev]
            let i = newDoc.findIndex((employee) => employee.uid == change.doc.id)
            if (i < 0) { throw "NO INDEX FOUND" }
            newDoc[i].punches = data.punches
            newDoc[i].fullName = data.fullName
            return newDoc
          })
      }
        if (change.type === "removed") {
          setActiveUsers(prev => {
            let newDoc = prev
            const i = newDoc.findIndex(v => {
              return v.uid == change.doc.id
            })
            if (i >= 0) {
              newDoc.splice(i)
            }
            return newDoc
          })
      }
      })
      setUpdateListener(prev => !prev)
    })
    return unsub
  }, [])
  

  const punch = async (user: UserID, type: PunchType): Promise<void> => {
    let selected = activeUsers.find(v => v.uid === user)
    if (selected?.punches[selected.punches.length - 1].type == type) {
      throw AUErrors.Punch.statusNotChanged
    }
    const activeRef = doc(db, "companies", store.companyId, "actives", user)
    const punchData: PunchData = {} as PunchData
    let data = new Date
    data.setSeconds(0, Math.random()*1000)
    punchData.time = Timestamp.fromDate(data)
    switch (type) {
      case PunchType.in:
        punchData.type = PunchType.in
        break;
      case PunchType.out:
        punchData.type = PunchType.out
        break;
      case PunchType.meal:
        punchData.type = PunchType.meal
        break;
      case PunchType.paid:
        punchData.type = PunchType.paid
        break;
    }
    if (punchData.type != null) {
      await setDoc(activeRef, {
        "storeId": store.storeId,
        "punches": arrayUnion(punchData),
      }, { merge: true})
    } else {
      throw AUErrors.Punch.isNull
    }
  }
  return { punch, activeUsers, selectingTypeFor, setSelectingTypeFor, getLocalIds, updateListener  }
}
