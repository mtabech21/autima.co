
import { useEffect, useState, useCallback} from "react"
import { Timestamp, query, collection, where,getDocs } from "firebase/firestore";
import { db } from "../App";
import {TaskboardSession, Task, TaskStatus } from "../au-types/index"
import { AutimaEmployee, StoreInfo } from "./useCompany";
import { useClock } from "./useClock";
import { useTasks } from "./useTasks";





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
        let emp = snap.data() as AutimaEmployee
        emp.uid = snap.id
        result.push(emp)
      })
    })
    return result
  },[store])
//CLOCK
  const clock = useClock(store)
  useEffect(() => {
    if (clock.activeUsers.length == 0) {
      setOnline(false)
    } else if (clock.activeUsers.length > 0) {
      setOnline(true)
    }
  }, [clock.updateListener])
//
  const { tasks } = useTasks(store)
  return { store, clock, tasks, employees, online }

}






export default useTaskboard