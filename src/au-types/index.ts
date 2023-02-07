
import FS from "firebase/firestore"


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

export type TaskboardSession = {
  clock: ClockSession,
  branchID: BranchID
}

export type ClockSession = {
  currentTime: Date,
  getCurrentDate: () => string
  punch: (user: UserID, type: PunchType) => void
  activeUsers: ActiveUser[]
  selectingTypeFor: string | null
  setSelectingTypeFor: React.Dispatch<React.SetStateAction<string | null>>
  localIds: Object
}


export enum PunchType {
  in, out, meal, paid
}

export type PunchData = {
  type: PunchType
  time: FS.Timestamp
}
export type Timecard = {
  userID: UserID
  date: FS.Timestamp
  punches: [PunchData] | FS.FieldValue
  signedOff?: UserID
}
export class ActiveUser {
  uid: UserID
  branchID: BranchID
  fullName: string
  latestActivity: PunchData[]

  constructor(uid: UserID, latestActivity: PunchData[], fullName: string, branchID: BranchID) {
    this.uid = uid
    this.latestActivity = latestActivity
    this.fullName = fullName
    this.branchID = branchID
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




















