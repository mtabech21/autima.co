import { useCallback, useEffect, useState } from "react";
import { DateInterval, PunchData, PunchType, Timecard, UserID } from "../au-types";
import { collection, getDocs, query, where, Timestamp} from "firebase/firestore";
import { db } from "../App";
import { ProfileInfo } from "./useProfile";





export interface TimecardSession {
  reload: () => void,
  employee: ProfileInfo,
  dateInterval: {
    from: Date;
    to: Date;
} | null,
  setDateInterval: React.Dispatch<React.SetStateAction<DateInterval | null>>,
  list: Timecard[]
  getDayTotal: (punches: PunchData[]) => number
  getCurrentPeriod: () => DateInterval
}

const useTimecards = (employee: ProfileInfo): TimecardSession => {
  const [reloadListener, setReloadListener] = useState(false)
  function reload() { setReloadListener(prev => !prev) }

  const [list, setList] = useState([] as Timecard[])

  const [dateInterval, setDateInterval] = useState<null | DateInterval>(null)

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
  const getCurrentPeriod = (): DateInterval => {
    let to = new Date()
    let from = new Date()
    if (to.getDate() <= 15) {
      from.setDate(0)
      to.setDate(15)
    } else if (to.getDate() > 15) {
      from.setDate(16)
      to.setMonth(to.getMonth() + 1,0)
    }
    return {from, to}
  }
  return {reload, employee, dateInterval, setDateInterval, list, getDayTotal, getCurrentPeriod}
}

export default useTimecards