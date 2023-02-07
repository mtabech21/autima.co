import { DocumentData } from "firebase/firestore";
import { createContext} from "react";
export const UserContext = createContext<any>(null)

interface UserContextType {
  children: JSX.Element
  value: boolean | DocumentData | null | undefined
}


function UserContextProvider(props: UserContextType) {
  return (
    <UserContext.Provider value={props.value}>
      {props.children}
    </UserContext.Provider>
  )
}

export default UserContextProvider
