
import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react"
import { Firestore, doc, runTransaction, setDoc, Timestamp, updateDoc, FieldValue, arrayUnion, getDoc, onSnapshot, DocumentSnapshot, SnapshotOptions, DocumentData, query, collection, where, CollectionReference, deleteDoc, getDocs } from "firebase/firestore";
import { liveDb, db } from "../App";
import {AUErrors,UserID, BranchID, TaskboardSession, ClockSession, PunchType, PunchData, Timecard, ActiveUser, Task, TaskStatus } from "../au-types/index"
import { onChildAdded, onChildChanged, onChildRemoved, ref } from "firebase/database";
import { sassNull } from "sass";
import { AutimaEmployee, StoreInfo } from "./useCompany";





const useTaskboard = (store: StoreInfo): TaskboardSession => {
  const [employees, setEmployees] = useState([] as AutimaEmployee[])
  const [online, setOnline] = useState(false)

 

  useEffect(() => {
    getEmployees().then(res => {
      setEmployees(res)
    })
  }, [store])
  
  const getEmployees: () => Promise<AutimaEmployee[]> = useCallback(async () => {
    let result = [] as AutimaEmployee[]
    getDocs(collection(db, "companies", store.companyId, "employees")).then((snaps) => {
      snaps.forEach(snap => {
        result.push(snap.data() as AutimaEmployee)
      })
    })
    return result
  },[store])
  

  const clock = useClock(store)

  useEffect(() => {
    if (clock.activeUsers.length == 0) {
      setOnline(false)
    } else if (clock.activeUsers.length > 0) {
      setOnline(true)
    }
  }, [clock.updateListener])
  
  const { tasks } = useTasks(store)
  return { store, clock, tasks, employees, online }
}


const useClock = (store: StoreInfo): ClockSession => {
  const { currentTime, getCurrentDate } = useTime()
  const { punch, activeUsers, selectingTypeFor, setSelectingTypeFor, localIds, updateListener } = usePunch(store)

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
        const docRef = doc(db, "timecards", `${Timestamp.now().valueOf()}_${user.uid}`)
        let time = new Date(user.punches[0].time.toDate())
        time.setHours(0, 0, 0, 0)
        
        let date = Timestamp.fromDate(time)
        console.log(date)
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
  return { currentTime, getCurrentDate, punch, activeUsers, selectingTypeFor, setSelectingTypeFor, localIds, publish, updateListener }

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

const usePunch = (store: StoreInfo) => {
  const activesQ = query(collection(db, "companies", store.companyId, "actives"), where("storeId", "==", store.storeId))
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([])
  const [updateListener, setUpdateListener] = useState(false)
  const [selectingTypeFor, setSelectingTypeFor] = useState<string | null>(null)
  const [localIds, setLocalIds] = useState({} as Object)

  const getLocalIds: (companyId: string) => Promise<Object> = useCallback(async (companyId: string) => {
    var result = {}
    await getDoc(doc(db, "companies", companyId)).then(snap => {
        console.log(companyId)
        if (snap.exists()) {
          let data = snap.data()
          result = data.localIds
        }
      })
    return result
  },[store])

  //onDbChange do:
  useEffect(() => {
    
    
    getLocalIds(store.companyId).then(res => {
      setLocalIds(res)
      console.log(res)
    })
    let unsub = onSnapshot(activesQ, (snap) => {
      snap.docChanges().forEach(change => {
        let data = change.doc.data()
        if (change.type === "added") {
          setActiveUsers(prev => {
            let newUser = new ActiveUser(change.doc.id, data.punches, data.fullName, data.storeId)
            
            return [...prev, newUser]
          })
      }
        if (change.type === "modified") {
          setActiveUsers(prev => {
            let newDoc = prev
            const i = newDoc.findIndex(v => {
              return v.uid == change.doc.id
            })
            if (i >= 0) {
              newDoc[i].punches = data.punches
              newDoc[i].fullName = data.fullName
            }
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
  

  const punch = (user: UserID, type: PunchType): void => {
    let selected = activeUsers.find(v => {
      return v.uid = user
    })
    if (selected?.punches[selected.punches.length - 1].type == type) {
      throw AUErrors.Punch.statusNotChanged
    }
    const activeRef = doc(db, "companies", store.companyId, "actives", user)
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
        "storeId": store.storeId,
        "punches": arrayUnion(punchData),
      }, {merge: true})
    } else {
      throw AUErrors.Punch.isNull
    }
  }
  return { punch, activeUsers, selectingTypeFor, setSelectingTypeFor, getLocalIds, localIds, updateListener  }
}

const useTasks = (store: StoreInfo) => {
  const [tasks, setTasks] = useState([] as Task[])

  useEffect(() => {
    getTasks().then(res => {
      setTasks(res)
    })
  },[])

  const getTasks: () => Promise<Task[]> = async () => {
    const tasksQ = query(collection(db, "companies", store.companyId, "tasks"), where("storeId", "==", store.storeId))
    let result = [] as Task[]
    result.push({
      title: "Receive Container",
      body: "Empty the fixtures from the container and place them accordingly with your store layout. Any extra fixtures should be organized cleanly in the storage area. (Please refer to the field manager's plan for your store below)",
      dateAdded: Timestamp.fromDate(new Date ()),
      dateDue: Timestamp.fromDate(new Date()),
      status: TaskStatus.new,
      hours: 50,
      assignedTo: ["BjaJWVTlupPjG8cjLuWSLmwowle2"]
    } as Task)
    getDocs(tasksQ).then(snaps => {
      snaps.forEach((snap) => {
        result.push(snap.data() as Task)
      })
    })
    return result
  }
  return { tasks }
} 

export default useTaskboard