import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import HomeView from "./pages/home-view/HomeView";
import { Topbar } from "./topbar/Topbar";
import Sidebar from "./sidebar/Sidebar";
import StoresView from "./pages/stores/StoresView";
import SingleStoreView from "./pages/stores/components/SingleStoreView";
import styles from  "./app.module.scss"
import { UserContext } from "../../UserContext";
import Loading from "../loading/Loading";
import { getFunctions, httpsCallable } from "firebase/functions";
import { app } from "../../App";
import EmployeesView from "./pages/employees/EmployeesView";
import EmployeeOnboardView from "./pages/employees/onboarding/EmployeeOnboardView";
import useCompany, { CompanyContext } from "../../hooks/useCompany";
import { companyContext } from "../../hooks/useCompany";

function AutimaApp() {
  const nav = useNavigate()
  const current = useContext(UserContext)
  const [view, setView] = useState(<Loading/>)
  useEffect(() => {
    current.user?.getIdTokenResult(true).then(v => {
      if (v.claims.isBusinessAccount === true) {
        setView(<AdminApp companyId={current.user!.uid} />)
      } else {
        setView(<EmployeeApp />)
      }
    })
    nav("/home")
  },[])
  return (
    <>
      {
         view
      }
    </>
  );


}
const TopbarSafezone = () => {
    return <div className={styles.topbarSafezone} />
}

const EmployeeApp = () => {
  let functions = getFunctions(app)
  return (
    <div>
      <button onClick={e => {
            e.preventDefault()
        httpsCallable(functions, "setAsBusiness")({ bool: true }).then(() => {
          window.location.reload()
            })
          
          }}>CONVERT TO BUSINESS ACCOUNT</button>
    </div>
  )
}
interface AdminAppProps {
  companyId: string
}



const AdminApp = (props: AdminAppProps) => {
  let appWindow = useRef() as  React.MutableRefObject<HTMLInputElement>;
  const [scrollState, setScrollState] = useState<number>(0);
  useEffect(() => {
    appWindow.current.addEventListener("scroll", () => {
      setScrollState(appWindow.current.scrollTop);
    });
  });

  const company: CompanyContext = useCompany(props.companyId)

  return (
    <companyContext.Provider value={company}><Sidebar /><div ref={appWindow} className={styles.managerApp}>
      <div
        className={styles.topbarContainer}
        style={scrollState > 5
          ? {
            background: "white",
            boxShadow: "0px 0px 2px 0px gray",
            transition: "all 300ms ease",
          }
          : {}}
      >
        <Topbar />
      </div>
      <TopbarSafezone />
      <Routes>
        <Route path="*" element={<HomeView />} />
        <Route path={"/stores"}>
          <Route path={":storeID"} element={<SingleStoreView />} />
          <Route path={""} element={<StoresView />} />
        </Route>
        <Route path={"/payroll"}>
        </Route>
        <Route path={"/employees"}>
          <Route path={""} element={<EmployeesView />}/>
          <Route path={"onboard"} element={<EmployeeOnboardView/>}/>
        </Route>
        <Route path={"/messages"}>
        </Route>
        <Route path={"/tasks"}>

        </Route>
      </Routes>
    </div></companyContext.Provider>
  )
}



export default AutimaApp;
