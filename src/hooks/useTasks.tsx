import { useEffect, useState } from "react"
import { StoreInfo } from "./useCompany"
import { Task, TaskStatus } from "../au-types"
import { Timestamp, collection, getDocs, query, where } from "firebase/firestore"
import { db } from "../App"

export const useTasks = (store: StoreInfo) => {
  const [tasks, setTasks] = useState([] as Task[])

  useEffect(() => {
    getTasks().then(res => {
      setTasks(res)
    })
  },[])

  const getTasks: () => Promise<Task[]> = async () => {
    const tasksQ = query(collection(db, "companies", store.companyId, "tasks"), where("storeId", "==", store.storeId))
    let result = [] as Task[]

    //EXAMPLE
    result.push(taskExample)
    
    getDocs(tasksQ).then(snaps => {
      snaps.forEach((snap) => {
        result.push(snap.data() as Task)
      })
    })
    return result
  }
  return { tasks }
} 


const taskExample = {
  title: "Receive Container",
  body: "Empty the fixtures from the container and place them accordingly with your store layout. Any extra fixtures should be organized cleanly in the storage area. (Please refer to the field manager's plan for your store below)",
  dateAdded: Timestamp.fromDate(new Date ()),
  dateDue: Timestamp.fromDate(new Date()),
  status: TaskStatus.new,
  hours: 50,
  assignedTo: ["5IsPGtugFQP0X5w9WIyy7YfNznh1"]
} as Task