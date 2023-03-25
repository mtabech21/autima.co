import { useEffect } from "react"
import { ActiveUser, ClockSession, PunchType, Timecard } from "../au-types"
import { StoreInfo } from "./useCompany"
import { useTime } from "./useTime"
import { db } from "../App"
import { Timestamp, deleteDoc, doc, setDoc } from "firebase/firestore"
import { usePunch } from "./usePunch"

export const useClock = (store: StoreInfo): ClockSession => {
  const { currentTime, getCurrentDate } = useTime()
  const { punch, activeUsers, selectingTypeFor, setSelectingTypeFor, updateListener } = usePunch(store)

  useEffect(() => {
    let willPublish = true 
    activeUsers.forEach((user) => {
      if (user.punches[user.punches.length - 1].type != PunchType.out) {
        willPublish = false
      }
    })
    if (willPublish) {
      publish()
    }
  },[updateListener])

  const publish = () => {
    let result = [] as ActiveUser[]
    activeUsers.every((v) => {
      if (!(v.punches[v.punches.length - 1].type == PunchType.out)) {
        result.push(v)
      }
    })
    if (result.length == 0) {
      activeUsers.forEach((user) => {
        const docRef = doc(db,"companies",store.companyId, "employees",user.uid,"timecards", Timestamp.now().valueOf())
        let time = new Date(user.punches[0].time.toDate())
        time.setHours(0, 0, 0, 0)
        
        let date = Timestamp.fromDate(time)
        setDoc(docRef, {
          date: date,
          uid: user.uid,
          punches: user.punches
        } as Timecard, { merge: true }).then(() => {
          deleteDoc(doc(db,"companies",store.companyId,"actives",user.uid))
        })
      })
    } else {
      alert("EMPLOYEES STILL NOT OUT:" + JSON.stringify(result))
    }
  }
  return { currentTime, getCurrentDate, punch, activeUsers, selectingTypeFor, setSelectingTypeFor, publish, updateListener }

}