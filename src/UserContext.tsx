import { Auth, User } from "firebase/auth";
import { DocumentData } from "firebase/firestore";
import { createContext } from "react";


interface UserContextType {
  profile: DocumentData | null
  user: User | null
  loading: boolean
}

export const UserContext = createContext<UserContextType>({} as UserContextType)




