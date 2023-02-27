
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react"
import { Firestore, doc, runTransaction, setDoc, Timestamp, updateDoc, FieldValue, arrayUnion, getDoc, onSnapshot, DocumentSnapshot, SnapshotOptions, DocumentData, query, collection, where, CollectionReference } from "firebase/firestore";
import { liveDb, db } from "../App";
import {AUErrors,UserID, BranchID, TaskboardSession, ClockSession, PunchType, PunchData, Timecard, ActiveUser } from "../au-types/index"
import { onChildAdded, onChildChanged, onChildRemoved, ref } from "firebase/database";
import { sassNull } from "sass";





const useTaskboard = (storeId: string): TaskboardSession => {
  const clock = useClock(storeId)


  return { clock, storeId }
}


const useClock = (storeId: string) : ClockSession => {
  const { currentTime, getCurrentDate } = useTime()
  const { punch, activeUsers, selectingTypeFor, setSelectingTypeFor, localIds } = usePunch(storeId)

  return { currentTime, getCurrentDate, punch, activeUsers, selectingTypeFor, setSelectingTypeFor, localIds }

}

const useTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const getCurrentDate = () => {
    let day = String();
    let month = String();
    let date = String();
    switch (currentTime.getDay()) {
      case 1:
        day = "Monday";
        break;
      case 2:
        day = "Tuesday";
        break;
      case 3:
        day = "Wednesday";
        break;
      case 4:
        day = "Thursday";
        break;
      case 5:
        day = "Friday";
        break;
      case 6:
        day = "Saturday";
        break;
      case 0:
        day = "Sunday";
        break;
      default:
        throw new Error();
    }
    switch (currentTime.getMonth()) {
      case 0:
        month = "January";
        break;
      case 1:
        month = "February";
        break;
      case 2:
        month = "March";
        break;
      case 3:
        month = "April";
        break;
      case 4:
        month = "May";
        break;
      case 5:
        month = "June";
        break;
      case 6:
        month = "July";
        break;
      case 7:
        month = "August";
        break;
      case 8:
        month = "September";
        break;
      case 9:
        month = "October";
        break;
      case 10:
        month = "November";
        break;
      case 11:
        month = "December";
        break;
      default:
        throw new Error();
    }
    switch (currentTime.getDate()) {
      case (1 || 21 || 31):
        date = currentTime.getDate() + "st";
        break;
      case (2 || 22):
        date = currentTime.getDate() + "nd";
        break;
      case (3 || 23):
        date = currentTime.getDate() + "rd";
        break;
      default:
        date = currentTime.getDate() + "th";
    }
    return `${day}, ${month} ${date}`;
  };
  useEffect(() => {
    const clock = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(clock);
  }, []);

  return { currentTime, getCurrentDate }
}


const usePunch = (storeId: string) => {
  const activesQ = query(collection(db, "actives"), where("storeId", "==", storeId))
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([])
  const [selectingTypeFor, setSelectingTypeFor] = useState<string | null>(null)
  const [localIds, setLocalIds] = useState({} as Object)

  const getLocalIds: (companyId: string) => Promise<Object> = useCallback(async (companyId: string) => {
    var result = {}
          await getDoc(doc(db, "companies", companyId)).then(snap => {
            if (snap.exists()) {
              let data = snap.data()
              result = data.localIds
            }
          })
    return result
  },[storeId])

  //onDbChange do:
  useEffect(() => {
    getLocalIds(storeId).then(res => {
      console.log(res)
      setLocalIds(res)
    })
    let unsub = onSnapshot(activesQ, (snap) => {
      snap.docChanges().forEach(change => {
        let data = change.doc.data()
        if (change.type === "added") {
          setActiveUsers(prev => {
            let newUser = new ActiveUser(change.doc.id, data.latestActivity, data.fullName, data.storeId)
            
            return [...prev, newUser]
          })
      }
        if (change.type === "modified") {
          console.log("modifying", activeUsers)
          setActiveUsers(prev => {
            let newDoc = prev
            const i = newDoc.findIndex(v => {
              return v.uid == change.doc.id
            })
            if (i >= 0) {
              newDoc[i].latestActivity = data.latestActivity
              newDoc[i].fullName = data.fullName
            }
            return newDoc
          })
      }
        if (change.type === "removed") {
          console.log("modifying", activeUsers)
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
    })
    return unsub
  }, [])
  

  const punch = (user: UserID, type: PunchType): void => {
    console.log("punching ", user, type)
    let selected = activeUsers.find(v => {
      return v.uid = user
    })
    if (selected?.latestActivity[selected.latestActivity.length - 1].type == type) {
      throw AUErrors.Punch.statusNotChanged
    }
    const date = new Date()
    const docRef = doc(db, `timecards/${date}_${user}}`)
    const activeRef = doc(db, `actives/${user}`)
    const punchData: PunchData = {} as PunchData
    const tc: Timecard = {} as Timecard
    punchData.time = Timestamp.now()
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
      setDoc(activeRef, {
        "storeId": storeId,
        "latestActivity": arrayUnion(punchData),
        "fullName": "Employee 1"
      }, {merge: true})
    } else {
      throw AUErrors.Punch.isNull
    }
  }
  return { punch, activeUsers, selectingTypeFor, setSelectingTypeFor, getLocalIds, localIds  }
}



export default useTaskboard