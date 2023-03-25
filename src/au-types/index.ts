
import FS from "firebase/firestore"
import { AutimaEmployee, StoreInfo } from "../hooks/useCompany"

//AUTIMA TYPES
export type AUEmployee = {

}
export type AUStore = {

}
export type AUCompany = {

}



export namespace AUErrors {
  export enum Punch {
    isNull, statusNotChanged
  }
  export enum DBFetch {
    noSnap
  }
}

export type UserID = string
export type BranchID = string
export type CompanyID = string

export type TaskboardSession = {
  clock: ClockSession,
  store: StoreInfo,
  tasks: Task[]
  employees: AutimaEmployee[]
  online: boolean
}

export type ClockSession = {
  currentTime: Date,
  getCurrentDate: () => string
  punch: (user: UserID, type: PunchType) => void
  activeUsers: ActiveUser[]
  selectingTypeFor: string | null
  setSelectingTypeFor: React.Dispatch<React.SetStateAction<string | null>>
  publish: () => void,
  updateListener: boolean
}
export type DateInterval = {
  from: Date,
  to: Date
}

export enum PunchType {
  in, out, meal, paid
}

export type PunchData = {
  punchData: FirebaseFirestore.Timestamp
  type: PunchType
  time: FS.Timestamp
}
export type Timecard = {
  uid: UserID
  date: FS.Timestamp
  punches: [PunchData]
}
export class ActiveUser {
  uid: UserID
  branchID: BranchID
  fullName: string
  punches: PunchData[]

  constructor(uid: UserID, punches: PunchData[], fullName: string, branchID: BranchID) {
    this.uid = uid
    this.punches = punches
    this.fullName = fullName
    this.branchID = branchID
  }
}

export type Task = {
  addedBy: UserID
  dateAdded: FS.Timestamp,
  dateDue: FS.Timestamp,
  title: string,
  body: string,
  status: TaskStatus,
  hours?: number,
  checkList?: CheckEntity[]
  assignedTo?: [UserID]
}

export type CheckEntity = {
  body: string,
  checked: boolean
}

export enum TaskStatus {
  new, seen, completed, overdue, dueSoon, important
}

export function TaskStatusFrom(num: number): TaskStatus {
  switch (num) {
    case TaskStatus.completed.valueOf():
      return TaskStatus.completed
    case TaskStatus.dueSoon.valueOf():
      return TaskStatus.dueSoon
    case TaskStatus.important.valueOf():
      return TaskStatus.important
    case TaskStatus.new.valueOf():
      return TaskStatus.new
    case TaskStatus.overdue.valueOf():
      return TaskStatus.overdue
    case TaskStatus.seen.valueOf():
      return TaskStatus.seen
    default:
      return TaskStatus.seen
  }
}

export function PunchTypeFrom(num: number): PunchType {
  switch (num) {
    case PunchType.in.valueOf():
      return PunchType.in
    case PunchType.out.valueOf():
      return PunchType.out
    case PunchType.meal.valueOf():
      return PunchType.meal
    case PunchType.paid.valueOf():
      return PunchType.paid
    default:
      return PunchType.out
  }
}




















