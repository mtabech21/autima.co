import { useCallback, useEffect, useState } from "react";
import { PunchData, PunchType, Timecard, UserID } from "../au-types";
import { collection, getDocs, query, where, Timestamp} from "firebase/firestore";
import { db } from "../App";
import { ProfileInfo } from "./useProfile";








const useTimecards = (employee: ProfileInfo) => {
  const [list, setList] = useState([] as Timecard[])
  const [reloadListener, setReloadListener] = useState(false)
  function reload() { setReloadListener(prev => !prev) }
  const [dateInterval, setDateInterval] = useState<null | {
    from: Date,
    to: Date
  }>(null)

  useEffect(() => {
    getTimecards().then(res => {
      setList(res)
    })
  
  },[reloadListener])

  const getTimecards: () => Promise<Timecard[]> = useCallback(async () => {
    let result = [] as Timecard[]
    if (employee == null) { throw "no employee" }
    if (dateInterval == null) { throw "no date"}
    const timecardsQ = query(collection(db, "companies", employee.companyId, "employees", employee.uid, "timecards"), where("date", ">", Timestamp.fromDate(dateInterval.from)), where("date", "<", dateInterval.to))
    console.log(timecardsQ)
    await getDocs(timecardsQ).then((snaps) => {
      snaps.forEach((snap) => {
        result.push(snap.data() as Timecard)
      })
    })
    return result
  }, [employee, dateInterval]) 

  function getDayTotal(punches: PunchData[]): number {
    let total = 0
    punches.forEach((punch, i, punches) => {
      switch (punch.type) {
        case PunchType.in:
          var nextPunch = punches[i+1]
          total += nextPunch.time.toDate().getTime() - punch.time.toDate().getTime()
        case PunchType.out:
        case PunchType.meal:
        case PunchType.paid:
          var nextPunch = punches[i+1]
          total += nextPunch.time.toDate().getTime() - punch.time.toDate().getTime()
      }
    })
    return total
  }
  
  return {reload, employee, dateInterval, setDateInterval, list, getDayTotal}
}

export default useTimecards